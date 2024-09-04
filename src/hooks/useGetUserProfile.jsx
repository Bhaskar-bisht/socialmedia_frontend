/** @format */

import serverURL from "@/conf/conf";
import { setUserProfile } from "@/redux/slice/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`${serverURL}/user/${userId}/profile`, {
                    withCredentials: true,
                });

                if (res.data.success) {
                    dispatch(setUserProfile(res.data.user));
                }
            } catch (error) {
                toast.error(error?.response?.data?.message);
            }
        };
        fetchUserProfile();
    }, [userId]);
};

export default useGetUserProfile;
