import * as React from "react";
import {mx} from "../services/MatrixService";
const LoginForm: React.FC = () => {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSubmit = async (evt: any) => {
        evt.preventDefault();
        await mx.login(username, password);
        setUsername("");
        setPassword("");
    };

    return (
        <>
            {mx.getAccessInfo() === null ? (
                <form onSubmit={onSubmit}>
                    <input
                        type="text"
                        value={username}
                        onChange={(evt) => setUsername(evt.target.value)}
                        placeholder="email"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(evt) => setPassword(evt.target.value)}
                        placeholder=""
                    />
                    <input type="submit" value="Login" />
                </form>
            ) : (
                <>Logged In </>
            )}
        </>
    );
};

export default LoginForm;
