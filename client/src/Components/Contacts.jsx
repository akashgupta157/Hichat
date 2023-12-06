import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bell, Search, Loader2 } from "lucide-react";
import { Avatar } from "@material-tailwind/react";
import { configure, url } from "./misc";
import axios from "axios";
const Contacts = () => {
  const theme = useSelector((state) => state.theme.isDarkMode);
  const token = useSelector((state) => state.auth.user.token);
  const config = configure(token);
  const [search, setSearch] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${url}/auth/search?search=${search}`,
          config
        );
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    const debounceTimer = setTimeout(() => {
      if (search.length > 0) {
        fetchResults();
      } else if (search.length == 0) {
        setSearchResults([]);
      }
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [search]);
  console.log(searchResults);
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
      className={`w-[28vw] h-[97vh] rounded-xl py-8 px-5 ${
        theme ? "bg-[#131312]" : "bg-white"
      }`}
    >
      <div
        className={`flex justify-between items-center ${
          theme ? "text-white" : "text-black"
        }`}
      >
        <h1 className="text-3xl font-semibold">Chats</h1>
        <Bell />
      </div>
      <label
        htmlFor="search"
        className={`flex items-center gap-2 ${
          theme ? "bg-[#252425] text-white" : "bg-[#f6f6f7] text-[#4c4d52]"
        }
           text-base p-2 rounded-lg mt-5 font-semibold`}
      >
        {loading ? (
          <Loader2 strokeWidth={2} className="animate-spin" />
        ) : (
          <Search strokeWidth={2} />
        )}
        <input
          type="text"
          id="search"
          placeholder="Search"
          autoComplete="off"
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
            No Results found.
          </div>
        ) : null}
      </div>
      <div
        className={`h-[70vh] ${
          data.length > 5 ? "overflow-scroll" : ""
        }  overflow-x-hidden mt-7 flex flex-col gap-1`}
      >
        {data.map((item, index) => (
          <div
            key={index}
            className={`flex py-4 px-2 rounded-xl  justify-between items-start cursor-pointer ${
              data.length > 5 ? "mr-2" : ""
            } ${theme ? "hover:bg-[#4c4d52]" : "hover:bg-[#d6d6d7]"}`}
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
                  className={`font-medium text-sm	${
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
