import {createSlice} from "@reduxjs/toolkit";
import {mx} from "../services/MatrixService";
import {TUser} from "../lib/Matrix";
import {RootState} from "../store";

export interface UserState {
    list: TUser[];
}
const initialState: UserState = {
    list: [],
};

export const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        update: (state) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            const users = [...mx.getUsers()];
            if (!users || !Array.isArray(users)) return;

            users.sort((a: TUser, b: TUser) => {
                const aValue = a.presence === "online" ? 0 : 1;
                const bValue = b.presence === "online" ? 0 : 1;
                if (aValue > bValue) return 1;
                if (aValue === bValue) return 0;
                return -1;
            });
            state.list = users;
        },
    },
});

// Action creators are generated for each case reducer function
export const {update} = usersSlice.actions;

export const selectUsers = (state: RootState) => state.users.list;

export default usersSlice.reducer;
