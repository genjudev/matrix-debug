import React from "react";
import "./App.css";
import LoginForm from "./components/LoginForm";
import Rooms from "./components/Rooms";
import ServerSideRoomKeys from "./components/ServerSideRoomKeys";
import Syncs from "./components/Syncs";
import User from "./components/User";
import {mx} from "./services/MatrixService";
import {TUser, TRoom} from "./lib/Matrix";
import _ from "lodash";

function App() {
    const [nav, setNav] = React.useState(0);
    const [syncs, setSyncs] = React.useState([]);
    const [rooms, setRooms] = React.useState<TRoom[]>([]);
    const [users, setUsers] = React.useState<TUser[]>([]);

    React.useEffect(() => {
        if (!mx.getAccessInfo()) {
            mx.addEventListener("LOGIN_SUCCESS", prepareListener);
        } else {
            prepareListener();
            mx.sync();
        }
        return () => {
            removeListener();
        };
    }, [nav]);

    const prepareListener = () => {
        mx.addEventListener("SYNC_UPDATE", loadData);
    };
    const removeListener = () => {
        mx.removeEventListener("LOGIN_SUCCESS", prepareListener);
        mx.removeEventListener("SYNC_UPDATE", loadData);
    };
    const loadData = () => {
        setSyncs(mx.getSyncs());
        setRooms(_.cloneDeep(mx.getRooms()));
        setUsers(_.cloneDeep(mx.getUsers()));
    };
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
                            <button onClick={() => setNav(1)}>Rooms</button>
                            <button onClick={() => setNav(2)}>User</button>
                            <button onClick={() => setNav(3)}>Backup</button>
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
                    {nav === 1 && <Rooms rooms={rooms} />}
                    {nav === 2 && <User users={users} />}
                    {nav === 3 && <ServerSideRoomKeys />}
                </>
            ) : (
                <h1>logged in</h1>
            )}
        </div>
    );
}

export default App;
