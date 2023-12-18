import { Button } from "@material-tailwind/react";
import React, { useState, useRef } from "react";
import { url } from "../Components/misc";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useParams, Link, useNavigate } from "react-router-dom";
import { login } from "../Redux/Auth/action";
const ProfilePicture = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let img =
    "https://t3.ftcdn.net/jpg/05/53/79/60/360_F_553796090_XHrE6R9jwmBJUMo9HKl41hyHJ5gqt9oz.jpg";
  const [image, setImage] = useState(img);
  const isDeleteDisabled = image === img;
  const fileInputRef = useRef(null);
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
        `${url}/auth/updateProfile/${id}`,
        Data
      );
      if (data.message == "done") {
        sessionStorage.getItem(
          "user",
          JSON.stringify({ ...user, profilePicture: data.imageUrl })
        );
        dispatch(login({ ...user, profilePicture: data.imageUrl }));
        navigate("/chats");
      } else {
        toast.error(`${data.message}`, {
          position: "top-right",
          autoClose: 2000,
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
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  return (
    <div className="flex justify-center items-center w-full h-[80vh]">
      <div className="text-[#0d0c22] w-full px-5 sm:w-[400px] sm:shadow-xl sm:py-5 sm:rounded sm:mt-5">
        <h1 className="text-2xl font-bold mb-[30px]">
          Select your Profile Picture
        </h1>
        <img
          src={image}
          className="w-[200px] h-[200px] m-auto rounded-full border"
        />
        <div className="flex justify-center pt-5 gap-10">
          <Button onClick={handleButtonClick}>Change</Button>
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
          />
          <Button
            variant="outlined"
            disabled={isDeleteDisabled}
            onClick={() => setImage(img)}
          >
            Delete
          </Button>
        </div>
        <button className="float-right mt-5">
          <Link to={"/chats"}>Skip</Link>
        </button>
      </div>
    </div>
  );
};
export default ProfilePicture;
