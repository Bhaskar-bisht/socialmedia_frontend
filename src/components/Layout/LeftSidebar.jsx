/** @format */

import serverURL from "@/conf/conf";
import { setAuthUser, setsuggestUser, setUserProfile } from "@/redux/slice/authSlice";
import { setMessage, setOnlineUser } from "@/redux/slice/chatSlice";
import { setPosts } from "@/redux/slice/postSlice";
import { clearLikeNotifications } from "@/redux/slice/realTimeNoficationSlice";
import axios from "axios";
import {
    Heart,
    Home,
    LogOut,
    MessageCircle,
    MessageCircleOff,
    PlusSquare,
    Search,
    TrendingUp,
    User2,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CreatePost from "../Home/CreatePost";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const LeftSidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    // get the user from auth state using useSelector()
    const { user } = useSelector((store) => store.auth);
    const { likeNotification } = useSelector((store) => store.realtimeNotification);

    const logOutHandler = async () => {
        try {
            const res = await axios.get(`${serverURL}/user/logout`, { withCredentials: true });
            if (res.data.message) {
                dispatch(setAuthUser(null));
                dispatch(setsuggestUser([]));
                dispatch(setUserProfile(null));
                dispatch(setPosts([]));
                dispatch(setMessage([]));
                dispatch(setOnlineUser([]));
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };

    // this function tell then which text is user clicked by the sidebar
    const sidebarHandler = (text) => {
        if (text === "Logout") {
            logOutHandler();
        } else if (text === "Create") {
            setOpen(true);
        } else if (text === user?.username) {
            navigate(`/profile/${user?._id}`);
        } else if (text === "Home") {
            navigate("/");
        } else if (text === "Messages") {
            navigate("/chat");
        }
    };

    // sidebar Items
    const sidebarItems = [
        {
            icon: (
                <Avatar>
                    <AvatarImage src={user?.profileImg} />
                    <AvatarFallback>
                        <User2 size={28} className=" mt-2" />
                    </AvatarFallback>
                </Avatar>
            ),
            text: user?.username || "Profile",
        },
        {
            icon: <Home />,
            text: "Home",
        },
        {
            icon: <Search />,
            text: "Search",
        },
        {
            icon: <TrendingUp />,
            text: "Explore",
        },
        {
            icon: <MessageCircle />,
            text: "Messages",
        },
        {
            icon: <Heart />,
            text: "Notification",
        },
        {
            icon: <PlusSquare />,
            text: "Create",
        },
        {
            icon: <LogOut />,
            text: "Logout",
        },
    ];

    // *****************************************************************

    return (
        <div className="fixed top-0 z-10 left-0 border-r  px-4 border-gray-300 h-screen">
            <div className="flex flex-col h-full">
                <h1 className="my-6 pl-3 font-bold text-xl hidden md:block ">EchoNest</h1>
                <div className="flex flex-col flex-grow">
                    {sidebarItems.map((items, index) => {
                        return (
                            <div
                                key={index}
                                className="flex items-center justify-center md:justify-normal gap-3 relative hover:bg-gray-300 cursor-pointer rounded-lg p-3 my-3"
                                onClick={() => sidebarHandler(items.text)}
                            >
                                <div className="flex-shrink-0">{items.icon}</div>
                                {/* Show text only on medium screens and up */}
                                <span className="hidden md:inline">{items.text}</span>
                                {items.text === "Notification" && likeNotification.length > 0 && (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                className="rounded-full bg-red-600 hover:bg-red-700 h-5 w-5 absolute bottom-6 left-8 md:left-6"
                                                size="icon"
                                            >
                                                {likeNotification.length}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className=" relative overflow-y-auto max-h-[200px]">
                                            <span
                                                onClick={(isOpen) => isOpen && dispatch(clearLikeNotifications())}
                                                className=" flex absolute rounded bg-gray-200 p-1 flex-col text-xs items-center cursor-pointer z-50 top-1 right-1"
                                            >
                                                <MessageCircleOff size={15} />
                                            </span>
                                            <div>
                                                {likeNotification.length === 0 ? (
                                                    <p>No New Notification</p>
                                                ) : (
                                                    likeNotification.map((notification) => (
                                                        <div
                                                            key={notification?.userId}
                                                            className="flex items-center my-2 gap-3"
                                                        >
                                                            <Avatar>
                                                                <AvatarImage
                                                                    src={notification?.userDetails?.profileImg}
                                                                />

                                                                <AvatarFallback>
                                                                    <User2 size={28} className=" mt-2" />
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <p className="text-sm">
                                                                <span className="font-bold">
                                                                    {notification?.userDetails?.username}
                                                                </span>{" "}
                                                                Liked your Post
                                                            </p>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            <CreatePost open={open} setOpen={setOpen} />
        </div>
    );
};

export default LeftSidebar;
