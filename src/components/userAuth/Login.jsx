/** @format */

import serverURL from "@/conf/conf";
import { setAuthUser } from "@/redux/slice/authSlice";
import { setPosts, setSelectPost } from "@/redux/slice/postSlice";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

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
            const res = await axios.post(`${serverURL}/user/login`, input, {
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                dispatch(setSelectPost(null));
                dispatch(setPosts([]));
                navigate("/");

                toast.success(res.data.message);
                setInput({
                    username: "",
                    password: "",
                });
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoader(false);
        }
    };

    // if user loggedIn Then dont access the login page
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
                        Login to see <span className=" text-pink-500 font-bold">Photo's</span> &{" "}
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
                {/* 
                        user loader to load and call api
                */}
                {loader ? (
                    <Button disabled={true}>
                        <Loader2 className=" animate-spin mr-2 h-4 w-4" />
                        Please Wait...
                    </Button>
                ) : (
                    <Button type="submit">Login</Button>
                )}
                <span className=" text-center">
                    new user please{" "}
                    <Link to="/signup" className=" text-blue-800">
                        Sign Up.
                    </Link>{" "}
                </span>
            </form>
        </div>
    );
};

export default Login;
