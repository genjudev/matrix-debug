import * as React from "react";
import {TUser} from "../lib/Matrix";
import UserItem from "./UserItem";
import * as _ from "lodash";

const User: React.FC<{users: TUser[]}> = ({users}) => {
    // we need to clone the users object to avoid side effects
    const _clone = _.cloneDeep(users);
    _clone.sort((a: TUser, b: TUser) => {
        const aValue = a.presence === "online" ? 0 : 1;
        const bValue = b.presence === "online" ? 0 : 1;
        if (aValue > bValue) return 1;
        if (aValue === bValue) return 0;
        return -1;
    });

    return (
        <>
            <h2>User</h2>
            <p>sorted by online status</p>
            {_clone.length > 0 && (
                <ul>
                    {_clone.map((u, index) => (
                        <UserItem key={"users_" + index} item={u} />
                    ))}
                </ul>
            )}
        </>
    );
};

export default User;
