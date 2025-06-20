import axios from "axios";
import { useState } from "react";
import { url } from "../../misc";
import MultiSelect from "../MultiSelect";
import { selectedChat } from "../../Redux/SelectedChat/action";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Avatar } from "@material-tailwind/react";

const GroupCreationDialog = ({ open, handleOpen, theme, setChatList, dispatch, config }) => {
  const [image, setImage] = useState(
    "https://i.ibb.co/0hvhdRK/240-F-686603587-bo-Vdde3-U00-AMRWSVIMnz3-Gu-UBAouyued0.jpg"
  );
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [imgUrl, setImgUrl] = useState(
    "https://i.ibb.co/0hvhdRK/240-F-686603587-bo-Vdde3-U00-AMRWSVIMnz3-Gu-UBAouyued0.jpg"
  );

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
      const { data } = await axios.post(`${url}/file/upload`, Data);
      setImgUrl(data.imageUrl);
    }
  };

  const createGroup = async () => {
    if (groupName?.length === 0) {
      alert("Please Enter Group Name");
      return;
    }
    
    if (selectedMembers.length < 2) {
      alert("Minimum 2 members required!");
      return;
    }

    try {
      const { data } = await axios.post(
        `${url}/chat/group`,
        {
          name: groupName,
          members: selectedMembers,
          groupPicture: imgUrl,
        },
        config
      );

      dispatch(
        selectedChat({
          id: data.wholeGroupChat._id,
          detail: data.wholeGroupChat,
          isChatGroup: true,
        })
      );

      setChatList((prev) => [data.wholeGroupChat, ...prev]);
      handleOpen();
      setGroupName("");
      setSelectedMembers([]);
      setImage("https://i.ibb.co/0hvhdRK/240-F-686603587-bo-Vdde3-U00-AMRWSVIMnz3-Gu-UBAouyued0.jpg");
      setImgUrl("https://i.ibb.co/0hvhdRK/240-F-686603587-bo-Vdde3-U00-AMRWSVIMnz3-Gu-UBAouyued0.jpg");
    } catch (error) {
      console.error("Error creating group:", error);
      alert(`${error.message}`);
    }
  };

  return (
    <Dialog
      open={open}
      size="sm"
      handler={handleOpen}
      className={`border ${theme ? "bg-[#131312]" : ""}`}
    >
      <DialogHeader className={`${theme ? "text-white" : ""}`}>
        Create Group
      </DialogHeader>
      <DialogBody className="flex flex-col gap-3.5">
        <div className="flex md:flex-row flex-col justify-start md:items-center gap-4">
          <label htmlFor="file" className="cursor-pointer">
            <Avatar size="lg" src={image} />
          </label>
          <input
            type="file"
            className="hidden"
            id="file"
            onChange={handleImageChange}
            accept="image/*"
          />
          <input
            type="text"
            className={`border p-2 rounded-md w-full md:w-[85%] ${
              theme
                ? "text-white placeholder:text-gray-400"
                : "border-gray-900 text-black placeholder:text-gray-600"
            } bg-transparent`}
            placeholder="Enter Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>
        <MultiSelect onMembersSelect={(members) => setSelectedMembers(members)} />
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={handleOpen}
          className="mr-1"
        >
          <span>Cancel</span>
        </Button>
        <Button variant="gradient" color="green" onClick={createGroup}>
          <span>Create Group</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default GroupCreationDialog;