import React from "react";
import Contacts from "../Components/Contacts";
import Messages from "../Components/Messages";
import { useDispatch, useSelector } from "react-redux";
const Chat = () => {
  const theme = useSelector((state) => state.theme.isDarkMode);
  return (
    <>
      <div
        className={`flex py-[1.5vh] pr-[.8vw] gap-[.8vw] ${
          theme ? "bg-[#1f1f23]" : "bg-[#f6f6f7]"
        }`}
      >
        <Contacts />
        <Messages />
      </div>
    </>
  );
};

export default Chat;
