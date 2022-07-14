import * as React from "react";
//@ts-ignore
import {JSONTree} from "react-json-tree";

const UserItem: React.FC<{item: any}> = ({item}) => {
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
                <span
                    style={{
                        color: `${
                            item.presence === "online" ? "green" : "red"
                        }`,
                    }}
                >{`${item.displayname} - ${item.presence || ""}`}</span>
            </li>
            {clicked && (
                <li style={{backgroundColor: "lightgrey", listStyle: "none"}}>
                    <JSONTree data={item} />
                </li>
            )}
        </>
    );
};

export default UserItem;
