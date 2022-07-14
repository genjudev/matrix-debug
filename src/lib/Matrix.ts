import DelegatedEventTarget from "./DelegateEventTarget";

const SUFFIX = "/_matrix/client/r0/";

type TMatrixAccessInfo = {
    access_token: string;
    device_id: string;
    home_server: string;
    user_id: string;
    url: string;
};

type TServiceProps = {
    store?: {accessInfo: TMatrixAccessInfo};
};
export type TRoom = {
    name: string;
    state: any;
    timeline: any;
    roomId: string;
    members: any;
};
export type TUser = {
    displayname: string;
    sender: string;
    avatar_url: string;
    presence: string;
};

type TStorage = {
    syncs: any;
    user: TUser[];
    rooms: TRoom[];
};

export default class Matrix extends DelegatedEventTarget {
    private accessInfo: TMatrixAccessInfo | null = null;
    private storage: TStorage = {
        syncs: [],
        user: [],
        rooms: [],
    };
    private syncActive: boolean = false;

    constructor({store}: TServiceProps) {
        super();
        if (store) {
            this.accessInfo = store.accessInfo || null;
        }
    }

    getAccessInfo = () => this.accessInfo;
    getSyncs = () => this.storage.syncs;
    getUsers = () => this.storage.user;
    getRooms = () => this.storage.rooms;

    login = async (username: string, password: string, baseUrl: string) => {
        try {
            const url = new URL(SUFFIX, baseUrl).toString();
            const res = await fetch(new URL("login", url), {
                method: "POST",
                body: JSON.stringify({
                    type: "m.login.password",
                    identifier: {
                        address: username,
                        medium: "email",
                        type: "m.id.thirdparty",
                    },
                    password,
                }),
            });
            if (res.ok) {
                const accessData = await res.json();
                this.accessInfo = {
                    ...accessData,
                    url,
                };
            } else {
                this.accessInfo = null;
            }

            this.save();

            this.dispatchEvent(new Event("LOGIN_SUCCESS"));
            return res.ok;
        } catch (e) {
            console.error(e);
            this.dispatchEvent(new Event("LOGIN_FAILED"));
            return false;
        }
    };

    sync: any = async () => {
        if (this.accessInfo === null || !this.accessInfo?.access_token) return;
        try {
            if (this.syncActive) return;
            this.syncActive = true;
            const lastBatch =
                this.storage.syncs.length > 0
                    ? this.storage.syncs[this.storage.syncs.length - 1]
                          .next_batch
                    : null;

            const res = await this.authRequest(
                new URL(
                    `sync?timeout=30000&${
                        lastBatch ? "&since=" + lastBatch : ""
                    }`,
                    this.accessInfo.url,
                ),
            );
            if (res.ok) {
                const jsonRes = await res.json();
                const found = this.storage.syncs.find(
                    (sync: any) => sync.next_batch === jsonRes.next_batch,
                );
                if (!found) {
                    this.storage.syncs = [...this.storage.syncs, jsonRes];
                }
                // prototype of getting user info
                if (this.storage.syncs.length > 0) {
                    this.storage.syncs.forEach((sync: any) => {
                        // rooms
                        Object.keys(sync.rooms.join).forEach((k) => {
                            sync.rooms.join[k].state.events.forEach(
                                (evt: any) => {
                                    this.storeEvent(k, sync.rooms.join[k], evt);
                                    this.storeRoom(k)(sync.rooms.join[k]);
                                },
                            );
                        });

                        // presence
                        sync.presence.events.forEach((presenceEvent: any) => {
                            const {sender, content} = presenceEvent;
                            this.storage.user.forEach((u, index) => {
                                let presence = "offline";
                                if (u.sender === sender) {
                                    presence = content.presence;
                                }
                                this.storage.user[index].presence = presence;
                            });
                        });
                    });
                }

                this.syncActive = false;
                this.dispatchEvent(new Event("SYNC_UPDATE"));
                return this.sync();
            }
        } catch (e) {
            console.error(e);
            this.syncActive = false;
            return false;
        }
    };

    getBackup = async () => {
        if (!this.accessInfo) return;

        const res = await this.authRequest(
            new URL("room_keys/version", this.accessInfo.url),
        );
        if (res.ok) {
            return await res.json();
        }
        return res.ok;
    };

    private storeEvent = (id: string, room: any, evt: any) => {
        switch (evt.type) {
            case "m.room.member":
                this.storeUser(evt);
                break;
        }
    };
    private storeUser = (evt: any) => {
        const found = this.storage.user.find(
            (u) => u.displayname === evt.content.displayname,
        );
        if (!found) {
            this.storage.user = [
                ...this.storage.user,
                {...evt.content, ...evt},
            ];
        }
    };
    private storeRoom = (roomId: string) => {
        return (room: any) => {
            const found = this.storage.rooms.find((r) => r.roomId === roomId);
            if (!found) {
                const nameEvent = room.state.events.find(
                    (evt: any) => evt.type === "m.room.name",
                );
                const memberEvent = room.state.events.filter(
                    (evt: any) => evt.type === "m.room.member",
                );
                const members = memberEvent.map((evt: any) => {
                    return {...evt.content};
                });
                this.storage.rooms = [
                    ...this.storage.rooms,
                    {
                        roomId,
                        name: nameEvent?.content?.name,
                        timeline: room.timeline,
                        state: room.state,
                        members,
                    },
                ];
            }
        };
    };

    private save = () => {
        localStorage.setItem(
            "store",
            JSON.stringify({
                accessInfo: this.accessInfo,
            }),
        );
    };

    private authRequest = async (url: string | URL, options?: RequestInit) => {
        if (!this.accessInfo?.access_token) {
            throw new Error("REQUEST_NO_AUTH");
        }
        const requestUrl = new URL(url);
        requestUrl.searchParams.append(
            "access_token",
            this.accessInfo?.access_token,
        );
        const res = await fetch(requestUrl, options);
        return res;
    };
}
