/** @format */

import useGetAllMessages from "@/hooks/useGetAllMessages";
import useGetRealTimeMessages from "@/hooks/useGetRealTimeMessages";
import { User2 } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const Messages = ({ selectedUser }) => {
    useGetAllMessages();

    // ye function real time messages ko fetch karne ke liye hai hamare redux store main
    useGetRealTimeMessages();
    const { message } = useSelector((store) => store.chat);
    const { user } = useSelector((store) => store.auth);
    return (
        <div className=" overflow-y-auto scroll-smooth flex-1 p-4 ">
            <div className=" flex justify-center">
                <div className=" flex flex-col items-center my-5 justify-center">
                    <Avatar className=" w-20 h-20">
                        <AvatarImage src={selectedUser?.profileImg} alt="user Profile" />
                        <AvatarFallback>
                            <User2 size={28} className=" mt-2" />
                        </AvatarFallback>
                    </Avatar>
                    <span className=" my-1">{selectedUser?.username}</span>
                    <Link to={`/profile/${selectedUser?._id}`}>
                        <Button className=" h-8 my-2 " variant="secondary">
                            View Profile
                        </Button>
                    </Link>
                </div>
            </div>
            <div className=" flex flex-col gap-4">
                {message &&
                    message.map((msg) => (
                        <div
                            key={msg?._id}
                            className={`flex ${msg?.senderId === user?._id ? "justify-end" : "justify-start"} `}
                        >
                            <div
                                className={` p-3 rounded-lg max-w-xs break-words  ${
                                    msg?.senderId === user?._id ? " bg-blue-500 text-white" : "bg-gray-200 text-black"
                                }`}
                            >
                                {msg.message}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Messages;
