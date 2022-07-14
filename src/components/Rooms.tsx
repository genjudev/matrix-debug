import * as React from "react";
import {mx} from "../services/MatrixService";
import RoomsItem from "./RoomsItem";
const Rooms: React.FC = () => {
    const rooms = mx.getRooms();
    return (
        <>
            <h2>Rooms</h2>
            <p>Direct Chats have no name, so we add the members.</p>
            {rooms.length > 0 && (
                <ul>
                    {rooms.map((r, index) => (
                        <RoomsItem item={r} />
                    ))}
                </ul>
            )}
        </>
    );
};

export default Rooms;
