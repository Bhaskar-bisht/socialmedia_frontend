/** @format */

import { User2 } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestUsers from "../Home/SuggestUsers";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const RightSideBar = () => {
    const { user } = useSelector((store) => store.auth);
    return (
        <div className="w-fit my-10  mr-[5%] p-8 hidden md:block">
            <div className="flex items-center gap-2">
                <Link to={`/profile/${user?._id}`}>
                    <Avatar>
                        <AvatarImage src={user?.profileImg} alt="User_img" />
                        <AvatarFallback>
                            <User2 size={28} className=" mt-2" />
                        </AvatarFallback>
                    </Avatar>
                </Link>
                <div>
                    <h1 className="font-semibold text-sm">
                        <Link to={`/profile/${user?._id}`}>{user?.username}</Link>{" "}
                    </h1>
                    <span className="text-gray-600 text-sm">{user?.bio || "Bio Here..."}</span>
                </div>
            </div>
            <SuggestUsers />
        </div>
    );
};

export default RightSideBar;
