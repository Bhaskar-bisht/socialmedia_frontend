/** @format */

import serverURL from "@/conf/conf";
import { setAuthUser } from "@/redux/slice/authSlice";
import axios from "axios";
import { Loader2, User2 } from "lucide-react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

const EditUserProfile = () => {
    const { user } = useSelector((store) => store.auth);

    const imageRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [input, setInput] = useState({
        profileImg: user?.profileImg,
        bio: user?.bio,
        gender: user?.gender,
        username: user?.username,
    });

    //     get the profile image file

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // iska matlab ki state main jo dusre variable hai ounko change nahi krke sirf profileImage main changes karne hai
            setInput({ ...input, profileImg: file });
        } else {
            toast.error("Your profile image is not uploaded..!");
        }
    };

    const genderChangeHandler = (value) => {
        // get the value of gender male or female
        setInput({ ...input, gender: value });
    };

    const bioChangeHandler = (e) => {
        setInput({ ...input, bio: e.target?.value });
    };

    const usernameChangeHandler = (e) => {
        setInput({ ...input, username: e.target?.value });
    };

    const [loading, setLoading] = useState(false);

    const editProfileHandler = async () => {
        const formData = new FormData();

        formData.append("bio", input.bio);
        formData.append("gender", input.gender);
        formData.append("username", input.username);
        if (input.profileImg) {
            formData.append("profileImg", input.profileImg);
        }

        try {
            setLoading(true);
            const res = await axios.post(`${serverURL}/user/profile/edit`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });

            if (res.data.success) {
                // user main jo jo feild change hue hai ounhe redux store main bhe change karna hota hai
                const updateUserData = {
                    ...user,
                    bio: res.data.user?.bio,
                    profileImg: res.data.user?.profileImg,
                    username: res.data.user?.username,
                    gender: res.data.user?.gender,
                };
                // and send the object to redux store and update the user data

                dispatch(setAuthUser(updateUserData));
                // rediract the user on profile page
                navigate(`/profile/${user?._id}`);

                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        // <div className=" flex max-w-2xl mx-auto p-10 bg-red-300">
        //     <section className=" flex flex-col gap-6 w-full my-8">
        //         <h1 className=" font-bold text-xl">Edit Profile</h1>
        //         <div className=" flex items-center justify-between bg-gray-100 rounded-xl p-4">
        //             <div className=" flex items-center gap-4">
        //                 <Avatar className=" border">
        //                     <AvatarImage src={user?.profileImg} alt="User_img" />
        //                     <AvatarFallback>CN</AvatarFallback>
        //                 </Avatar>
        //                 {/* </Link> */}
        //                 <div>
        //                     <h1 className=" font-bold text-sm">
        //                         {user?.username}
        //                         {/* <Link to={`/profile/${user?._id}`}>{user?.username}</Link>{" "} */}
        //                     </h1>
        //                     <span className=" text-gray-600">{user?.bio || "Bio Here..."}</span>
        //                 </div>
        //             </div>

        //             <input ref={imageRef} onChange={fileChangeHandler} type="file" className=" hidden" />
        //             <Button
        //                 // onChange={fileChangeHandler}
        //                 className=" bg-[#0095F6] h-8 hover:bg-[#027bcc]"
        //                 onClick={() => imageRef?.current.click()}
        //             >
        //                 Change Photo
        //             </Button>

        //             {/* <Link to={`/profile/${user?._id}`}> */}
        //         </div>
        //         <div className=" flex flex-col gap-2">
        //             <h1 className=" font-bold">Username</h1>
        //             <Input
        //                 value={input.username}
        //                 onChange={usernameChangeHandler}
        //                 type="text"
        //                 placeholder="username"
        //                 className=" focus-visible:ring-transparent"
        //             />
        //             <h1 className=" font-bold">Bio</h1>
        //             <Textarea
        //                 value={input.bio}
        //                 onChange={bioChangeHandler}
        //                 name="bio"
        //                 className="focus-visible:ring-transparent"
        //             />
        //         </div>
        //         <div>
        //             <h1 className=" font-bold mb-2"> Gender </h1>
        //             <Select defaultValue={input.gender} onValueChange={genderChangeHandler}>
        //                 <SelectTrigger className="w-[180px] focus-visible:ring-transparent">
        //                     <SelectValue placeholder="Gender" />
        //                 </SelectTrigger>
        //                 <SelectContent>
        //                     <SelectItem value="male">Male</SelectItem>
        //                     <SelectItem value="female">Female</SelectItem>
        //                     <SelectItem value="other">Other</SelectItem>
        //                 </SelectContent>
        //             </Select>
        //         </div>
        //         <div className=" flex justify-end">
        //             {loading ? (
        //                 // disabled="true"
        //                 <Button className="w-fit bg-[#0095F6] hover:bg-[#027bcc]">
        //                     <Loader2 className=" mr-2 h-4 w-4 animate-spin" />
        //                     Please Wait...
        //                 </Button>
        //             ) : (
        //                 <Button onClick={editProfileHandler} className="w-fit bg-[#0095F6] hover:bg-[#027bcc]">
        //                     Submit
        //                 </Button>
        //             )}
        //         </div>
        //     </section>
        // </div>

        <div className="flex max-w-2xl mx-auto p-4 md:p-10">
            <section className="flex flex-col gap-6 w-full my-4 ml-[90px] md:ml-0 md:my-8">
                <h1 className="font-bold text-lg md:text-xl">Edit Profile</h1>

                {/* Profile Image and Change Photo Button */}
                <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-100 rounded-xl p-4 gap-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="border w-16 h-16 sm:w-20 sm:h-20">
                            <AvatarImage src={user?.profileImg} alt="User_img" />
                            <AvatarFallback>
                                <User2 size={28} className=" mt-2" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-center sm:text-left">
                            <h1 className="font-bold text-sm md:text-base">{user?.username}</h1>
                            <span className="text-gray-600 block text-xs md:text-sm">{user?.bio || "Bio Here..."}</span>
                        </div>
                    </div>
                    <input ref={imageRef} onChange={fileChangeHandler} type="file" className="hidden" />
                    <Button
                        className="bg-[#0095F6] h-8 hover:bg-[#027bcc] mt-2 sm:mt-0"
                        onClick={() => imageRef?.current.click()}
                    >
                        Change Photo
                    </Button>
                </div>

                {/* Username and Bio Input */}
                <div className="flex flex-col gap-2">
                    <h1 className="font-bold text-sm md:text-base">Username</h1>
                    <Input
                        value={input.username}
                        onChange={usernameChangeHandler}
                        type="text"
                        placeholder="username"
                        className="focus-visible:ring-transparent"
                    />
                    <h1 className="font-bold text-sm md:text-base mt-4">Bio</h1>
                    <Textarea
                        value={input.bio}
                        onChange={bioChangeHandler}
                        name="bio"
                        className="focus-visible:ring-transparent"
                    />
                </div>

                {/* Gender Selection */}
                <div className="mt-4">
                    <h1 className="font-bold mb-2 text-sm md:text-base">Gender</h1>
                    <Select defaultValue={input.gender} onValueChange={genderChangeHandler}>
                        <SelectTrigger className="w-full sm:w-[180px] focus-visible:ring-transparent">
                            <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end mt-4">
                    {loading ? (
                        <Button className="w-full sm:w-fit bg-[#0095F6] hover:bg-[#027bcc]">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please Wait...
                        </Button>
                    ) : (
                        <Button
                            onClick={editProfileHandler}
                            className="w-full sm:w-fit bg-[#0095F6] hover:bg-[#027bcc]"
                        >
                            Submit
                        </Button>
                    )}
                </div>
            </section>
        </div>
    );
};

export default EditUserProfile;
