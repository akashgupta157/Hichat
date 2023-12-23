import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { configure, url } from "./misc";
import { useSelector } from "react-redux";
import { X } from "lucide-react";
import { Avatar } from "@material-tailwind/react";
const MultiSelect = ({ onMembersSelect }) => {
  const theme = useSelector((state) => state.theme.isDarkMode);
  const you = useSelector((state) => state.auth.user);
  const config = configure(you.token);
  const [groupSearch, setGroupSearch] = useState("");
  const [groupSearchResults, setGroupSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const inputRef = useRef();
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data } = await axios.get(
          `${url}/auth/search?search=${groupSearch}`,
          config
        );
        setGroupSearchResults(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const debounceTimer = setTimeout(() => {
      if (groupSearch.length > 0) {
        fetchResults();
      } else {
        setGroupSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [groupSearch]);
  const handleSelect = (member) => {
    if (!selectedMembers.some((selected) => selected._id === member._id)) {
      setSelectedMembers((prevMembers) => [...prevMembers, member]);
      setGroupSearch("");
    } else {
      setGroupSearch("");
    }
  };
  const handleRemove = (memberId) => {
    setSelectedMembers((prevMembers) =>
      prevMembers.filter((member) => member._id !== memberId)
    );
  };
  useEffect(() => {
    onMembersSelect(selectedMembers.map((member) => member._id));
  }, [selectedMembers]);
  return (
    <div>
      <div
        className={`border flex flex-wrap items-center rounded-md gap-2 p-2 ${
          theme ? "text-white" : "border-gray-900 text-black"
        }`}
        onClick={() => inputRef.current.focus()}
      >
        <div className="flex gap-2 items-center">
          {selectedMembers.map((member) => (
            <div
              key={member._id}
              className={`flex text-sm items-center p-1 pl-2 gap-1.5 rounded-md ${
                theme ? "bg-black" : "bg-gray-400"
              }`}
            >
              <p>{member.name}</p>
              <button onClick={() => handleRemove(member._id)}>
                <X size={"15px"} className="hover:text-red-500" />
              </button>
            </div>
          ))}
        </div>
        <input
          type="text"
          ref={inputRef}
          placeholder="Search for group members"
          value={groupSearch}
          onChange={(e) => setGroupSearch(e.target.value)}
          className={`bg-transparent border-0 outline-none ${
            theme ? " placeholder:text-gray-400" : " placeholder:text-gray-600"
          }`}
        />
      </div>
      <div className="relative flex justify-center z-10">
        {groupSearchResults.length > 0 && (
          <div
            className={`absolute border w-[80%] mt-2 rounded-md py-3 px-5 flex flex-col gap-3 ${
              theme ? "bg-black" : "bg-gray-100"
            }`}
          >
            {groupSearchResults.map((member) => (
              <div
                key={member._id}
                className={`flex gap-2 items-center px-3 rounded-md ${
                  theme
                    ? "text-white hover:bg-gray-900"
                    : "hover:bg-white text-black"
                }`}
                onClick={() => handleSelect(member)}
              >
                <Avatar
                  className={`${theme ? "skeleton-dark" : "skeleton-light"}`}
                  size="sm"
                  src={member.profilePicture}
                  alt="Profile"
                />
                <div>
                  <p>{member.name}</p>
                  <small>{member.email}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
