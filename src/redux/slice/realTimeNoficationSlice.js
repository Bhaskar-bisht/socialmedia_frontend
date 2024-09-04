/** @format */

import { createSlice } from "@reduxjs/toolkit";

const realtimeNotificationSlice = createSlice({
    name: "realtimeNotification",
    initialState: {
        likeNotification: [],
    },
    reducers: {
        setLikeNotification: (state, action) => {
            // humne backend se jo realtime Notification ke liye jo object event send kiya tha ouse check
            // karange ki vo user ki post ko like karaga ya dislike
            if (action.payload.type === "like") {
                // if user like the post then push() the object inside the likeNotification[] array
                state.likeNotification.push(action.payload);
            } else if (action.payload.type === "dislike") {
                // if user dislike the post simpaly remove the object in the array and filter out the array
                state.likeNotification = state.likeNotification.filter((item) => item.userId !== action.payload.userId);
            }
        },

        // clear the notification after there read
        clearLikeNotifications: (state, action) => {
            state.likeNotification = [];
        },
    },
});

export const { setLikeNotification, clearLikeNotifications } = realtimeNotificationSlice.actions;
export default realtimeNotificationSlice.reducer;
