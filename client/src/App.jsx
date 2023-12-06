import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Chat from "./Pages/Chat";
import Menu from "./Components/Menu";
import Setting from "./Pages/Setting";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
export default function App() {
  const { pathname } = useLocation();
  const auth = useSelector((state) => state.auth.isAuthenticated);
  const load = useSelector((state) => state.pageLoad);
  function PrivateRoute({ children }) {
    return auth ? children : <Navigate to="/" />;
  }
  return (
    <>
      {load ? (
        <div class="linear-activity">
          <div class="indeterminate"></div>
        </div>
      ) : (
        <div className="flex">
          {(pathname === "/chats" || pathname === "/setting") && <Menu />}
          <Routes>
            <Route
              path="/chats"
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              }
            />
            <Route
              path="/setting"
              element={
                <PrivateRoute>
                  <Setting />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          <ToastContainer />
        </div>
      )}
    </>
  );
}
