import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Message from "../Components/ChatWindow/Message";
import Contact from "../Components/ChatSidebar/Contact";
const Chat = () => {
  const theme = useSelector((state) => state.theme.isDarkMode);
  const selectChat = useSelector((state) => state.selectChat);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 768);
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      {isLargeScreen ? (
        <div
          className={`chat flex gap-4 w-full h-[100vh] ${
            theme ? "bg-[#010001]" : "bg-[#f6f6f7]"
          }`}
        >
          <Contact />
          <Message />
        </div>
      ) : (
        <div
          className={`chat w-full h-[100vh] ${
            theme ? "bg-[#010001]" : "bg-[#f6f6f7]"
          }`}
        >
          {selectChat.isChatSelected ? <Message /> : <Contact />}
        </div>
      )}
    </>
  );
};

export default Chat;
