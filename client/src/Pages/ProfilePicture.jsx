import axios from "axios";
import { url } from "../misc";
import { toast } from "react-toastify";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { login } from "../Redux/Auth/action";
import { Button } from "@material-tailwind/react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
      <div className="sm:shadow-xl sm:mt-5 px-5 sm:py-5 sm:rounded w-full sm:w-[400px] text-[#0d0c22]">
        <h1 className="mb-[30px] font-bold text-2xl">
          Select your Profile Picture
        </h1>
        <img
          src={image}
          className="m-auto border rounded-full w-[200px] h-[200px]"
        />
        <div className="flex justify-center gap-10 pt-5">
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
