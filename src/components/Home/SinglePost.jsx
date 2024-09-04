/** @format */

import { AvatarImage } from "@radix-ui/react-avatar";
import { MessageCircle, MoreHorizontal, Send, User2 } from "lucide-react";
import { FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";

import serverURL from "@/conf/conf";
import { setPosts, setSelectPost } from "@/redux/slice/postSlice";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import CommentDialog from "./CommentDialog";

const SinglePost = ({ post }) => {
    const [commentText, setcommentText] = useState("");

    const [open, setOpen] = useState(false);

    const { user } = useSelector((state) => state.auth);

    const { posts } = useSelector((state) => state.post);

    // this state check the user is alardy like the post or not
    const [liked, setLiked] = useState(post?.likes.includes(user?._id) || false);

    // this state is basicaly use for count the total like in a post
    const [totalLike, setTotalLike] = useState(post?.likes.length);

    const [comment, setComment] = useState(post?.comments);

    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        const inputText = e.target.value;

        if (inputText.trim()) {
            setcommentText(inputText);
        } else {
            setcommentText("");
        }
    };

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`${serverURL}/post/delete/${post?._id}`, {
                withCredentials: true, // it's mean jo user login hai vo he is post ko delete kr sakta hai
            });

            if (res.data.success) {
                // update the post on state
                const updatedPost = posts.filter((postItem) => postItem?._id !== post?._id);
                dispatch(setPosts(updatedPost));

                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const likePostHandler = async () => {
        // receive the postId for which post is like user
        const action = liked ? "dislike" : "like";

        try {
            // call the like and dislike api is dynamicaly
            const res = await axios.get(`${serverURL}/post/${post?._id}/${action}`, {
                withCredentials: true,
            });

            if (res.data.success) {
                const updateLike = liked ? totalLike - 1 : totalLike + 1;
                // yaha pr hum likes ko bada or kam kr rahe hai
                setTotalLike(updateLike);
                setLiked(!liked); // agar api like ke liye hit hui hai to api call hone ke baad to like hogi use
                //  ki value true ho jayegi tak dusri bar jo user like wali api call kare to dislike wali api call ho

                // updaate the likes array on redux store

                const updatePost = posts.map((p) =>
                    p._id === post?._id
                        ? {
                              ...p,
                              // [ liked ? p.likes.filter((id) => id !== user?._id) ] jb user dislike karega to state update ho jayege or likes array main jo user ki id hoge vo remocve ho jayege
                              likes: liked ? p.likes.filter((id) => id !== user?._id) : [...p.likes, user?._id],
                          }
                        : p
                );

                // jab user post ko like karega to vo store main save ho jayega or jb hum page refresh kaange to vo remove nahi hoga
                dispatch(setPosts(updatePost));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const commentHandler = async () => {
        try {
            const res = await axios.post(
                `${serverURL}/post/${post?._id}/comment`,
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

                const newPostData = posts.map((p) => (p._id === post?._id ? { ...p, comments: updatedComment } : p));
                dispatch(setPosts(newPostData));
                toast.success(res?.data?.message);
                setcommentText("");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };

    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(`${serverURL}/post/${post?._id}/saved`, {
                withCredentials: true,
            });

            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    return (
        <div className=" my-8 w-full max-w-sm mx-auto p-2">
            <div className=" flex items-center justify-between">
                <div className=" flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src={post.author?.profileImg} className=" w-full" alt="post_img" />
                        <AvatarFallback>
                            <User2 size={28} className=" mt-2" />
                        </AvatarFallback>
                    </Avatar>
                    <div className=" flex items-center gap-2">
                        <h1>{post.author?.username}</h1>
                        {/* if the user is post author then show the Author badge in user */}
                        {user?._id === post?.author?._id && <Badge variant="secondary">Author</Badge>}
                    </div>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className=" cursor-pointer" />
                    </DialogTrigger>
                    <DialogContent className=" flex flex-col items-center text-sm text-center">
                        {post?.author?._id !== user?._id && (
                            <Button variant="ghost" className="cursor-pointer font-bold w-fit text-[#E04956]">
                                Unfollow
                            </Button>
                        )}

                        <Button variant="ghost" className="cursor-pointer w-fit ">
                            Saved
                        </Button>
                        {user && user?._id == post?.author._id && (
                            <Button onClick={deletePostHandler} variant="ghost" className="cursor-pointer w-fit">
                                Delete
                            </Button>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
            <img className=" rounded-md my-2 w-full aspect-square object-cover" src={post?.postImage} alt="post_img" />
            <div className=" flex items-center justify-between px-1">
                <div className=" flex items-center justify-center gap-4">
                    {liked && liked ? (
                        <FaHeart
                            size={"22px"}
                            className=" cursor-pointer text-red-600 hover:text-red-500"
                            onClick={likePostHandler}
                        />
                    ) : (
                        <FaRegHeart
                            size={"22px"}
                            className=" cursor-pointer hover:text-gray-700"
                            onClick={likePostHandler}
                        />
                    )}
                    <MessageCircle
                        onClick={() => {
                            // {dispatch(setSelectPost(post))} iska matlab ki user jis post pr click karaga wahi post open hogi
                            dispatch(setSelectPost(post)), setOpen(true);
                        }}
                        className=" cursor-pointer hover:text-gray-700"
                    />
                    <Send className=" cursor-pointer hover:text-gray-700" />
                </div>
                <FaRegBookmark
                    onClick={bookmarkHandler}
                    size={"18px"}
                    className=" cursor-pointer hover:text-gray-700"
                />
            </div>

            <span className=" font-medium block mb-3 px-2">{totalLike} likes</span>
            <p className=" px-1">
                <span className=" font-medium mr-3">{post.author?.username}</span>
                {post?.postCaption}
            </p>
            {comment.length > 0 && (
                <span
                    onClick={() => {
                        dispatch(setSelectPost(post)), setOpen(true);
                    }}
                    className="cursor-pointer "
                >
                    View all {post.comments?.length} comments
                </span>
            )}
            <CommentDialog open={open} setOpen={setOpen} />
            <div className=" flex items-center justify-between">
                <input
                    type="text"
                    placeholder=" Add a Comment"
                    value={commentText}
                    onChange={changeEventHandler}
                    className=" outline-none text-sm w-full"
                />
                {commentText && (
                    <span className=" text-[#3BADF8] cursor-pointer" onClick={commentHandler}>
                        Post
                    </span>
                )}
            </div>
        </div>
    );
};

export default SinglePost;
