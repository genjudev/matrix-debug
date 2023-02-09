import * as React from "react";
import { useAppSelector } from "../hooks";
import { selectUsers } from "../reducer/users";
import UserItem from "./UserItem";

const User: React.FC = () => {
    const users = useAppSelector(selectUsers);
    if (!users) return <></>

    return (
        <>
            <h2>User</h2>
            <p>sorted by online status</p>
            <ul>
                {users.map((u, index) => (
                    <UserItem key={"users_" + index} item={u} />
                ))}
            </ul>
        </>
    );
};

export default User;
