/** @format */

import { useSelector } from "react-redux";
import SinglePost from "./SinglePost";

const Post = () => {
    const { posts } = useSelector((store) => store.post);
    return (
        <div>
            {posts.map((post) => (
                <SinglePost key={post._id} post={post} />
            ))}
        </div>
    );
};

export default Post;
