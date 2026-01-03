
import { configureStore } from "@reduxjs/toolkit";
import contactSlice from "./contactList";


export const store = configureStore({
    reducer: {
        contact : contactSlice.reducer,
    },
});