import * as React from "react";
//@ts-ignore
import {JSONTree} from "react-json-tree";

const SyncsItem: React.FC<{item: any}> = ({item}) => {
    const [clicked, setClicked] = React.useState(false);

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
                {item.next_batch}
            </li>
            {clicked && (
                <li style={{backgroundColor: "lightgrey", listStyle: "none"}}>
                    <JSONTree data={item} />
                </li>
            )}
        </>
    );
};

export default SyncsItem;
