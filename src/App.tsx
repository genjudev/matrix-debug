import React from "react";
import "./App.css";
import LoginForm from "./components/LoginForm";
import ServerSideRoomKeys from "./components/ServerSideRoomKeys";
import Syncs from "./components/Syncs";
import User from "./components/User";
import {mx} from "./services/MatrixService";

function App() {
    const [nav, setNav] = React.useState(0);
    const [syncs, setSyncs] = React.useState([]);

    React.useEffect(() => {
        if (mx.getAccessInfo()) {
            mx.sync({
                cb: () => {
                    setSyncs(mx.getSyncs());
                },
            });
        }
    }, [nav]);
    return (
        <div>
            {mx.getAccessInfo() === null ? (
                <LoginForm />
            ) : syncs.length > 0 ? (
                <>
                    {/* to lazy for nav ...*/}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <div>
                            <button onClick={() => setNav(0)}>Syncs</button>
                            <button onClick={() => setNav(1)}>User</button>
                            <button onClick={() => setNav(2)}>Backup</button>
                        </div>
                        <div>
                            <button
                                onClick={() => {
                                    localStorage.clear();
                                    window.location.reload();
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                    <br />
                    {nav === 0 && <Syncs />}
                    {nav === 1 && <User />}
                    {nav === 2 && <ServerSideRoomKeys />}
                </>
            ) : (
                <h1>logged in</h1>
            )}
        </div>
    );
}

export default App;
