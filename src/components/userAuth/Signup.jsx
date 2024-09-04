/** @format */

import serverURL from "@/conf/conf";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
// import { server } from "@/viteServer";

const Signup = () => {
    const appTitle = `<> Sign Up To App </>`;
    const navigate = useNavigate();
    const { user } = useSelector((store) => store.auth);

    const [input, setInput] = useState({
        username: "",
        email: "",
        password: "",
        bio: "",
        gender: "",
    });

    // if user click the sign Up Button then show the loader

    const [loader, setLoader] = useState();

    const ChangeHandler = (e) => {
        try {
            setInput({ ...input, [e.target.name]: e.target.value });
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };

    const signupHandler = async (e) => {
        e.preventDefault();
        try {
            setLoader(true);

            // call api
            const res = await axios.post(`${serverURL}/user/register`, input, {
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
                withCredentials: true,
            });

            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
                setInput({
                    username: "",
                    email: "",
                    password: "",
                    bio: "",
                    gender: "",
                });
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoader(false);
        }
    };

    // if user loggedIn Then dont access the signup page
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    });

    return (
        <div className=" flex justify-center w-full h-screen items-center">
            <form onSubmit={signupHandler} className="shadow-lg flex flex-col gap-5 p-8 rounded-xl">
                <div className="flex flex-col justify-center items-start w-full">
                    <h1 className=" text-center font-bold text-xl w-full">EchoNest</h1>
                    <p className=" text-center text-sm w-full mt-1">
                        Signup to see <span className=" text-pink-500 font-bold">Photo's</span> &{" "}
                        <span className=" text-pink-500 font-bold">Video's</span> from your Friends
                    </p>
                </div>
                <div>
                    <Label>
                        Username<span className=" text-red-700">*</span>
                    </Label>
                    <Input
                        type="text"
                        className=" focus-visible:ring-transparent"
                        name="username"
                        value={input.username}
                        onChange={ChangeHandler}
                        required
                    />
                </div>
                <div>
                    <Label>
                        Email<span className=" text-red-700">*</span>
                    </Label>
                    <Input
                        type="email"
                        className=" focus-visible:ring-transparent"
                        name="email"
                        value={input.email}
                        onChange={ChangeHandler}
                        required
                    />
                </div>
                <div>
                    <Label>
                        Password<span className=" text-red-700">*</span>
                    </Label>
                    <Input
                        type="password"
                        className=" focus-visible:ring-transparent"
                        name="password"
                        value={input.password}
                        onChange={ChangeHandler}
                        required
                    />
                </div>
                <div>
                    <Label>Bio</Label>
                    <Input
                        type="text"
                        className=" focus-visible:ring-transparent"
                        name="bio"
                        value={input.bio}
                        onChange={ChangeHandler}
                    />
                </div>
                <div>
                    <Label>Gender</Label>
                    <Input
                        type="text"
                        className=" focus-visible:ring-transparent"
                        name="gender"
                        value={input.gender}
                        onChange={ChangeHandler}
                    />
                </div>
                {loader ? (
                    <Button disabled={true}>
                        <Loader2 className=" animate-spin mr-2 h-4 w-4" />
                        Please Wait...
                    </Button>
                ) : (
                    <Button type="submit">Sign Up</Button>
                )}

                <span className=" text-center">
                    Already have an account Please{" "}
                    <Link to="/login" className=" text-blue-800">
                        Login
                    </Link>{" "}
                </span>
            </form>
        </div>
    );
};

export default Signup;
