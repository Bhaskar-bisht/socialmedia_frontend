/** @format */

/** @format */

import serverURL from "@/conf/conf";
import { setMessage } from "@/redux/slice/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const useGetAllMessages = () => {
    const dispatch = useDispatch();
    const { selectedUser } = useSelector((store) => store.auth);
    useEffect(() => {
        const fetchAllMessage = async () => {
            try {
                const res = await axios.get(`${serverURL}/message/all/${selectedUser?._id}`, {
                    withCredentials: true,
                });

                if (res.data.success) {
                    dispatch(setMessage(res.data.message));
                }
            } catch (error) {
                toast.error(error?.response?.data?.message);
            }
        };
        fetchAllMessage();
    }, [selectedUser]);
};

export default useGetAllMessages;
