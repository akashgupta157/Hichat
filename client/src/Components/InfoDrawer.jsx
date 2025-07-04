import axios from "axios";
import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";
import { configure, url } from "../misc";
import { useDispatch, useSelector } from "react-redux";
import { X, Pencil, Trash2, Check } from "lucide-react";
import { notSelectedChat, selectedChat } from "../Redux/SelectedChat/action";
import {
  Drawer,
  Typography,
  IconButton,
  Avatar,
  Button,
} from "@material-tailwind/react";

const InfoDrawer = ({ open, closeDrawer }) => {
  const theme = useSelector((state) => state.theme.isDarkMode);
  const selectChat = useSelector((state) => state.selectChat.data);
  console.log("selectChat", selectChat);
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
  const [isEditing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(
    selectChat.detail.chatName
  );
  const inputRef = useRef(null);
  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  const handleEditClick = () => {
    setEditing(true);
  };
  const handleSaveClick = async () => {
    if (editedContent.length >= 3) {
      setEditing(false);
      const { data } = await axios.patch(
        `${url}/chat/group/${selectChat.id}`,
        { editedContent },
        config
      );
      if (data.message == "done") {
        dispatch(
          selectedChat({
            ...selectChat,
            detail: {
              ...selectChat.detail,
              chatName: data.chatName,
            },
          })
        );
        toast.success(`group name is updated`, {
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
  const handleUndoClick = () => {
    setEditing(false);
    setEditedContent(selectChat.detail.chatName);
  };
  const handleContentChange = (e) => {
    setEditedContent(e.target.value);
  };
  const inputStyle = {
    width: `${editedContent?.length * 20}px`,
  };
  const handleDelete = async (memberId) => {
    const { data } = await axios.patch(
      `${url}/chat/remove/${selectChat.id}`,
      { memberId },
      config
    );
    if (data.message == "Member removed successfully") {
      dispatch(
        selectedChat({
          ...selectChat,
          detail: {
            ...selectChat.detail,
            members: data.members,
          },
        })
      );
      toast.success(`${data.message}`, {
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
  };
  const handleGroupDelete = async () => {
    const { data } = await axios.delete(
      `${url}/chat/delete/${selectChat.id}`,
      config
    );
    if (data.message == "Group deleted successfully") {
      dispatch(notSelectedChat());
      closeDrawer();
      toast.success(`${data.message}`, {
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
  };
  return (
    <>
      <Drawer
        placement="right"
        open={open}
        onClose={closeDrawer}
        className={`p-4 ${theme ? "bg-[#131312]" : "bg-white"}`}
      >
        <div className="flex justify-between items-center mb-6">
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
              {selectChat.detail.groupAdmin._id === you._id ? ( // admin
                <>
                  <div
                    className="block relative m-auto rounded-full w-20 md:w-48 h-20 md:h-48"
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
                      className={`${
                        theme ? "skeleton-dark" : "skeleton-light"
                      } m-auto block rounded-full w-20 md:w-48 h-20 md:h-48 object-cover`}
                    />
                    {imgHover && (
                      <label
                        htmlFor="img"
                        className="right-0 bottom-0 absolute bg-gray-600 p-2 rounded-full text-white cursor-pointer"
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
                  <div>
                    {isEditing ? (
                      <div className="flex justify-center items-center gap-2 mt-2">
                        <input
                          type="text"
                          value={editedContent}
                          onChange={handleContentChange}
                          className={`text-3xl font-medium outline-none border-0 bg-transparent`}
                          ref={inputRef}
                          style={inputStyle}
                        />
                        <button onClick={handleSaveClick}>
                          <Check />
                        </button>
                        <button onClick={handleUndoClick}>
                          <X />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center gap-2 mt-2">
                        <h1 className="font-medium text-3xl">
                          {editedContent}
                        </h1>
                        <Pencil onClick={handleEditClick} size={"20px"} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 mt-2 h-[55vh] md:h-[40vh] overflow-x-hidden overflow-y-scroll scrollbar-none">
                    {/* admin */}
                    <div
                      className={`flex justify-between items-center p-2 rounded cursor-pointer  ${
                        theme
                          ? "hover:bg-[#4c4d52] bg-[#29292a]"
                          : "hover:bg-[#b7b7b7] bg-[#dedcdc]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={selectChat.detail.groupAdmin.profilePicture}
                          className={`${
                            theme ? "skeleton-dark" : "skeleton-light"
                          }`}
                        />
                        <b className="font-medium	">You</b>
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
                            className={`flex gap-2 items-center justify-between p-2 rounded cursor-pointer  ${
                              theme
                                ? "hover:bg-[#4c4d52] bg-[#29292a]"
                                : "hover:bg-[#b7b7b7] bg-[#dedcdc]"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Avatar
                                src={e.profilePicture}
                                className={`${
                                  theme ? "skeleton-dark" : "skeleton-light"
                                }`}
                              />
                              <div className="flex flex-col items-start">
                                <b className="font-medium	">{e.name}</b>
                                <small>{e.email}</small>
                              </div>
                            </div>
                            <Trash2 onClick={() => handleDelete(e._id)} />
                          </div>
                        );
                      }
                    })}
                  </div>
                  <Button
                    className="flex items-center gap-2 bg-red-800 m-auto mt-4 text-sm"
                    onClick={handleGroupDelete}
                  >
                    <Trash2 />
                    Delete Group
                  </Button>
                </>
              ) : (
                <div className="text-center">
                  <img
                    src={selectChat.detail.groupPicture}
                    loading="lazy"
                    className={`${
                      theme ? "skeleton-dark" : "skeleton-light"
                    } m-auto block rounded-full w-20 md:w-48 h-20 md:h-48 object-cover`}
                  />
                  <h1 className="font-medium text-3xl">
                    {selectChat.detail.chatName}
                  </h1>
                  <div className="flex flex-col gap-1 mt-2 max-h-[55vh] md:max-h-[45vh] overflow-x-hidden overflow-y-scroll scrollbar-none">
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
                          className={`${
                            theme ? "skeleton-dark" : "skeleton-light"
                          }`}
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
                            <Avatar
                              src={e.profilePicture}
                              className={`${
                                theme ? "skeleton-dark" : "skeleton-light"
                              }`}
                            />
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
                      <Avatar
                        src={you.profilePicture}
                        className={`${
                          theme ? "skeleton-dark" : "skeleton-light"
                        }`}
                      />
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
                className={`${
                  theme ? "skeleton-dark" : "skeleton-light"
                } m-auto block rounded-full w-48 md:w-50`}
              />
              <h1 className="mt-4 font-medium text-3xl">
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
