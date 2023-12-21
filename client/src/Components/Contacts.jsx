import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Loader2,
  ChevronDown,
  UsersRound,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import {
  Avatar,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
} from "@material-tailwind/react";
import { configure, formatDateTime, url } from "./misc";
import axios from "axios";
import { notSelectedChat, selectedChat } from "../Redux/SelectedChat/action";
import { toggleTheme } from "../Redux/Theme/action";
import { logout } from "../Redux/Auth/action";
import MultiSelect from "./MultiSelect";
import io from "socket.io-client";
import AvataR from "./AvataR";
var socket, selectedChatCompare;
const Contacts = () => {
  const theme = useSelector((state) => state.theme.isDarkMode);
  const you = useSelector((state) => state.auth.user);
  const selectChat = useSelector((state) => state.selectChat);
  const dispatch = useDispatch();
  const config = configure(you.token);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [chatList, setChatList] = useState([]);
  // TODO socket.io ⮧
  const [socketConnection, setSocketConnection] = useState(false);
  useEffect(() => {
    socket = io(url);
    socket.emit("setup", you);
    socket.on("connection", () => {
      setSocketConnection(!socketConnection);
    });
  }, []);
  //online or offline
  const [onlineUsers, setOnlineUsers] = useState([]);
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
  const [notifyChats, setNotifyChats] = useState([]);
  const [newMsg, setNewMsg] = useState();
  useEffect(() => {
    if (newMsg !== undefined) {
      const isNewChat = chatList?.every((chat) => chat._id !== newMsg.chat._id);
      if (isNewChat) {
        setNotifyChats([newMsg.chat._id, ...notifyChats]);
        setChatList([
          {
            ...newMsg.chat,
            latestMessage: {
              content: newMsg.content,
              sender: newMsg.sender,
              updatedAt: newMsg.updatedAt,
            },
          },
          ...chatList,
        ]);
      } else {
        const updatedChat = {
          ...newMsg.chat,
          latestMessage: {
            content: newMsg.content,
            sender: newMsg.sender,
            updatedAt: newMsg.updatedAt,
          },
        };
        if (
          !selectedChatCompare.isChatSelected ||
          selectedChatCompare.data.id !== newMsg.chat._id
        ) {
          setNotifyChats([newMsg.chat._id, ...notifyChats]);
          setChatList((prevChatList) =>
            removeDuplicates([updatedChat, ...prevChatList], "_id")
          );
        }
      }
    }
  }, [newMsg]);
  useEffect(() => {
    socket.on("message received", (newMessage) => {
      setNewMsg(newMessage);
    });
  });
  useEffect(() => {
    selectedChatCompare = selectChat;
    let newArray = notifyChats.filter((e) => e !== selectedChatCompare.data.id);
    setNotifyChats(newArray);
  }, [selectChat]);
  // TODO socket.io ⮥
  // TODO search ⮧
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setSearchLoading(true);
        const { data } = await axios.get(
          `${url}/auth/search?search=${search}`,
          config
        );
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setSearchLoading(false);
      }
    };
    const debounceTimer = setTimeout(() => {
      if (search?.length > 0) {
        fetchResults();
      } else if (search?.length == 0) {
        setSearchResults([]);
      }
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [search]);
  // TODO search ⮥
  useEffect(() => {
    const fetchList = async () => {
      setListLoading(true);
      const { data } = await axios.get(`${url}/chat`, config);
      setChatList(data);
      setListLoading(false);
    };
    fetchList();
    window.addEventListener("beforeunload", () => {
      socket.emit("logout", you._id);
    });
  }, []);
  async function addChatList(userId) {
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
  }
  //create group
  const [image, setImage] = useState(
    "https://i.ibb.co/0hvhdRK/240-F-686603587-bo-Vdde3-U00-AMRWSVIMnz3-Gu-UBAouyued0.jpg"
  );
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [imgUrl, setImgUrl] = useState(
    "https://i.ibb.co/0hvhdRK/240-F-686603587-bo-Vdde3-U00-AMRWSVIMnz3-Gu-UBAouyued0.jpg"
  );
  const handleImageChange = async (event) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(selectedImage);
      const Data = new FormData();
      Data.append("name", selectedImage.name);
      Data.append("file", selectedImage);
      const { data } = await axios.post(`${url}/file/upload`, Data);
      setImgUrl(data.imageUrl);
    }
  };
  const createGroup = async () => {
    if (groupName?.length === 0) {
      alert("Please Enter Group Name");
    } else if (selectedMembers.length < 2) {
      alert("minimum 2 members required!");
    } else {
      const { data } = await axios.post(
        `${url}/chat/group`,
        {
          name: groupName,
          members: selectedMembers,
          groupPicture: imgUrl,
        },
        config
      );
      dispatch(
        selectedChat({
          id: data.wholeGroupChat._id,
          detail: data.wholeGroupChat,
          isChatGroup: true,
        })
      );
      setChatList([data.wholeGroupChat, ...chatList]);
      handleOpen();
    }
  };
  function countOccurrences(arr, target) {
    const count = arr.reduce(
      (acc, current) => (current === target ? acc + 1 : acc),
      0
    );
    return count;
  }
  return (
    <div className={`contact h-full ${theme ? "bg-[#131312]" : "bg-white"}`}>
      <div
        className={`flex justify-between items-center ${
          theme ? "text-white" : "text-black"
        }`}
      >
        <h1 className="text-3xl font-semibold">Chats</h1>
        <div className="flex gap-3 items-center">
          <Avatar src={you.profilePicture} />
          <Menu>
            <MenuHandler>
              <ChevronDown className="cursor-pointer" />
            </MenuHandler>
            <MenuList
              className={`${theme ? "bg-[#131312] text-gray-400" : ""}`}
            >
              <MenuItem
                className="flex items-center gap-2"
                onClick={() => handleOpen()}
              >
                <UsersRound />
                <p className="text-lg">Create Group</p>
              </MenuItem>
              <MenuItem
                className="flex items-center gap-2"
                onClick={() => dispatch(toggleTheme())}
              >
                {theme ? <Moon /> : <Sun />}
                <p className="text-lg">Theme</p>
              </MenuItem>
              <MenuItem
                className="flex items-center gap-2"
                onClick={() => {
                  sessionStorage.clear();
                  socket.emit("logout", you._id);
                  dispatch(notSelectedChat());
                  dispatch(logout());
                }}
              >
                <LogOut />
                <p className="text-lg">Sign out</p>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
        <Dialog
          open={open}
          size="sm"
          handler={handleOpen}
          className={`border ${theme ? "bg-[#131312]" : ""}`}
        >
          <DialogHeader className={`${theme ? "text-white" : ""}`}>
            Create Group
          </DialogHeader>
          <DialogBody className="flex flex-col gap-3.5">
            <div className="flex flex-col md:flex-row md:items-center justify-start gap-4 ">
              <label htmlFor="file" className="cursor-pointer">
                <Avatar size="lg" src={image} />
              </label>
              <input
                type="file"
                style={{ display: "none" }}
                id="file"
                onChange={handleImageChange}
              />
              <input
                type="text"
                className={`border p-2 rounded-md w-full md:w-[85%] ${
                  theme
                    ? "text-white placeholder:text-gray-400"
                    : "border-gray-900 text-black placeholder:text-gray-600"
                } bg-transparent`}
                placeholder="Enter Group Name"
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
            <MultiSelect
              onMembersSelect={(members) => setSelectedMembers(members)}
            />
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={handleOpen}
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
            <Button variant="gradient" color="green" onClick={createGroup}>
              <span>Create Group</span>
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
      {/* searchInput */}
      <>
        <label
          htmlFor="search"
          className={`flex items-center gap-2 ${
            theme ? "bg-[#252425] text-white" : "bg-[#f6f6f7] text-[#4c4d52]"
          }
           text-base p-2 rounded-lg mt-5 font-semibold`}
        >
          {searchLoading ? (
            <Loader2 strokeWidth={2} className="animate-spin" />
          ) : (
            <Search strokeWidth={2} />
          )}
          <input
            type="search"
            id="search"
            placeholder="Search by name and email..."
            autoComplete="off"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="last:w-full bg-transparent outline-none"
          />
        </label>
        <div className="relative">
          {searchResults.length > 0 ? (
            <div
              className={`absolute w-full z-10 mt-1 shadow-2xl px-5 py-2 rounded-lg ${
                theme ? "bg-[#222222]" : "bg-white"
              }`}
            >
              <div
                className={`flex flex-col gap-1 max-h-[110px] ${
                  searchResults.length > 3 ? "overflow-scroll" : ""
                } overflow-x-hidden`}
              >
                {searchResults.map((item, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 p-2 rounded-xl items-center cursor-pointer ${
                      theme ? "hover:bg-[#4c4d52]" : "hover:bg-[#d6d6d7]"
                    }`}
                    onClick={() => {
                      addChatList(item._id);
                    }}
                  >
                    <Avatar src={item.profilePicture} size="sm" />
                    <div>
                      <p className={`${theme ? "text-white" : "text-black"}`}>
                        {item.name}
                      </p>
                      <small
                        className={`${theme ? "text-white" : "text-black"}`}
                      >
                        {item.email}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : searchResults.length === 0 && search?.length > 0 ? (
            <div
              className={`absolute w-full z-10 mt-2 shadow-2xl px-5 py-2 rounded-lg ${
                theme ? "bg-[#222222]" : "bg-white"
              }`}
            >
              <p className={`${theme ? "text-white" : "text-black"} py-3`}>
                {" "}
                No Results found.
              </p>
            </div>
          ) : null}
        </div>
      </>
      {/* searchInput */}
      {listLoading ? (
        <div className="flex justify-center items-center h-[70vh]">
          <Loader2
            size="50px"
            className={`${theme ? "text-white" : ""} m-auto animate-spin`}
          />
        </div>
      ) : (
        <div
          className={`h-[70vh] scrollbar-none ${
            chatList.length > 6 ? "overflow-scroll" : ""
          } md:${
            chatList.length > 5 ? "overflow-scroll" : ""
          }  overflow-x-hidden mt-7 flex flex-col gap-1`}
        >
          {chatList?.map((item, index) => {
            var chatName = "";
            if (item.isGroupChat) {
              chatName = item;
            } else {
              item.members.map((i) => {
                if (i._id != you._id) {
                  chatName = i;
                }
              });
            }
            if (item.latestMessage === undefined) {
              return (
                <div
                  key={index}
                  className={`flex p-3 rounded-xl  justify-between items-start cursor-pointer  ${
                    theme
                      ? "hover:bg-[#4c4d52] bg-[#171718]"
                      : "hover:bg-[#d6d6d7] bg-[#f7f7f7]"
                  }
                ${
                  selectChat.isChatSelected &&
                  selectChat.data.detail._id == chatName._id
                    ? theme
                      ? "bg-gray-900 hover:bg-gray-900"
                      : "bg-gray-300 hover:bg-gray-300"
                    : null
                }`}
                  onClick={() => {
                    dispatch(
                      selectedChat({
                        id: item._id,
                        detail: chatName,
                        isChatGroup: chatName.isGroupChat ? true : false,
                      })
                    );
                  }}
                >
                  <div className="flex gap-3">
                    {chatName.isGroupChat ? (
                      <Avatar
                        src={chatName.groupPicture}
                        alt=""
                        loading="lazy"
                      />
                    ) : (
                      <AvataR
                        src={chatName.profilePicture}
                        w={12}
                        h={12}
                        isOnline={isUserOnline(chatName._id)}
                        alt=""
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h2
                          className={`font-bold text-base	${
                            theme ? "text-white" : "text-black"
                          }`}
                        >
                          {chatName.isGroupChat
                            ? chatName.chatName
                            : chatName.name}
                        </h2>
                        {notifyChats.includes(item._id) ? (
                          <p className=" flex justify-center items-center w-4 h-4 rounded-full bg-red-600 text-white text-xs">
                            {countOccurrences(notifyChats, item._id)}
                          </p>
                        ) : null}
                      </div>
                      <p
                        className={`text-sm	${
                          theme ? "text-white" : "text-black"
                        }`}
                      >
                        No previous Messages
                      </p>
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  key={index}
                  className={`flex p-3 rounded-xl justify-between items-start cursor-pointer  ${
                    theme
                      ? "hover:bg-[#4c4d52] bg-[#171718]"
                      : "hover:bg-[#d6d6d7] bg-[#f7f7f7]"
                  }
              ${
                selectChat.isChatSelected &&
                selectChat.data.detail._id == chatName._id
                  ? theme
                    ? "bg-gray-900 hover:bg-gray-900"
                    : "bg-gray-300 hover:bg-gray-300"
                  : null
              }`}
                  onClick={() => {
                    dispatch(
                      selectedChat({
                        id: item._id,
                        detail: chatName,
                        isChatGroup: chatName.isGroupChat ? true : false,
                      })
                    );
                  }}
                >
                  <div className="flex gap-3">
                    {chatName.isGroupChat ? (
                      <Avatar src={chatName.groupPicture} alt="" />
                    ) : (
                      <AvataR
                        src={chatName.profilePicture}
                        w={12}
                        h={12}
                        isOnline={isUserOnline(chatName._id)}
                        alt=""
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h2
                          className={`font-bold text-base	${
                            theme ? "text-white" : "text-black"
                          }`}
                        >
                          {chatName.isGroupChat
                            ? chatName.chatName
                            : chatName.name}
                        </h2>
                        {notifyChats.includes(item._id) ? (
                          <p className=" flex justify-center items-center w-4 h-4 rounded-full bg-red-600 text-white text-xs">
                            {countOccurrences(notifyChats, item._id)}
                          </p>
                        ) : null}
                      </div>
                      <p
                        className={`text-sm	${
                          theme ? "text-white" : "text-black"
                        }`}
                      >
                        {chatName.isGroupChat
                          ? `${
                              chatName.latestMessage.sender._id === you._id
                                ? "You"
                                : chatName.latestMessage.sender.name
                            } : ${chatName.latestMessage.content}`
                          : item.latestMessage.content}
                      </p>
                    </div>
                  </div>
                  <small className={`${theme ? "text-white" : "text-black"}`}>
                    {formatDateTime(item.updatedAt)}
                  </small>
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
};

export default Contacts;
