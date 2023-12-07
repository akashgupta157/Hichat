import React from "react";
import Contacts from "../Components/Contacts";
import Messages from "../Components/Messages";
import { useDispatch, useSelector } from "react-redux";
const Chat = () => {
  const theme = useSelector((state) => state.theme.isDarkMode);
  const selectChat = useSelector((state) => state.selectChat);
  return (
    <>
      <div
        className={`flex py-[1.5vh] pr-[.8vw] gap-[.8vw] ${
          theme ? "bg-[#010001]" : "bg-[#f6f6f7]"
        }`}
      >
        <Contacts />
        <Messages />
      </div>
    </>
  );
};

export default Chat;
