/** @format */

import serverURL from "@/conf/conf";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import axios from "axios";
import { AtSign, Heart, MessageCircle, User2 } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const Profile = () => {
    const params = useParams();

    const userId = params?.id;

    const [activeTab, setActiveTab] = useState("posts");

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    useGetUserProfile(userId);

    const { userProfile, user } = useSelector((store) => store.auth);

    const displayPost = activeTab === "posts" ? userProfile?.totalPost : userProfile?.savedPost;

    const isLoggedInUserProfile = user?._id === userProfile?._id;

    const isFollowing = userProfile?.follower.includes(user?._id);

    const handleFollowOrUnfollow = async () => {
        try {
            const res = await axios.post(
                `${serverURL}/user/followorunfollow/${userProfile?._id}`,
                {},
                // NOTE => if the data is not send the provide empty object Other Wise show error
                // because the axios methods accept 3 argument 1st is URL, 2nd is Data, and 3rd is Token/header/cookies if need
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,

                    // Implement FOllow or unfollow feature and responsive the User profile section for tommorow
                }
            );
            console.log("the follow unfollow user res is : ", res);
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            console.log("Follow unfollow user Error :", error);
        }
    };

    return (
        <div className="flex flex-col ml-[24%]  lg:flex-row max-w-4xl justify-center mx-auto px-4 lg:px-10">
            <div className="flex flex-col gap-8 lg:gap-20 p-4 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-0">
                    <section className="flex items-center justify-center">
                        <Avatar className="h-24 w-24 lg:h-36 lg:w-36">
                            <AvatarImage src={userProfile?.profileImg} alt="profile Img" />
                            <AvatarFallback>
                                <User2 size={28} className=" mt-2" />
                            </AvatarFallback>
                        </Avatar>
                    </section>
                    <section className=" flex justify-center">
                        <div className="flex  flex-col gap-4 lg:gap-5">
                            <div className="flex items-center justify-center md:justify-normal gap-2 lg:gap-3">
                                <span>{userProfile?.username}</span>

                                {isLoggedInUserProfile ? (
                                    <Link to={"/account/edit"}>
                                        <Button variant="secondary" className="hover:bg-gray-200 h-8">
                                            Edit Profile
                                        </Button>
                                    </Link>
                                ) : isFollowing ? (
                                    <>
                                        <Button onClick={handleFollowOrUnfollow} variant="secondary" className="h-8">
                                            Unfollow
                                        </Button>
                                        <Button className="bg-[#0095F6] hover:bg-[#0278c7] h-8">
                                            {" "}
                                            <Link to={"/chat"}>Message</Link>{" "}
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        className="bg-[#0095F6] hover:bg-[#0278c7] ml-2 lg:ml-5 h-8"
                                        onClick={handleFollowOrUnfollow}
                                    >
                                        Follow
                                    </Button>
                                )}
                            </div>
                            <div className="flex items-center gap-4 lg:gap-6">
                                <p className="font-semibold">
                                    <span className="mx-1">{userProfile?.totalPost.length}</span>Posts
                                </p>
                                <p className="font-semibold">
                                    <span className="mx-1">{userProfile?.follower.length}</span>Follower
                                </p>
                                <p className="font-semibold">
                                    <span className="mx-1">{userProfile?.following.length}</span>Following
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 lg:gap-2">
                                <span className="font-semibold">{userProfile?.bio || "Bio here..."}</span>
                                <Badge className="w-fit" variant="secondary">
                                    <span className="mr-1">
                                        <AtSign className="w-5 h-5" />
                                    </span>
                                    {userProfile?.username}
                                </Badge>
                            </div>
                        </div>
                    </section>
                </div>
                <div className="border-t border-t-gray-200 mt-4">
                    <div className="flex items-center justify-center gap-5 lg:gap-10 text-xs lg:text-sm">
                        <span
                            className={`py-2 lg:py-3 cursor-pointer ${activeTab === "posts" ? "font-bold" : ""}`}
                            onClick={() => handleTabChange("posts")}
                        >
                            POST
                        </span>
                        <span
                            className={`py-2 lg:py-3 cursor-pointer ${activeTab === "saved" ? "font-bold" : ""}`}
                            onClick={() => handleTabChange("saved")}
                        >
                            SAVED
                        </span>
                        {/* Additional Tabs */}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-2">
                        {displayPost &&
                            displayPost?.map((post) => (
                                <div key={post?._id} className="relative group cursor-pointer">
                                    <img
                                        src={post?.postImage}
                                        alt="Post Image"
                                        className="rounded-sm w-full aspect-square object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="flex items-center text-white space-x-2 lg:space-x-4">
                                            <button className="flex items-center gap-1 lg:gap-2 hover:text-gray-300">
                                                <Heart />
                                                <span>{post?.likes.length}</span>
                                            </button>
                                            <button className="flex items-center gap-1 lg:gap-2 hover:text-gray-300">
                                                <MessageCircle />
                                                <span>{post?.comments.length}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
