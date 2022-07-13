const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8080/";

type TMatrixAccessInfo = {
    access_token: string;
    device_id: string;
    home_server: string;
    user_id: string;
};

type TServiceProps = {
    store?: {accessInfo: TMatrixAccessInfo};
};

type TStorage = {
    syncs: any;
};

class MatrixService {
    private accessInfo: TMatrixAccessInfo | null = null;
    private storage: TStorage = {
        syncs: [],
    };
    private syncActive: boolean = false;

    constructor({store}: TServiceProps) {
        if (store) {
            this.accessInfo = store.accessInfo || null;
        }
    }

    getAccessInfo = () => this.accessInfo;
    getSyncs = () => this.storage.syncs;

    login = async (username: string, password: string) => {
        try {
            const res = await fetch(BASE_URL + "login", {
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
                this.accessInfo = await res.json();
            } else {
                this.accessInfo = null;
            }

            this.save();
            return res.ok;
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    sync: any = async ({cb}: {cb?: (arg: any) => void}) => {
        if (this.accessInfo === null || !this.accessInfo?.access_token) return;
        try {
            if (this.syncActive) return;
            this.syncActive = true;
            const lastBatch =
                this.storage.syncs.length > 0
                    ? this.storage.syncs[this.storage.syncs.length - 1]
                          .next_batch
                    : null;

            const res = await fetch(
                `${BASE_URL}sync?access_token=${
                    this.accessInfo.access_token
                }&timeout=30000&${lastBatch ? "&since=" + lastBatch : ""}`,
            );
            if (res.ok) {
                const jsonRes = await res.json();
                const found = this.storage.syncs.find(
                    (sync: any) => sync.next_batch === jsonRes.next_batch,
                );
                if (!found) {
                    this.storage.syncs = [...this.storage.syncs, jsonRes];
                }
                if (cb) {
                    cb(jsonRes);
                }
                this.syncActive = false;

                return this.sync({cb});
            }
        } catch (e) {
            console.error(e);
            this.syncActive = false;

            return false;
        }
    };

    private save = () => {
        localStorage.setItem(
            "store",
            JSON.stringify({
                accessInfo: this.accessInfo,
            }),
        );
    };
}

const localStore = localStorage.getItem("store");
const mx = new MatrixService({
    store: localStore !== null ? JSON.parse(localStore) : {},
});

export {mx};
