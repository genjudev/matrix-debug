import * as React from "react";
//@ts-ignore
import {JSONTree} from "react-json-tree";

const RoomsItem: React.FC<{item: any}> = ({item}) => {
    const [clicked, setClicked] = React.useState(false);

    const memberNames = item.members.map((m: any) => m.displayname).join(",");
    return (
        <>
            <li
                style={{
                    border: "2px solid black",
                    margin: ".5rem",
                    cursor: "pointer",
                    listStyle: "none",
                }}
                onClick={() => setClicked(!clicked)}
            >
                {item.name || `${memberNames} - ${item.roomId}`}
            </li>
            {clicked && (
                <li style={{backgroundColor: "lightgrey", listStyle: "none"}}>
                    <JSONTree data={item} />
                </li>
            )}
        </>
    );
};

export default RoomsItem;
