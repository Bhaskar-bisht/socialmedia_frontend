/** @format */

import serverURL from "@/conf/conf";
import { setPosts } from "@/redux/slice/postSlice";
import axios from "axios";
import { MoreHorizontal, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import Comment from "./Comment";

const CommentDialog = ({ open, setOpen }) => {
    const { selectedPost, posts } = useSelector((state) => state.post);

    const [commentText, setcommentText] = useState("");

    const [comment, setComment] = useState([]);

    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedPost) {
            setComment(selectedPost.comments);
        }
    }, [selectedPost]);

    const changeCommentHandler = (e) => {
        const inputText = e.target.value;

        if (inputText.trim()) {
            setcommentText(inputText);
        } else {
            setcommentText("");
        }
    };

    const postCommentHandler = async () => {
        try {
            const res = await axios.post(
                `${serverURL}/post/${selectedPost?._id}/comment`,
                { commentText },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                const updatedComment = [...comment, res?.data?.comment];
                setComment(updatedComment);

                const newPostData = posts.map((p) =>
                    p._id === selectedPost?._id ? { ...p, comments: updatedComment } : p
                );
                dispatch(setPosts(newPostData));
                toast.success(res?.data?.message);
                setcommentText("");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };

    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-5xl p-0 flex flex-col">
                <div className=" flex flex-1">
                    <div className=" w-1/2">
                        <img
                            src={selectedPost?.postImage}
                            alt="user post"
                            className=" w-full h-full object-cover rounded-lg"
                        />
                    </div>

                    <div className=" w-1/2 flex flex-col justify-between">
                        <div className=" flex items-center justify-between p-4">
                            <div className=" flex gap-3 items-center">
                                <Link>
                                    <Avatar>
                                        <AvatarImage src={selectedPost?.author?.profileImg} />
                                        <AvatarFallback>
                                            <User2 size={28} className=" mt-2" />
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div className=" ">
                                    <Link className=" font-semibold text-sm">{selectedPost?.author?.username}</Link>
                                    {/* <span className=" text-gray-600 text-sm ">Bio...</span> */}
                                </div>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <MoreHorizontal className=" cursor-pointer" />
                                </DialogTrigger>
                                <DialogContent className=" flex flex-col items-center text-sm text-center">
                                    <div className=" cursor-pointer w-full text-[#E04956] font-bold">Unfollow</div>
                                    <div className=" cursor-pointer w-full">Add to Favorites</div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className=" flex-1 overflow-y-auto max-h-96 p-4">
                            {comment && comment.map((comment) => <Comment key={comment?._id} comment={comment} />)}
                        </div>
                        <div className=" p-4">
                            <div className=" flex items-center gap-1">
                                <input
                                    type="text"
                                    placeholder="Add Comment..."
                                    name="comment"
                                    value={commentText}
                                    onChange={changeCommentHandler}
                                    className=" w-full outline-none border text-sm border-gray-400 p-2 rounded"
                                />
                                <Button disabled={!commentText.trim()} onClick={postCommentHandler} variant="outline">
                                    Post
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CommentDialog;
