import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Chat from "./Pages/Chat";
import Menu from "./Components/Menu";
import Setting from "./Pages/Setting";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function App() {
  const { pathname } = useLocation();
  return (
    <div className="flex">
      {(pathname === "/chats" || pathname === "/setting") && <Menu />}
      <Routes>
        <Route path="/chats" element={<Chat />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}
