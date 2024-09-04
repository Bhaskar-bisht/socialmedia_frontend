/** @format */

import useGetPosts from "@/hooks/useGetPosts";
import useGetSuggestUser from "@/hooks/useGetSuggestUser";
import { Outlet } from "react-router-dom";
import RightSideBar from "../Layout/RightSideBar";
import Feed from "./Feed";

const Home = () => {
    useGetPosts();
    useGetSuggestUser();
    return (
        <div className=" flex justify-between">
            <div className=" flex-grow">
                <Feed />
                <Outlet />
            </div>
            <RightSideBar />
        </div>
    );
};

export default Home;
