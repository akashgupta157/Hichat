import React from "react";

const AvataR = ({ src, w, h, isOnline }) => {
  return (
    <>
      <div className="relative">
        <img className={`w-${w} h-${h} rounded-full`} src={src} alt="" />
        <span
          className={`bottom-0 left-9 absolute  w-3.5 h-3.5 ${
            isOnline ? "bg-green-500" : "bg-red-500"
          }  border-2 dark:border-gray-800 rounded-full`}
        ></span>
      </div>
    </>
  );
};

export default AvataR;
