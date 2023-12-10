import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Bell,
  Search,
  Loader2,
  MoreVertical,
  UserRound,
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
} from "@material-tailwind/react";
import { configure, formatDateTime, url } from "./misc";
import axios from "axios";
import { notSelectedChat, selectedChat } from "../Redux/SelectedChat/action";
import { toggleTheme } from "../Redux/Theme/action";
import { logout } from "../Redux/Auth/action";
const Contacts = () => {
  const theme = useSelector((state) => state.theme.isDarkMode);
  const you = useSelector((state) => state.auth.user);
  const selectChat = useSelector((state) => state.selectChat);
  const dispatch = useDispatch();
  const config = configure(you.token);
  const [search, setSearch] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [chatList, setChatList] = useState([]);
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
  useEffect(() => {
    const fetchList = async () => {
      setListLoading(true);
      const { data } = await axios.get(`${url}/chat`, config);
      setChatList(data);
      setListLoading(false);
    };
    fetchList();
  }, []);
  async function addChatList(userId) {
    let found = false;
    for (const chat of chatList) {
      if (chat.members.some((member) => member._id === userId)) {
        found = true;
      }
    }
    if (found === false) {
      setSearch("");
      const { data } = await axios.post(`${url}/chat`, { userId }, config);
      setChatList([data, ...chatList]);
    } else {
      setSearch("");
    }
  }
  return (
    <div className={`contact h-full ${theme ? "bg-[#131312]" : "bg-white"}`}>
      <div
        className={`flex justify-between items-center ${
          theme ? "text-white" : "text-black"
        }`}
      >
        <h1 className="text-3xl font-semibold">Chats</h1>
        <div className="flex items-center gap-3">
          <Bell className="cursor-pointer" />
          <Menu>
            <MenuHandler>
              <MoreVertical className="cursor-pointer" />
            </MenuHandler>
            <MenuList
              className={`${theme ? "bg-[#131312] text-gray-400" : ""}`}
            >
              <MenuItem className="flex items-center gap-2">
                <UserRound />
                <p className="text-lg">Profile</p>
              </MenuItem>
              <MenuItem className="flex items-center gap-2">
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
                  dispatch(notSelectedChat());
                  dispatch(logout());
                }}
              >
                <LogOut />
                <p className="text-lg">Logout</p>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
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
                    className={`flex gap-2 p-2 rounded-xl items-center cursor-pointer ${
                      theme ? "hover:bg-[#4c4d52]" : "hover:bg-[#d6d6d7]"
                    }`}
                    onClick={() => {
                      addChatList(item._id);
                    }}
                  >
                    <Avatar src={item.profilePicture} size="xs" />
                    <p className={`${theme ? "text-white" : "text-black"}`}>
                      {item.name}
                    </p>
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
          className={`h-[70vh] ${
            chatList.length > 5 ? "overflow-scroll" : ""
          }  overflow-x-hidden mt-7 flex flex-col gap-1`}
        >
          {chatList?.map((item, index) => {
            var chatName = "";
            if (item.isGroupChat) {
              chatName = item.chatName;
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
                  className={`flex p-3 rounded-xl  justify-between items-start cursor-pointer ${
                    chatList.length > 5 ? "mr-2" : ""
                  } ${
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
                    dispatch(selectedChat({ id: item._id, detail: chatName }));
                  }}
                >
                  <div className="flex gap-3">
                    <Avatar src={chatName.profilePicture} alt="" />
                    <div>
                      <h2
                        className={`font-bold text-base	${
                          theme ? "text-white" : "text-black"
                        }`}
                      >
                        {chatName.name}
                      </h2>
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
                  className={`flex p-3 rounded-xl justify-between items-start cursor-pointer ${
                    chatList.length > 5 ? "mr-2" : ""
                  } ${
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
                    dispatch(selectedChat({ id: item._id, detail: chatName }));
                  }}
                >
                  <div className="flex gap-3">
                    <Avatar src={chatName.profilePicture} alt="" />
                    <div>
                      <h2
                        className={`font-bold text-base	${
                          theme ? "text-white" : "text-black"
                        }`}
                      >
                        {chatName.name}
                      </h2>
                      <p
                        className={`text-sm	${
                          theme ? "text-white" : "text-black"
                        }`}
                      >
                        {item.latestMessage.content}
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
