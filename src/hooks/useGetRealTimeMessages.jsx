/** @format */

/** @format */

/** @format */

import { setMessage } from "@/redux/slice/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetRealTimeMessages = () => {
    const dispatch = useDispatch();
    const { socket } = useSelector((store) => store.socketio);
    const { message } = useSelector((store) => store.chat);
    useEffect(() => {
        // humne backend main jo event create kiya tha vo event listen karange
        socket?.on("newMessage", (newMessage) => {
            // humne redux store main jo messages store kare the ous main hum is new Messages ko
            // add kar dange taki jesi koi user hume message kare to vo message real time main haramre
            // redux store main save hoo jaye or hume show ho jayee
            dispatch(setMessage([...message, newMessage]));
        });

        return () => {
            // iska matlab agar user message page ko chod kar chala jata hai to ouse new message receive nahi hone chiye
            socket.off("newMessage");
        };

        // {message, setMessage} jb bhe redux store main is dono pr koi changes hoga to ye code fir se chalega or
        // or jitne bhe new message user ko send kiye gye ho vo user ko show ho jayege real time main
    }, [message, setMessage]);
};

export default useGetRealTimeMessages;
