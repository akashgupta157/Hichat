import axios from "axios";
import Header from "./Header";
import io from "socket.io-client";
import ChatList from "./ChatList";
import SearchInput from "./SearchInput";
import { configure, url } from "../../misc";
import { useEffect, useState } from "react";
import livechat from "../../assets/livechat.mp3";
import { toggleTheme } from "../../Redux/Theme/action";
import { useDispatch, useSelector } from "react-redux";
import GroupCreationDialog from "./GroupCreationDialog";
import { selectedChat } from "../../Redux/SelectedChat/action";

var socket, selectedChatCompare;

const Contact = () => {
  const theme = useSelector((state) => state.theme.isDarkMode);
  const you = useSelector((state) => state.auth.user);
  const selectChat = useSelector((state) => state.selectChat);
  const dispatch = useDispatch();
  const config = configure(you.token);

  // State
  const [openDialog, setOpenDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [socketConnection, setSocketConnection] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifyChats, setNotifyChats] = useState([]);
  const [newMsg, setNewMsg] = useState();

  // Socket.io setup
  useEffect(() => {
    socket = io(url);
    socket.emit("setup", you);
    socket.on("connection", () => {
      setSocketConnection(!socketConnection);
    });

    return () => {
      socket.off("connection");
    };
  }, []);

  // Online users tracking
  useEffect(() => {
    socket.on("online users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("online users");
    };
  }, []);

  // Notification handling
  useEffect(() => {
    if (newMsg !== undefined) {
      handleNewMessageNotification(newMsg);
    }
  }, [newMsg]);

  useEffect(() => {
    socket.on("message received", (newMessage) => {
      setNewMsg(newMessage);
    });

    return () => {
      socket.off("message received");
    };
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchList();
    selectedChatCompare = selectChat;
    let newArray = notifyChats.filter(
      (e) => e !== selectedChatCompare.data?.id
    );
    setNotifyChats(newArray);

    window.addEventListener("beforeunload", () => {
      socket.emit("logout", you._id);
    });

    return () => {
      window.removeEventListener("beforeunload", () => {
        socket.emit("logout", you._id);
      });
    };
  }, [selectChat]);

  // Search functionality
  useEffect(() => {
    if (search?.length > 0) {
      setSearchLoading(true);
    } else {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        const { data } = await axios.get(
          `${url}/auth/search?search=${search}`,
          config
        );
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchResults();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [search]);

  // Helper functions
  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  const removeDuplicates = (array, key) => {
    const seen = new Set();
    return array.filter((item) => {
      const itemKey = key ? item[key] : JSON.stringify(item);
      if (!seen.has(itemKey)) {
        seen.add(itemKey);
        return true;
      }
      return false;
    });
  };

  const handleNewMessageNotification = (newMsg) => {
    const isNewChat = chatList?.every((chat) => chat._id !== newMsg.chat._id);
    const updatedChat = {
      ...newMsg.chat,
      latestMessage: {
        content: newMsg.content,
        sender: newMsg.sender,
        updatedAt: newMsg.updatedAt,
      },
    };

    if (isNewChat) {
      setNotifyChats([newMsg.chat._id, ...notifyChats]);
      setChatList([updatedChat, ...chatList]);
    } else {
      if (
        !selectedChatCompare.isChatSelected ||
        selectedChatCompare.data?.id !== newMsg.chat._id
      ) {
        setNotifyChats([newMsg.chat._id, ...notifyChats]);
        setChatList((prevChatList) =>
          removeDuplicates([updatedChat, ...prevChatList], "_id")
        );
      }
    }
  };

  const fetchList = async () => {
    const { data } = await axios.get(`${url}/chat`, config);
    setChatList(data);
  };

  const addChatList = async (userId) => {
    if (chatList.length > 0) {
      for (const chat of chatList) {
        if (
          chat.isGroupChat === false &&
          chat.members.some((member) => member._id === userId)
        ) {
          setSearch("");
          chat.members.filter((e) => {
            if (e._id !== you._id) {
              dispatch(
                selectedChat({
                  id: chat._id,
                  detail: e,
                  isChatGroup: false,
                })
              );
            }
          });
          break;
        } else {
          setSearch("");
          const { data } = await axios.post(`${url}/chat`, { userId }, config);
          data.members.filter((e) => {
            if (e._id !== you._id) {
              dispatch(
                selectedChat({
                  id: data._id,
                  detail: e,
                  isChatGroup: false,
                })
              );
            }
          });
          setChatList([data, ...chatList]);
        }
      }
    } else {
      setSearch("");
      const { data } = await axios.post(`${url}/chat`, { userId }, config);
      data.members.filter((e) => {
        if (e._id !== you._id) {
          dispatch(
            selectedChat({
              id: data._id,
              detail: e,
              isChatGroup: false,
            })
          );
        }
      });
      setChatList([data, ...chatList]);
    }
  };

  const countOccurrences = (arr, target) => {
    return arr.reduce(
      (acc, current) => (current === target ? acc + 1 : acc),
      0
    );
  };

  const toggleDialog = () => setOpenDialog(!openDialog);

  return (
    <div className={`contact h-full ${theme ? "bg-[#131312]" : "bg-white"}`}>
      <Header
        theme={theme}
        you={you}
        toggleDialog={toggleDialog}
        dispatch={dispatch}
        toggleTheme={() => dispatch(toggleTheme())}
      />

      <SearchInput
        theme={theme}
        search={search}
        searchLoading={searchLoading}
        searchResults={searchResults}
        setSearch={setSearch}
        addChatList={addChatList}
      />

      <ChatList
        theme={theme}
        chatList={chatList}
        selectChat={selectChat}
        you={you}
        isUserOnline={isUserOnline}
        notifyChats={notifyChats}
        countOccurrences={countOccurrences}
        dispatch={dispatch}
      />

      <GroupCreationDialog
        open={openDialog}
        handleOpen={toggleDialog}
        theme={theme}
        setChatList={setChatList}
        dispatch={dispatch}
        config={config}
      />
    </div>
  );
};

export default Contact;
