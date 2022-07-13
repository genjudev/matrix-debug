import React from "react";
import "./App.css";
import LoginForm from "./components/LoginForm";
import Syncs from "./components/Syncs";
import {mx} from "./services/MatrixService";

function App() {
    const [syncs, setSyncs] = React.useState([]);

    React.useEffect(() => {
        if (mx.getAccessInfo()) {
            mx.sync({
                cb: () => {
                    setSyncs(mx.getSyncs());
                },
            });
        }
    });
    return (
        <div>
            {mx.getAccessInfo() === null ? (
                <LoginForm />
            ) : syncs.length > 0 ? (
                <Syncs />
            ) : (
                <h1>logged in</h1>
            )}
        </div>
    );
}

export default App;
