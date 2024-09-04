/** @format */

import { User2 } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const SuggestUsers = () => {
    const { suggestUser, userProfile, user } = useSelector((store) => store.auth);

    // const isFollowing = user?.following.includes(user?._id);

    return (
        <div className=" my-10">
            <div className=" flex items-center justify-between text-sm gap-12 my-4">
                <h1 className=" font-semibold text-gray-600">Suggest for you...</h1>
                {/* <span className=" font-medium cursor-pointer"> See All</span> */}
            </div>
            {suggestUser &&
                suggestUser.map((user) => (
                    <div key={user?._id} className=" flex items-center w-full justify-between my-3">
                        <div className=" flex items-center gap-2">
                            <Link to={`/profile/${user?._id}`}>
                                <Avatar>
                                    <AvatarImage src={user?.profileImg} alt="User_img" />
                                    <AvatarFallback>
                                        <User2 size={28} className=" mt-2" />
                                    </AvatarFallback>
                                </Avatar>
                            </Link>
                            <div>
                                <h1 className=" font-semibold text-sm">
                                    <Link to={`/profile/${user?._id}`}>{user?.username}</Link>{" "}
                                </h1>
                                <span className=" text-gray-600 text-sm">{user?.bio || "Bio Here..."}</span>
                            </div>
                        </div>
                        <span className=" text-[#48b6ff] text-sm px-4 font-bold cursor-pointer hover:text-[#3097dc]">
                            <Link to={`/profile/${user?._id}`}> Follow</Link>
                        </span>
                    </div>
                ))}
        </div>
    );
};

export default SuggestUsers;
