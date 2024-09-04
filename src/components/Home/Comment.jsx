/** @format */

import { User2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Comment = ({ comment }) => {
    return (
        <div className="my-2">
            <div className=" flex  items-center gap-2">
                <Avatar>
                    <AvatarImage src={comment?.author?.profileImg} />
                    <AvatarFallback>
                        <User2 size={28} className=" mt-2" />
                    </AvatarFallback>
                </Avatar>
                <h1 className=" font-bold text-sm">
                    {comment?.author?.username} <span className=" font-normal pl-1">{comment?.text}</span>
                </h1>
            </div>
        </div>
    );
};

export default Comment;
