import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Chat from "./Pages/Chat";
import Menu from "./Components/Menu";
import Setting from "./Pages/Setting";
export default function App() {
  const { pathname } = useLocation();
  return (
    <div className="flex">
      {(pathname === "/chats" || pathname === "/setting") && <Menu />}
      <Routes>
        <Route path="/chats" element={<Chat />} />
        <Route path="/setting" element={<Setting />} />
      </Routes>
    </div>
  );
}
