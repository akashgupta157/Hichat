import { Button } from "@material-tailwind/react";
import React, { useState, useRef } from "react";
const ProfilePicture = () => {
  let img =
    "https://t3.ftcdn.net/jpg/05/53/79/60/360_F_553796090_XHrE6R9jwmBJUMo9HKl41hyHJ5gqt9oz.jpg";
  const [image, setImage] = useState(img);
  const isDeleteDisabled = image === img;
  const fileInputRef = useRef(null);
  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(selectedImage)
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
            style={{ display: "none" }}
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
      </div>
    </div>
  );
};
export default ProfilePicture;
