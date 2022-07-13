import * as React from "react";
import {mx} from "../services/MatrixService";
const User: React.FC = () => {
    const users = mx.getUsers();
    return (
        <>
            <h2>User</h2>
            {users.length > 0 && (
                <ul>
                    {users.map((u, index) => (
                        <li key={index}>{u.displayname}</li>
                    ))}
                </ul>
            )}
        </>
    );
};

export default User;
