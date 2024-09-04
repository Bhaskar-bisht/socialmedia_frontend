/** @format */

import serverURL from "@/conf/conf";
import { setselectedUser } from "@/redux/slice/authSlice";
import { setMessage } from "@/redux/slice/chatSlice";
import axios from "axios";
import { ArrowLeft, DotIcon, MessageCircleCode, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Messages from "./Messages";

const ChatPage = () => {
    const { user, suggestUser, selectedUser } = useSelector((store) => store.auth);
    const { message } = useSelector((store) => store.chat);
    const { onlineUsers } = useSelector((store) => store.chat);
    const [textMessage, setTextMessage] = useState("");
    const [isChatVisible, setIsChatVisible] = useState(false);
    const [sendMsg, setSendMsg] = useState(true);
    const dispatch = useDispatch();

    const sendMessageHandler = async (reveiverId) => {
        try {
            // reveiverId ye id ous suggestUser user ki id hogi jise hum message bhaj rahe hai
            const res = await axios.post(
                `${serverURL}/message/send/${reveiverId}`,
                { textMessage },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                // messages ko hum redux store main save karange or jitne bhe phale se message honge ounge bhe save karange
                dispatch(setMessage([...message, res.data.newMessage]));
                setTextMessage("");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };

    // jis bhe user ko humne select kiya hoga baat karne ke liye agar fir hum chat page chod kar home pr chale jate hai to vo selected user remove ho jana chiye
    // ous ke liye hum useEfface hook ka use karange ous main hum unmounting ka use karange useEffact hook ke ander se return karke
    useEffect(() => {
        return () => {
            dispatch(setselectedUser(null));
        };
    }, []);

    return (
        // <div className=" flex ml-[25%] md:ml-[16%] w-auto h-screen">
        //     {selectedUser ? (
        //         ""
        //     ) : (
        //         <section className=" w-full md:w-1/4 my-9 sm:flex-row bg-orange-300">
        //             {/* <h1 className=" font-bold mb-4 px-3 text-xl hidden md:block">{user?.username}</h1> */}
        //             <hr className="  border-gray-300" />
        //             <div className=" overflow-y-auto p-5 overflow-x-hidden  h-[87vh]">
        //                 <div className=" border border-gray-300 h-full rounded-md">
        //                     {suggestUser.map((suggUser) => {
        //                         // {.includes} method ye check karta hai ki jo argument ouse pass kiye gye hai vo ous array main hai ya nahi ye method hume true or false return karta hai
        //                         const isOnline = onlineUsers.includes(suggUser?._id);
        //                         return (
        //                             <div
        //                                 // isme hum jis user ki id pr user click karega Ouske saat user chat kar sakega or vo
        //                                 // selected user ko hum redux store main save karange taki hum pta chal sake ki kis ke saat message karna hai
        //                                 onClick={() => dispatch(setselectedUser(suggUser))}
        //                                 className=" flex gap-4 border-b items-center p-3  hover:bg-gray-300 cursor-pointer rounded-md"
        //                             >
        //                                 <Avatar className=" w-12 h-12">
        //                                     <AvatarImage src={suggUser?.profileImg} />
        //                                     <AvatarFallback>CN</AvatarFallback>
        //                                 </Avatar>
        //                                 <div className=" flex relative">
        //                                     <span className=" font-medium">{suggUser?.username}</span>
        //                                     <span
        //                                         className={` absolute top-[-10px] right-[-24px] text-2xl font-bold ${
        //                                             isOnline ? "text-green-600" : "text-red-600"
        //                                         }`}
        //                                     >
        //                                         {isOnline ? <DotIcon size={35} /> : <DotIcon size={35} />}
        //                                     </span>
        //                                 </div>
        //                             </div>
        //                         );
        //                     })}
        //                 </div>
        //             </div>
        //         </section>
        //     )}
        //     {selectedUser ? (
        //         <section className=" flex flex-1 flex-col border-l border-l-gray-300 h-full">
        //             <div className=" flex gap-3  items-center justify-center px-5 py-5 border-b border-gray-300 sticky top-0  z-10">
        //                 <Link
        //                     className=" absolute left-2"
        //                     onClick={() => {
        //                         selectedUser = false;
        //                     }}
        //                 >
        //                     <ArrowLeft />
        //                 </Link>
        //                 <Avatar>
        //                     <AvatarImage src={selectedUser?.profileImg} alt="profile image" />
        //                     <AvatarFallback>CN</AvatarFallback>
        //                 </Avatar>
        //                 <div className=" flex flex-col border-b">
        //                     <span>{selectedUser?.username}</span>
        //                 </div>
        //             </div>
        //             <Messages selectedUser={selectedUser} />
        //             <div className=" flex items-center p-4 border-t border-t-gray-300">
        //                 <Input
        //                     value={textMessage}
        //                     onChange={(e) => setTextMessage(e.target.value)}
        //                     type="text"
        //                     className=" flex-1 mr-2 focus-visible:ring-transparent"
        //                     placeholder="Send Message..."
        //                 />
        //                 <Button onClick={() => sendMessageHandler(selectedUser?._id)}>Send</Button>
        //             </div>
        //         </section>
        //     ) : (
        //         <div className=" hidden md:block flex-col items-center justify-center m-auto">
        //             <MessageCircleCode className=" w-32 h-32 my-4" />
        //             <h1 className=" font-medium text-xl">Your Messages</h1>
        //             <span>Send a message to start a chat with Friend's</span>
        //         </div>
        //     )}
        // </div>

        <div className="flex ml-[25%] md:ml-[16%] w-auto h-screen">
            {/* Render Sidebar if no user is selected or on mobile when 'isChatVisible' is false */}
            {!isChatVisible && (
                <section className="w-full md:w-1/4 my-9 sm:flex-row">
                    {/* <h1 className="font-bold mb-4 px-3 text-xl hidden md:block">{user?.username}</h1> */}
                    <hr className="border-gray-300" />
                    <div className="overflow-y-auto p-5 overflow-x-hidden h-[87vh]">
                        <div className="border border-gray-300 h-full rounded-md">
                            {suggestUser.map((suggUser) => {
                                const isOnline = onlineUsers.includes(suggUser?._id);
                                return (
                                    <div
                                        onClick={() => {
                                            dispatch(setselectedUser(suggUser));
                                            setIsChatVisible(true);
                                        }}
                                        className="flex gap-4 border-b items-center p-3 hover:bg-gray-300 cursor-pointer rounded-md"
                                    >
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={suggUser?.profileImg} />
                                            <AvatarFallback>
                                                <User2 size={28} className=" mt-2" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex relative">
                                            <span className="font-medium">{suggUser?.username}</span>
                                            <span
                                                className={`absolute top-[-10px] right-[-24px] text-2xl font-bold ${
                                                    isOnline ? "text-green-600" : "text-red-600"
                                                }`}
                                            >
                                                {isOnline ? <DotIcon size={35} /> : <DotIcon size={35} />}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Render Chat if a user is selected or on mobile when 'isChatVisible' is true */}
            {isChatVisible && selectedUser && (
                <section className="flex flex-1 flex-col border-l border-l-gray-300 h-full">
                    <div className="flex gap-3 items-center justify-center px-5 py-5 border-b border-gray-300 sticky top-0 z-10">
                        {/* Back Button */}
                        <Link
                            className="absolute left-2"
                            onClick={() => {
                                setIsChatVisible(false), setSendMsg(true);
                            }} // Hide chat and show sidebar
                        >
                            <ArrowLeft />
                        </Link>
                        <Avatar>
                            <AvatarImage src={selectedUser?.profileImg} alt="profile image" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col border-b">
                            <span>{selectedUser?.username}</span>
                        </div>
                    </div>
                    <Messages selectedUser={selectedUser} />
                    <div className="flex items-center p-4 border-t border-t-gray-300">
                        <Input
                            value={textMessage}
                            onChange={(e) => setTextMessage(e.target.value)}
                            type="text"
                            className="flex-1 mr-2 focus-visible:ring-transparent"
                            placeholder="Send Message..."
                        />
                        <Button onClick={() => sendMessageHandler(selectedUser?._id)}>Send</Button>
                    </div>
                </section>
            )}

            {/* Display a placeholder when no user is selected */}
            {sendMsg && !isChatVisible && (
                <div className="hidden md:block  m-auto">
                    <div className=" flex justify-center items-center flex-col">
                        <MessageCircleCode className="w-32 h-32 my-4" />
                        <h1 className="font-medium text-xl">Your Messages</h1>
                        <span>Send a message to start a chat with Friends</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatPage;
