/** @format */

import serverURL from "@/conf/conf";
import { setPosts } from "@/redux/slice/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const useGetPosts = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllPost = async () => {
            try {
                const res = await axios.get(`${serverURL}/post/allpost`, {
                    withCredentials: true,
                });

                if (res.data.success) {
                    dispatch(setPosts(res.data.posts));
                }
            } catch (error) {
                toast.error(error?.response?.data?.message);
            }
        };
        fetchAllPost();
    }, []);
};

export default useGetPosts;
