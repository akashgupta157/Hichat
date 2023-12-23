import React from "react";
import { useSelector } from "react-redux";
const AvataR = ({ src, w, h, isOnline }) => {
  const theme = useSelector((state) => state.theme.isDarkMode);
  return (
    <>
      <div className="relative">
        <img
          className={`w-${w} h-${h} rounded-full ${
            theme ? "skeleton-dark" : "skeleton-light"
          }`}
          src={src}
          alt=""
        />
        <span
          className={`bottom-0 left-9 absolute w-3.5 h-3.5 ${
            isOnline ? "bg-green-500" : "bg-red-500"
          }  border-2 dark:border-gray-800 rounded-full`}
        ></span>
      </div>
    </>
  );
};

export default AvataR;
