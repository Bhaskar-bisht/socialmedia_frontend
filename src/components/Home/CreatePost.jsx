/** @format */

import serverURL from "@/conf/conf";
import { readFileAsDataURL } from "@/lib/utils";
import { setPosts } from "@/redux/slice/postSlice";
import axios from "axios";
import { Loader2, User2 } from "lucide-react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { Textarea } from "../ui/textarea";

const CreatePost = ({ open, setOpen }) => {
    const imgRef = useRef();
    const [file, setFile] = useState("");
    const [caption, setCaption] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const { posts } = useSelector((state) => state.post);

    const dispatch = useDispatch();

    const fileChangeHandler = async (e) => {
        const file = e.target.files?.[0];

        if (file) {
            setFile(file);
            const dataUrl = await readFileAsDataURL(file);

            setImagePreview(dataUrl);
        }
    };

    const createPostHandler = async (e) => {
        const formData = new FormData();
        formData.append("caption", caption);
        if (imagePreview) formData.append("postImage", file);

        try {
            setLoading(true);
            const response = await axios.post(`${serverURL}/post/addpost`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });

            if (response.data.success) {
                // if a new post is created the post is automatic display is home page without refresh
                dispatch(setPosts([response.data.post, ...posts]));
                toast.success(response.data.message);
                setOpen(false);
                setCaption("");
                setImagePreview("");
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)}>
                <DialogHeader className=" text-center font-semibold">Create a New Post..</DialogHeader>
                <div className=" flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={user?.image} alt="user_img" />
                        <AvatarFallback>
                            <User2 size={28} className=" mt-2" />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className=" font-semibold text-xs">{user?.username}</h2>
                        <span className=" text-gray-400 text-xs"> {user?.bio}</span>
                    </div>
                </div>
                <Textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className=" focus-visible:ring-transparent border-none "
                    placeholder="Write a Captionn...."
                />

                {imagePreview && (
                    <div className=" w-full h-full border-2 max-h-96  rounded-md flex justify-center items-center">
                        <img src={imagePreview} alt="post_img" className=" object-cove w-full h-full rounded-md" />
                    </div>
                )}
                <input ref={imgRef} type="file" onChange={fileChangeHandler} className=" hidden" />
                <Button
                    onClick={() => imgRef.current.click()}
                    className=" w-fit mx-auto bg-[#0095F6] hover:bg-[#0676c0]"
                >
                    Select Image to Post.
                </Button>
                {imagePreview &&
                    (loading ? (
                        <Button disabled={true}>
                            <Loader2 className=" mr-2 h-4 w-4 animate-spin" />
                            please wait...
                        </Button>
                    ) : (
                        <Button type="submit" className=" w-full" onClick={createPostHandler}>
                            {" "}
                            Post
                        </Button>
                    ))}
            </DialogContent>
        </Dialog>
    );
};

export default CreatePost;
