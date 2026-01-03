import {createSlice} from '@reduxjs/toolkit';  

const contactSlice = createSlice({
    name: 'contact',
    initialState: {
        contacts: [],
        loading: true,
        refreshing: false,
    },
    reducers: {
        addContact(state, action) {
            // if payload is an array (initial load), replace contacts; otherwise prepend single contact
            if (Array.isArray(action.payload)) {
                state.contacts = action.payload;
            } else {
                state.contacts.unshift(action.payload);
            }
        },
        removeContact(state, action) {
            // server uses _id
            state.contacts = state.contacts.filter(contact => contact._id !== action.payload);
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setRefreshing(state, action) {
            state.refreshing = action.payload;
        }
    }
})

export const { addContact, removeContact, setLoading, setRefreshing } = contactSlice.actions;
export default contactSlice;