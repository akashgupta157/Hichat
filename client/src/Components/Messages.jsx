import React from "react";
import { useDispatch, useSelector } from "react-redux";
const Messages = () => {
  const theme = useSelector((state) => state.theme.isDarkMode);
  return (
    <div
      className={`w-[64.4vw] h-[97vh] rounded-md ${
        theme ? "bg-[#2b2c30]" : "bg-white"
      }`}
    ></div>
  );
};

export default Messages;
