import axios from "axios";
import Header from "./Header";
import InputBox from "./InputBox";
import io from "socket.io-client";
import { Loader2 } from "lucide-react";
import logo from "../../assets/logo.png";
import MessageBubble from "./MessageBubble";
import { configure, url } from "../../misc";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

var socket, selectedChatCompare;

const Message = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.isDarkMode);
  const selectChat = useSelector((state) => state.selectChat);
  const you = useSelector((state) => state.auth.user);
  const config = configure(you.token);

  const [messageInput, setMessageInput] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [socketConnection, setSocketConnection] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const messagesContainerRef = useRef(null);

  // Socket.io connection
  useEffect(() => {
    socket = io(url);
    socket.emit("setup", you);
    socket.on("connection", () => {
      setSocketConnection(!socketConnection);
    });
  }, []);

  // Online/offline users
  useEffect(() => {
    socket.on("online users", (users) => {
      setOnlineUsers(users);
    });
    return () => {
      socket.off("online users");
    };
  }, []);

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  // New message received
  useEffect(() => {
    socket.on("message received", (newMessage) => {
      if (
        !selectedChatCompare.isChatSelected ||
        selectedChatCompare.data?.id !== newMessage.chat._id
      ) {
        null;
      } else {
        setAllMessages([...allMessages, newMessage]);
      }
    });
  });

  // Scroll to bottom
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
    };
    scrollToBottom();
    const mediaElements =
      messagesContainerRef.current?.querySelectorAll("img, video") || [];
    mediaElements.forEach((element) => {
      if (element.tagName === "IMG") {
        element.onload = scrollToBottom;
      } else if (element.tagName === "VIDEO") {
        element.onloadedmetadata = scrollToBottom;
      }
    });
    const timeoutId = setTimeout(scrollToBottom, 0);
    return () => {
      mediaElements.forEach((element) => {
        if (element.tagName === "IMG") {
          element.onload = null;
        } else if (element.tagName === "VIDEO") {
          element.onloadedmetadata = null;
        }
      });
      clearTimeout(timeoutId);
    };
  }, [allMessages, selectChat]);

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessageInput(file.name);
  };

  // Send message
  const sendMsg = async () => {
    if (messageInput.length > 0) {
      setSendLoading(true);
      let uploadedFileUrl = null;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("name", selectedFile.name);
        formData.append("file", selectedFile);
        try {
          const { data } = await axios.post(`${url}/file/upload`, formData);
          uploadedFileUrl = data.url;
        } catch (error) {
          console.error("Error uploading file:", error);
        }
        setSelectedFile();
      }
      const { data } = await axios.post(
        `${url}/message`,
        {
          content: uploadedFileUrl || messageInput,
          chatId: selectChat.data.id,
        },
        config
      );
      setAllMessages([...allMessages, data]);
      socket.emit("new message", data);
      setMessageInput("");
      setSendLoading(false);
    }
  };

  // Fetch all messages
  useEffect(() => {
    (async function () {
      if (selectChat.isChatSelected) {
        setLoading(true);
        const { data } = await axios.get(
          `${url}/message/${selectChat.data.id}`,
          config
        );
        setAllMessages(data);
        setLoading(false);
        socket.emit("join chat", selectChat.data.id);
      }
    })();
    selectedChatCompare = selectChat;
    setMessageInput("");
  }, [selectChat]);

  // Group messages by date
  const groupMessagesByDate = (messages) => {
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

  // Drawer functions
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  return (
    <div className={`message h-full ${theme ? "bg-[#131312]" : "bg-white"}`}>
      {selectChat.isChatSelected ? (
        <>
          <Header
            selectChat={selectChat}
            theme={theme}
            isUserOnline={isUserOnline}
            openDrawer={openDrawer}
            closeDrawer={closeDrawer}
            open={open}
            dispatch={dispatch}
            you={you}
          />

          <div
            ref={messagesContainerRef}
            className="pt-5 h-[83%] md:h-[80%] overflow-scroll overflow-x-hidden scrollbar-none"
          >
            {loading ? (
              <div className="flex items-center h-full">
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
                      {messages.map((msg, i) => (
                        <MessageBubble
                          key={i}
                          msg={msg}
                          you={you}
                          theme={theme}
                          selectChat={selectChat}
                        />
                      ))}
                    </div>
                  )
                )}
              </>
            )}
          </div>

          <InputBox
            theme={theme}
            messageInput={messageInput}
            setMessageInput={setMessageInput}
            sendMsg={sendMsg}
            sendLoading={sendLoading}
            handleFileChange={handleFileChange}
          />
        </>
      ) : (
        <div className="flex justify-center items-center h-full">
          <section>
            <img src={logo} alt="" className="block m-auto w-48" />
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

export default Message;
