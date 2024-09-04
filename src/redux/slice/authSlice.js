/** @format */

import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        suggestUser: [],
        userProfile: null,
        selectedUser: null,
    },
    reducers: {
        setAuthUser: (state, action) => {
            // setAuthUser is function main hum jo bhe data pass karange vo hume action main receive hoga
            //     or fir ousi action ki value hum ies user main dal denge jo state main define kiya gya hai
            state.user = action.payload;
        },
        setsuggestUser: (state, action) => {
            state.suggestUser = action.payload;
        },

        setUserProfile: (state, action) => {
            state.userProfile = action.payload;
        },
        setselectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
    },
});
export const { setAuthUser, setsuggestUser, setUserProfile, setselectedUser } = authSlice.actions;
export default authSlice.reducer;
