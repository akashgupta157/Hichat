import {
  Avatar,
  IconButton,
  Drawer,
  Typography,
} from "@material-tailwind/react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Phone,
  Video,
  MoreHorizontal,
  Smile,
  Paperclip,
  Send,
  X,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import logo from "../assets/logo.png";
import { notSelectedChat } from "../Redux/SelectedChat/action";
import { configure, formatTime, url } from "./misc";
import axios from "axios";
const Messages = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.isDarkMode);
  const selectChat = useSelector((state) => state.selectChat);
  const you = useSelector((state) => state.auth.user);
  const config = configure(you.token);
  const [openRight, setOpenRight] = useState(false);
  const openDrawerRight = () => setOpenRight(true);
  const closeDrawerRight = () => setOpenRight(false);
  const [messageInput, setMessageInput] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesContainerRef = useRef(null);
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [allMessages, selectChat]);
  const sendMsg = () => {
    //send msg
    if (messageInput.length > 0) {
      axios.post(
        `${url}/message`,
        {
          content: messageInput,
          chatId: selectChat.data.id,
        },
        config
      );
    }
  };
  useEffect(() => {
    //fetch All Messages
    (async function () {
      if (selectChat.isChatSelected) {
        setLoading(true);
        const { data } = await axios.get(
          `${url}/message/${selectChat.data.id}`,
          config
        );
        setAllMessages(data);
        setLoading(false);
      }
    })();
  }, [selectChat, messageInput]);
  const groupMessagesByDate = (messages) => {
    // segregate chats by date
    const groupedMessages = {};
    messages.forEach((msg) => {
      const dateKey = new Date(msg.createdAt).toDateString();
      if (!groupedMessages[dateKey]) {
        groupedMessages[dateKey] = [];
      }
      groupedMessages[dateKey].push(msg);
    });
    return groupedMessages;
  };
  return (
    <div
      className={`w-full md:w-[64.4vw] h-[97vh] flex flex-col rounded-xl ${
        theme ? "bg-[#131312]" : "bg-white"
      }`}
    >
      {selectChat.isChatSelected ? (
        <>
          {/* navbar */}
          <nav
            className={`flex justify-between items-center px-3 md:px-7 py-2 shadow-md ${
              theme ? "text-white shadow-gray-900" : "text-black"
            }`}
          >
            <div className="flex items-center gap-2 md:gap-4">
              <ArrowLeft
                className="md:hidden"
                onClick={() => {
                  dispatch(notSelectedChat());
                }}
              />
              <Avatar
                src={selectChat.data.detail.profilePicture}
                size="sm"
                alt="avatar"
              />
              <div>
                <h3 className={`font-semibold text-md md:text-lg`}>
                  {selectChat.data.detail.name}
                </h3>
                <p className={`font-medium text-sm`}>Online</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Phone cursor={"pointer"} className="" />
              <Video cursor={"pointer"} className="" />
              <MoreHorizontal cursor={"pointer"} onClick={openDrawerRight} />
            </div>
            <Drawer
              placement="right"
              open={openRight}
              onClose={closeDrawerRight}
              className="p-4"
            >
              <div className="flex items-center justify-between">
                <Typography variant="h5" color="blue-gray">
                  Contact Info
                </Typography>
                <IconButton
                  variant="text"
                  color="blue-gray"
                  onClick={closeDrawerRight}
                >
                  <X />
                </IconButton>
              </div>
              <hr className="my-3" />
            </Drawer>
          </nav>
          {/* navbar */}
          {/* messagesArea */}
          <div
            ref={messagesContainerRef}
            className="h-[75vh] md:h-[80vh] overflow-scroll overflow-x-hidden scrollbar-none"
          >
            {loading ? (
              <div className="h-full flex items-center">
                <Loader2
                  size="70px"
                  className={`${theme ? "text-white" : ""} m-auto animate-spin`}
                />
              </div>
            ) : (
              <>
                {Object.entries(groupMessagesByDate(allMessages)).map(
                  ([date, messages]) => (
                    <div key={date}>
                      <h2
                        className={`text-center text-sm mb-2 ${
                          theme ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {date === new Date().toDateString() ? "Today" : date}
                      </h2>
                      {messages.map((msg, i) => {
                        const sender = msg.sender;
                        if (sender._id === you._id) {
                          return (
                            <div className="flex justify-end p-2">
                              <section
                                className={`rounded ${
                                  theme
                                    ? "bg-[#0171b6] text-white"
                                    : "bg-[#0eb6fa]"
                                }  py-1 px-3`}
                              >
                                <h1 key={i}>{msg.content}</h1>
                                <b className={`flex justify-end text-xs `}>
                                  {formatTime(msg.createdAt)}
                                </b>
                              </section>
                            </div>
                          );
                        } else {
                          return (
                            <div className="p-2">
                              <section
                                className={`rounded w-fit py-1 px-3 ${
                                  theme
                                    ? "bg-[#212121] text-white"
                                    : "bg-[#d6d6d7]"
                                } `}
                              >
                                <h1 key={i}>{msg.content}</h1>
                                <b className="flex justify-end text-xs">
                                  {formatTime(msg.createdAt)}
                                </b>
                              </section>
                            </div>
                          );
                        }
                      })}
                    </div>
                  )
                )}
              </>
            )}
          </div>
          {/* messagesArea */}
          {/* input box for send message */}
          <footer
            className={`border-t h-[5vh] md:h-[10vh] md:flex items-center justify-center ${
              theme ? "border-gray-800" : "border-gray-300"
            } `}
          >
            <div className="mt-2 md:mt-0 flex items-center justify-center gap-2 w-full">
              <div
                className={`flex px-2 md:px-5 py-2 gap-3 rounded-lg w-[80%] md:w-[90%] ${
                  theme ? "bg-[#252425] text-[#bebebe]" : "bg-[#f6f6f7]"
                }`}
              >
                <Smile cursor={"pointer"} />
                <Paperclip cursor={"pointer"} />
                <input
                  type="text"
                  required
                  placeholder="Type your message here..."
                  className="bg-transparent outline-none w-full"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.code === "Enter") {
                      sendMsg();
                      setMessageInput("");
                    }
                  }}
                />
              </div>
              <IconButton
                type="submit"
                className="bg-[#000000]"
                onClick={() => {
                  sendMsg();
                  setMessageInput("");
                }}
              >
                <Send />
              </IconButton>
            </div>
          </footer>
          {/* input box for send message */}
        </>
      ) : (
        <div className="flex justify-center items-center h-full">
          <section>
            <img src={logo} alt="" className="w-48 block m-auto" />
            <h1
              className={`mt-5 font-semibold text-4xl ${
                theme ? "text-white" : "text-black"
              }`}
            >
              Welcome to Hichat
            </h1>
          </section>
        </div>
      )}
    </div>
  );
};

export default Messages;
