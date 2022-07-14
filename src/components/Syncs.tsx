import * as React from "react";
import {mx} from "../services/MatrixService";
import SyncsItem from "./SyncsItem";
const Syncs: React.FC = () => {
    const syncs = mx.getSyncs();
    return (
        <>
            <h2>Sync Data</h2>
            {syncs.length > 0 && (
                <ul>
                    {syncs.map((sync: any, index: number) => {
                        return <SyncsItem key={"syncs_" + index} item={sync} />;
                    })}
                </ul>
            )}
        </>
    );
};

export default Syncs;
