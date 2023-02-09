import {Action, configureStore, ThunkAction} from "@reduxjs/toolkit";
import roomsReducer from "./reducer/rooms";
import syncsReducer from "./reducer/syncs";
import usersReducer from "./reducer/users";

const store = configureStore({
    reducer: {
        rooms: roomsReducer,
        users: usersReducer,
        syncs: syncsReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;

export default store;
