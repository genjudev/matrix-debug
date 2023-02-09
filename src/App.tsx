import React from "react";
import "./App.css";
import LoginForm from "./components/LoginForm";
import Rooms from "./components/Rooms";
import ServerSideRoomKeys from "./components/ServerSideRoomKeys";
import Syncs from "./components/Syncs";
import User from "./components/User";
import { useAppDispatch } from "./hooks";
import { update as updateRooms } from "./reducer/rooms";
import { update as updateSyncs } from "./reducer/syncs";
import { update as updateUsers } from "./reducer/users";
import { mx } from "./services/MatrixService";

function App() {
    const dispatch = useAppDispatch();

    const [nav, setNav] = React.useState(0);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nav]);

    const prepareListener = () => {
        mx.addEventListener("SYNC_UPDATE", loadData);
    };
    const removeListener = () => {
        mx.removeEventListener("LOGIN_SUCCESS", prepareListener);
        mx.removeEventListener("SYNC_UPDATE", loadData);
    };
    const loadData = () => {
        dispatch(updateSyncs());
        dispatch(updateRooms());
        dispatch(updateUsers());
    };
    return (
        <div>
            {mx.getAccessInfo() === null ? (
                <LoginForm />
            ) :
                <>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <a href="https://github.com/larsonnn/matrix-debug">
                            <img
                                src="/GitHub-Mark-64px.png"
                                alt="GitHub Logo"
                            />
                        </a>
                    </div>
                    <div>
                        {/* to lazy for nav ...*/}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <div>
                                <button onClick={() => setNav(0)}>Syncs</button>
                                <button onClick={() => setNav(1)}>Rooms</button>
                                <button onClick={() => setNav(2)}>User</button>
                                <button onClick={() => setNav(3)}>
                                    Backup
                                </button>
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
                        {nav === 1 && <Rooms />}
                        {nav === 2 && <User />}
                        {nav === 3 && <ServerSideRoomKeys />}
                    </div>
                </>
            }
        </div>
    );
}

export default App;
