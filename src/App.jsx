/** @format */

import { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { io } from "socket.io-client";
import "./App.css";
import Loader from "./components/Home/Loader";
import { setOnlineUser } from "./redux/slice/chatSlice";
import { setLikeNotification } from "./redux/slice/realTimeNoficationSlice";
import { setSocket } from "./redux/slice/socketSlice";

const Home = lazy(() => import("./components/Home/Home"));
const MainLayout = lazy(() => import("./components/Layout/MainLayout"));
const ChatPage = lazy(() => import("./components/Home/ChatPage"));
const EditUserProfile = lazy(() => import("./components/Home/EditUserProfile"));
const Login = lazy(() => import("./components/userAuth/Login"));
const Signup = lazy(() => import("./components/userAuth/Signup"));
const Profile = lazy(() => import("./components/UserProfile/Profile"));
const ProtectedRoute = lazy(() => import("./components/Home/ProtectedRoute"));

const browserRouter = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: "/",
                element: (
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/profile/:id",
                element: (
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/account/edit",
                element: (
                    <ProtectedRoute>
                        <EditUserProfile />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/chat",
                element: (
                    <ProtectedRoute>
                        <ChatPage />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "signup",
        element: <Signup />,
    },
]);

function App() {
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const { socket } = useSelector((store) => store.socketio);

    useEffect(() => {
        if (user) {
            // isme hum apne backend ke socket io ko frontend ke socket io ke saat connect karange
            const socketio = io("https://socialmedia-application-xgfl.onrender.com", {
                query: {
                    // hum {userId} is user id ko backend main access kar rahe hai to hum is thare se userid backend main send kar sakte hai
                    userId: user?._id,
                },
                transports: ["websocket"],
            });
            // store the socket io on redux store
            dispatch(setSocket(socketio));

            // listning the all event to send the backend
            // backend se jitne bhe events kiye gye hai ounhe hum access kar skate hai or ounhe listen kar sakte hai

            // {socketio.on('getOnlineUser')} ye event name same backend ke jesa hona chiye jesa backend se send kiya gya ho
            socketio.on("getOnlineUser", (onlineUser) => {
                // jo bhe user online honge ounhe hum redux store main store kar lange
                dispatch(setOnlineUser(onlineUser));
            });

            // listen the real time notification event
            socketio.on("notification", (notification) => {
                // hum backend se {notification} se jo object send kar rahe the ouse hum redux main store kar lange
                dispatch(setLikeNotification(notification));
            });

            // clean the browser// agar hum apni id kisi browser main open karke tab close kar dete hai to user logout ho jana chiye

            // ye return function unmounting ka kam karta hai yahi jb hamara components remove hoga ya delete hoga to tb ye code execute hoga
            return () => {
                socketio.close();
                dispatch(setSocket(null));
                // dispatch(setAuthUser(null));
            };
        } else if (socket) {
            socket.close();
            dispatch(setSocket(null));
        }
    }, [user, dispatch]);
    return (
        <div>
            <Suspense fallback={<Loader />}>
                <RouterProvider router={browserRouter} />
            </Suspense>
        </div>
    );
}

export default App;
