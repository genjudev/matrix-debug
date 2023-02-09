import * as React from "react";
import { useAppSelector } from "../hooks";
import { selectSyncs } from "../reducer/syncs";
import SyncsItem from "./SyncsItem";

const Syncs: React.FC = () => {
    const syncs = useAppSelector(selectSyncs);
    return (
        <>
            <h2>Sync Data</h2>
            <ul>
                {syncs.map((sync: any, index: number) => {
                    return <SyncsItem key={"syncs_" + index} item={sync} />;
                })}
            </ul>
        </>
    );
};

export default Syncs;
