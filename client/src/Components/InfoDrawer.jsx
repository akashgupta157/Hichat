import React from "react";
import { Drawer, Typography, IconButton } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
const InfoDrawer = ({ open, closeDrawer }) => {
  const theme = useSelector((state) => state.theme.isDarkMode);
  const selectChat = useSelector((state) => state.selectChat.data);
  const you = useSelector((state) => state.auth.user);
  console.log(selectChat);
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
            {selectChat.detail.isChatGroup ? "Group Info" : "Contact Info"}
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
          {selectChat.detail.isChatGroup ? (
            "Group Info"
          ) : (
            <div className="text-center">
              <img
                src={selectChat.detail.profilePicture}
                loading="lazy"
                className={`${
                  theme ? "skeleton-dark" : "skeleton-light"
                } m-auto block rounded-full w-48 md:w-64`}
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
