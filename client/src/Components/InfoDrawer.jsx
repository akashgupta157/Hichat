import React, { useState, useRef, useEffect } from "react";
import {
  Drawer,
  Typography,
  IconButton,
  Avatar,
} from "@material-tailwind/react";
import { configure, url } from "../Components/misc";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { X, Pencil, Check } from "lucide-react";
import { toast } from "react-toastify";
import { selectedChat } from "../Redux/SelectedChat/action";
const InfoDrawer = ({ open, closeDrawer }) => {
  const theme = useSelector((state) => state.theme.isDarkMode);
  const selectChat = useSelector((state) => state.selectChat.data);
  const you = useSelector((state) => state.auth.user);
  const [image, setImage] = useState(selectChat.detail.groupPicture);
  const [imgHover, setImgHover] = useState(false);
  const config = configure(you.token);
  const dispatch = useDispatch();
  // group image change
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
      const { data } = await axios.patch(
        `${url}/chat/group/${selectChat.id}`,
        Data,
        config
      );
      if (data.message == "done") {
        dispatch(
          selectedChat({
            ...selectChat,
            detail: {
              ...selectChat.detail,
              groupPicture: data.imageUrl,
            },
          })
        );
        toast.success(`group picture is updated`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.error(`${data.message}`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    }
  };
  // group name change

  return (
    <>
      <Drawer
        placement="right"
        open={open}
        onClose={closeDrawer}
        className={`p-4 ${theme ? "bg-[#131312]" : "bg-white"}`}
      >
        <div className="mb-6 flex items-center justify-between">
          <Typography variant="h5">
            {selectChat.isChatGroup ? "Group Info" : "Contact Info"}
          </Typography>
          <IconButton
            variant="text"
            onClick={closeDrawer}
            className={`${theme ? "text-white" : "text-black"}`}
          >
            <X />
          </IconButton>
        </div>
        <Typography>
          {selectChat.isChatGroup ? ( // ? for group
            <>
              {selectChat.detail.groupAdmin._id === you._id ? (
                <>
                  <div
                    className="relative m-auto block rounded-full w-20 md:w-48 h-20 md:h-48"
                    onMouseEnter={() => {
                      setImgHover(true);
                    }}
                    onMouseLeave={() => {
                      setImgHover(false);
                    }}
                  >
                    <img
                      src={image}
                      alt=""
                      className="m-auto block rounded-full w-20 md:w-48 h-20 md:h-48 object-cover"
                    />
                    {imgHover && (
                      <label
                        htmlFor="img"
                        className="absolute bottom-0 right-0 p-2 rounded-full bg-gray-600 text-white cursor-pointer"
                      >
                        <Pencil />
                        <input
                          type="file"
                          className="hidden"
                          id="img"
                          onChange={handleImageChange}
                          accept="image/*"
                        />
                      </label>
                    )}
                  </div>
                 
                </>
              ) : (
                <div className="text-center">
                  <img
                    src={selectChat.detail.groupPicture}
                    loading="lazy"
                    className="m-auto block rounded-full w-20 md:w-48 h-20 md:h-48 object-cover"
                  />
                  <h1 className="text-3xl font-medium">
                    {selectChat.detail.chatName}
                  </h1>
                  <div className="mt-2 flex flex-col gap-1 max-h-[55vh] md:max-h-[45vh] overflow-y-scroll overflow-x-hidden">
                    {/* admin */}
                    <div
                      className={`flex justify-between items-center p-2 rounded cursor-pointer  ${
                        theme
                          ? "hover:bg-[#4c4d52] bg-[#29292a]"
                          : "hover:bg-[#b7b7b7] bg-[#dedcdc]"
                      }`}
                    >
                      <div className="flex gap-2">
                        <Avatar
                          src={selectChat.detail.groupAdmin.profilePicture}
                        />
                        <div className="flex flex-col items-start">
                          <b className="font-medium	">
                            {selectChat.detail.groupAdmin.name}
                          </b>
                          <small>{selectChat.detail.groupAdmin.email}</small>
                        </div>
                      </div>
                      <span className={`font-semibold`}>Admin</span>
                    </div>
                    {/* admin */}
                    {selectChat.detail.members.map((e) => {
                      if (
                        e._id !== selectChat.detail.groupAdmin._id &&
                        e._id !== you._id
                      ) {
                        return (
                          <div
                            key={e._id}
                            className={`flex gap-2 items-center p-2 rounded cursor-pointer  ${
                              theme
                                ? "hover:bg-[#4c4d52] bg-[#29292a]"
                                : "hover:bg-[#b7b7b7] bg-[#dedcdc]"
                            }`}
                          >
                            <Avatar src={e.profilePicture} />
                            <div className="flex flex-col items-start">
                              <b className="font-medium	">{e.name}</b>
                              <small>{e.email}</small>
                            </div>
                          </div>
                        );
                      }
                    })}
                    {/* you */}
                    <div
                      className={`flex gap-2 items-center p-2 rounded cursor-pointer  ${
                        theme
                          ? "hover:bg-[#4c4d52] bg-[#29292a]"
                          : "hover:bg-[#b7b7b7] bg-[#dedcdc]"
                      }`}
                    >
                      <Avatar src={you.profilePicture} />
                      <b className="font-medium">You</b>
                    </div>
                    {/* you */}
                  </div>
                </div>
              )}
            </>
          ) : (
            // ? for individual
            <div className="text-center">
              <img
                src={selectChat.detail.profilePicture}
                loading="lazy"
                className={`${
                  theme ? "skeleton-dark" : "skeleton-light"
                } m-auto block rounded-full w-48 md:w-50`}
              />
              <h1 className="mt-4 text-3xl font-medium">
                {selectChat.detail.name}
              </h1>
              <a href={`mailto:${selectChat.detail.email}`}>
                {selectChat.detail.email}
              </a>
            </div>
          )}
        </Typography>
      </Drawer>
    </>
  );
};

export default InfoDrawer;
