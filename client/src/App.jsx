import Chat from "./Pages/Chat";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfilePicture from "./Pages/ProfilePicture";
import { Routes, Route, Navigate } from "react-router-dom";
export default function App() {
  const auth = useSelector((state) => state.auth.isAuthenticated);
  const load = useSelector((state) => state.pageLoad);
  function PrivateRoute({ children }) {
    return auth ? children : <Navigate to="/" />;
  }
  return (
    <>
      {load ? (
        <div className="linear-activity">
          <div className="indeterminate"></div>
        </div>
      ) : (
        <div className="flex">
          <Routes>
            <Route
              path="/chats"
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profilePicture/:id" element={<ProfilePicture />} />
          </Routes>
          <ToastContainer />
        </div>
      )}
    </>
  );
}
