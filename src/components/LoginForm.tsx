import * as React from "react";
import {mx} from "../services/MatrixService";
const LoginForm: React.FC = () => {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [baseUrl, setBaseUrl] = React.useState("");

    const onSubmit = async (evt: any) => {
        evt.preventDefault();
        await mx.login(username, password, baseUrl);
        setUsername("");
        setPassword("");
        setBaseUrl("");
        window.location.reload();
    };

    return (
        <>
            {mx.getAccessInfo() === null ? (
                <form onSubmit={onSubmit}>
                    <label>Server</label>
                    <input
                        type="text"
                        name="server"
                        autoComplete="server"
                        value={baseUrl}
                        onChange={(evt) => setBaseUrl(evt.target.value)}
                    />
                    <br />
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        name="username"
                        autoComplete="email"
                        onChange={(evt) => setUsername(evt.target.value)}
                        placeholder="email"
                    />
                    <br />

                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        name="password"
                        onChange={(evt) => setPassword(evt.target.value)}
                        placeholder=""
                    />
                    <br />
                    <input type="submit" value="Login" />
                </form>
            ) : (
                <>Logged In </>
            )}
        </>
    );
};

export default LoginForm;
