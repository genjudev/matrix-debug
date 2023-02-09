import {createSlice} from "@reduxjs/toolkit";
import {mx} from "../services/MatrixService";
import {RootState} from "../store";

export interface UserState {
    list: any;
}
const initialState: UserState = {
    list: [],
};

export const roomsSlice = createSlice({
    name: "syncs",
    initialState,
    reducers: {
        update: (state) => {
            state.list = mx.getSyncs();
        },
    },
});

// Action creators are generated for each case reducer function
export const {update} = roomsSlice.actions;

export const selectSyncs = (state: RootState) => state.syncs.list;

export default roomsSlice.reducer;
