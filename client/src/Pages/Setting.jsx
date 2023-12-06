import { Button } from "@material-tailwind/react";
import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../Redux/Auth/action";
const Setting = () => {
  const dispatch = useDispatch();
  return (
    <div>
      <Button
        onClick={() => {
          dispatch(logout());
          sessionStorage.clear();
        }}
      >
        Logout
      </Button>
    </div>
  );
};

export default Setting;
