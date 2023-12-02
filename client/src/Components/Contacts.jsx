import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bell, Search } from "lucide-react";
import { Avatar } from "@material-tailwind/react";
const Contacts = () => {
  const theme = useSelector((state) => state.theme.isDarkMode);
  let data = [
    {
      img: "https://docs.material-tailwind.com/img/face-2.jpg",
      name: "Pink Panda",
      time: "9.36",
      last: "jvfkibvvliveyvulibvryuewbvlivuivlbreuirbruivbreibvru",
    },
    {
      img: "https://docs.material-tailwind.com/img/face-2.jpg",
      name: "Pink Panda",
      time: "9.36",
      last: "jvfkibvvliveyvulibvryuewbvlivuivlbreuirbruivbreibvru",
    },
    {
      img: "https://docs.material-tailwind.com/img/face-2.jpg",
      name: "Pink Panda",
      time: "9.36",
      last: "jvfkibvvliveyvulibvryuewbvlivuivlbreuirbruivbreibvru",
    },
    {
      img: "https://docs.material-tailwind.com/img/face-2.jpg",
      name: "Pink Panda",
      time: "9.36",
      last: "jvfkibvvliveyvulibvryuewbvlivuivlbreuirbruivbreibvru",
    },
    {
      img: "https://docs.material-tailwind.com/img/face-2.jpg",
      name: "Pink Panda",
      time: "9.36",
      last: "jvfkibvvliveyvulibvryuewbvlivuivlbreuirbruivbreibvru",
    },
  ];
  return (
    <div
      className={`w-[28vw] h-[97vh] rounded-md py-8 px-5 ${
        theme ? "bg-[#2b2c30]" : "bg-white"
      }`}
    >
      <div
        className={`flex justify-between items-center ${
          theme ? "text-white" : "text-black"
        }`}
      >
        <h1 className="text-4xl font-bold">Chats</h1>
        <Bell />
      </div>
      <label
        htmlFor="search"
        className={`flex items-center gap-2 ${
          theme ? "bg-[#69696b] text-white" : "bg-[#f6f6f7] text-[#4c4d52]"
        }
           text-base px-2 py-1 rounded-lg mt-5 font-semibold`}
      >
        <Search strokeWidth={2} />
        <input
          type="text"
          id="search"
          placeholder="Search"
          className={`w-full bg-transparent outline-none ${
            theme ? "placeholder:text-white" : "placeholder:text-[#4c4d52]"
          }`}
        />
      </label>
      <div
        className={`h-[70vh] ${
          data.length > 5 ? "overflow-scroll" : ""
        }  overflow-x-hidden mt-7 flex flex-col gap-1`}
      >
        {data.map((item, index) => (
          <div
            key={index}
            className={`flex py-4 px-2 rounded-xl mr-2 justify-between items-start cursor-pointer ${
              theme ? "hover:bg-[#4c4d52]" : "hover:bg-[#f6f6f7]"
            }`}
          >
            <div className="flex gap-3">
              <Avatar src={item.img} alt="" />
              <div>
                <h2
                  className={`font-bold text-base	${
                    theme ? "text-white" : "text-black"
                  }`}
                >
                  {item.name}
                </h2>
                <p
                  className={`font-semibold text-sm	${
                    theme ? "text-white" : "text-[#7C7C7D]"
                  }`}
                >
                  {item.last.slice(0, 30)}
                  {item.last.length >= 30 && "..."}
                </p>
              </div>
            </div>
            <p
              className={`font-medium text-xs	${
                theme ? "text-white" : "text-[#7C7C7D]"
              }`}
            >
              {item.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contacts;
