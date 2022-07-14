import * as React from "react";
import {TRoom} from "../lib/Matrix";
import RoomsItem from "./RoomsItem";
const Rooms: React.FC<{rooms: TRoom[]}> = ({rooms}) => {
    return (
        <>
            <h2>Rooms</h2>
            <p>Direct Chats have no name, so we add the members.</p>
            {rooms.length > 0 && (
                <ul>
                    {rooms.map((r, index) => (
                        <RoomsItem key={"rooms_" + index} item={r} />
                    ))}
                </ul>
            )}
        </>
    );
};

export default Rooms;
