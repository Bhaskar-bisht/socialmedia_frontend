/** @format */

import serverURL from "@/conf/conf";
import { setsuggestUser } from "@/redux/slice/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const useGetSuggestUser = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchSuggestUser = async () => {
            try {
                const res = await axios.get(`${serverURL}/user/suggested`, {
                    withCredentials: true,
                });

                if (res.data.success) {
                    dispatch(setsuggestUser(res.data.users));
                }
            } catch (error) {
                toast.error(error?.response?.data?.message);
            }
        };
        fetchSuggestUser();
    }, []);
};

export default useGetSuggestUser;
