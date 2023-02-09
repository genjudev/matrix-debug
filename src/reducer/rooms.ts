import {createSlice} from "@reduxjs/toolkit";
import {mx} from "../services/MatrixService";
import {TRoom} from "../lib/Matrix";
import {RootState} from "../store";

export interface RoomState {
    list: TRoom[];
}
const initialState: RoomState = {
    list: [],
};

export const roomsSlice = createSlice({
    name: "rooms",
    initialState,
    reducers: {
        update: (state) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.list = mx.getRooms();
        },
    },
});

// Action creators are generated for each case reducer function
export const {update} = roomsSlice.actions;

export const selectRooms = (state: RootState) => state.rooms.list;

export default roomsSlice.reducer;
