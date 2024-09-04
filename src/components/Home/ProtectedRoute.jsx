/** @format */

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    // this is a protected route

    // access the login user
    const { user } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    useEffect(() => {
        // if user not login then rediract the user in login page
        if (!user) {
            navigate("/login");
        }
    }, []);
    return <>{children}</>;
};

export default ProtectedRoute;
