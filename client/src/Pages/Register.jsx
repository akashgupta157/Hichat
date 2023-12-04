import { Button, IconButton } from "@material-tailwind/react";
import {
  AtSign,
  AlertCircle,
  LockKeyhole,
  Loader2,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import googleLogo from "../assets/google-logo.png";
import axios from "axios";
import { url } from "../Components/url";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";
import { login } from "../Redux/Auth/action";
const Register = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (Data) => {
    setLoading(true);
    const { data } = await axios.post(`${url}/auth/register`, Data);
    if (data.auth) {
      toast.success("Sign up successful", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
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
    setLoading(false);
  };
  const handleGoogle = useGoogleLogin({ onSuccess: handleGoogleLoginSuccess });
  async function handleGoogleLoginSuccess(tokenResponse) {
    const accessToken = tokenResponse.access_token;
    const { data } = await axios.post(`${url}/auth/google/login`, {
      googleAccessToken: accessToken,
    });
    dispatch(login({ ...data.user, token: data.token }));
    sessionStorage.setItem(
      "user",
      JSON.stringify({ ...data.user, token: data.token })
    );
    navigate("/chats");
  }
  return (
    <>
      <div className="text-[#0d0c22] m-auto w-full px-5 mt-10 md:w-[400px] md:shadow-xl md:py-5 md:rounded md:mt-5">
        <h1 className="text-2xl	font-bold	mb-[30px]">Sign up to Hichat</h1>
        <Button
          variant="outlined"
          className="flex justify-center items-center gap-4 rounded-full w-full border-gray-400 py-[16px]"
          onClick={() => handleGoogle()}
        >
          <img src={googleLogo} alt="" className="w-[16px]" />
          <p className="text-sm font-semibold capitalize">
            Sign up with Google
          </p>
        </Button>
        <div className="flex justify-center items-center w-full my-5">
          <hr className="w-full h-[3px] bg-gray-400 border dark:bg-gray-700" />
          <p className="w-[500px] text-center text-gray-500 text-sm">
            or sign up with email
          </p>
          <hr className="w-full h-[3px] bg-gray-400 border dark:bg-gray-700" />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className="flex flex-col gap-2 mb-3">
            <fieldset className="flex flex-col gap-2">
              <label className="font-semibold" htmlFor="email">
                Name:
              </label>
              <div className="flex items-center gap-1 border rounded-md px-2 py-3 pl-5 transition duration-300 ease-in-out focus-within:border-black focus-within:border-2 focus-within:text-[#0d0c22] border-gray-400 text-gray-600">
                <input
                  autoCapitalize="off"
                  autoCorrect="off"
                  className="outline-0 w-full text-[#0d0c22]"
                  type="text"
                  id="email"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name should be at least 2 characters",
                    },
                    maxLength: {
                      value: 50,
                      message: "Name should not exceed 50 characters",
                    },
                  })}
                />
                <User />
              </div>
            </fieldset>
            {errors.name && (
              <p className="flex gap-2 items-center text-red-700 font-medium">
                <AlertCircle />
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 mb-3">
            <fieldset className="flex flex-col gap-2">
              <label className="font-semibold" htmlFor="email">
                Email:
              </label>
              <div className="flex items-center gap-1 border rounded-md px-2 py-3 pl-5 transition duration-300 ease-in-out focus-within:border-black focus-within:border-2 focus-within:text-[#0d0c22] border-gray-400 text-gray-600">
                <input
                  autoCapitalize="off"
                  autoCorrect="off"
                  className="outline-0 w-full text-[#0d0c22]"
                  type="text"
                  id="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                <AtSign />
              </div>
            </fieldset>
            {errors.email && (
              <p className="flex gap-2 items-center text-red-700 font-medium">
                <AlertCircle />
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1 mb-5">
            <fieldset className="flex flex-col">
              <label
                className="font-semibold flex justify-between items-center"
                htmlFor="password"
              >
                <p>Password:</p>
                <IconButton variant="text" onClick={togglePasswordVisibility}>
                  {showPassword ? <Eye /> : <EyeOff />}
                </IconButton>
              </label>
              <div className="flex items-center gap-1 border rounded-md px-2 py-3 pl-5 transition duration-300 ease-in-out focus-within:border-black focus-within:border-2 focus-within:text-[#0d0c22] border-gray-400 text-gray-600">
                <input
                  autoCapitalize="off"
                  autoCorrect="off"
                  className="outline-0 w-full text-[#0d0c22]"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                    maxLength: {
                      value: 10,
                      message: "Password must not exceed 10 characters",
                    },
                  })}
                />
                <LockKeyhole />
              </div>
            </fieldset>
            {errors.password && (
              <p className="flex gap-2 items-center text-red-700 font-medium">
                <AlertCircle />
                {errors.password.message}
              </p>
            )}
          </div>
          {loading ? (
            <Button className="w-full rounded-full py-[16px] text-sm capitalize ">
              <Loader2 className="m-auto animate-spin" />
            </Button>
          ) : (
            <Button
              className="w-full rounded-full py-[16px] text-sm capitalize"
              type="submit"
            >
              Sign in
            </Button>
          )}
        </form>
        <p className="w-full text-right mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link className="underline" to={"/"}>
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
};

export default Register;
