import * as React from "react";
import {mx} from "../services/MatrixService";
import {JSONTree} from "react-json-tree";

const ServerSideRoomKeys: React.FC = () => {
    const [backup, setBackup] = React.useState({});

    React.useEffect(() => {
        mx.getBackup().then(setBackup);
    }, []);
    return <JSONTree data={backup} />;
};

export default ServerSideRoomKeys;
