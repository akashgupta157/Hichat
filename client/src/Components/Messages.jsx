import {
  Avatar,
  IconButton,
  Drawer,
  Typography,
} from "@material-tailwind/react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Phone,
  Video,
  Search,
  MoreHorizontal,
  Smile,
  Paperclip,
  Send,
  X,
} from "lucide-react";
import logo from "../assets/logo.png";
const Messages = () => {
  const theme = useSelector((state) => state.theme.isDarkMode);
  const selectChat = useSelector((state) => state.selectChat);
  const [openRight, setOpenRight] = useState(false);
  const openDrawerRight = () => setOpenRight(true);
  const closeDrawerRight = () => setOpenRight(false);
  return (
    <div
      className={`w-[64.4vw] h-[97vh] flex flex-col rounded-xl ${
        theme ? "bg-[#131312]" : "bg-white"
      }`}
    >
      {selectChat.isChatSelected ? (
        <>
          <nav
            className={`flex justify-between items-center px-7 py-2 shadow-md ${
              theme ? "text-white shadow-gray-900" : "text-black"
            }`}
          >
            <div className="flex items-center gap-4">
              <Avatar
                src={selectChat.data.detail.profilePicture}
                size="sm"
                alt="avatar"
              />
              <div>
                <h3 className={`font-semibold text-lg`}>
                  {selectChat.data.detail.name}
                </h3>
                <p className={`font-medium text-sm`}>Online</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Phone cursor={"pointer"} />
              <Video cursor={"pointer"} />
              <Search cursor={"pointer"} />
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
          <div className="h-[80vh]"></div>
          <footer
            className={`border-t h-[10vh] flex items-center justify-center ${
              theme ? "border-gray-800" : "border-gray-300"
            } `}
          >
            <form
              action=""
              className="flex items-center justify-center gap-2 w-full"
            >
              <div
                className={`flex px-5 py-2 gap-3 rounded-lg w-[90%] ${
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
                />
              </div>
              <IconButton type="submit" className="bg-[#000000]">
                <Send />
              </IconButton>
            </form>
          </footer>
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
