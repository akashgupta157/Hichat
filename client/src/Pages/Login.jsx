import { Button, IconButton } from "@material-tailwind/react";
import {
  AtSign,
  AlertCircle,
  LockKeyhole,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import googleLogo from "../assets/google-logo.png";
import axios from "axios";
import { url } from "../Components/misc";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { login } from "../Redux/Auth/action";
import { setPageLoad } from "../Redux/PageLoad/action";
export default function Login() {
  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get(`${url}/auth`);
      console.log(data);
    }
    fetchData();
  }, []);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (Data) => {
    setLoading(true);
    const { data } = await axios.post(`${url}/auth/login`, Data);
    if (data.auth) {
      toast.success("Sign in successful", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      sessionStorage.setItem(
        "user",
        JSON.stringify({ ...data.user, token: data.token })
      );
      dispatch(login({ ...data.user, token: data.token }));
      setTimeout(() => {
        navigate("/chats");
      }, 1000);
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
    dispatch(setPageLoad(true));
    try {
      const accessToken = tokenResponse.access_token;
      const { data } = await axios.post(`${url}/auth/google/login`, {
        googleAccessToken: accessToken,
      });
      dispatch(login({ ...data.user, token: data.token }));
      sessionStorage.setItem(
        "user",
        JSON.stringify({ ...data.user, token: data.token })
      );
      dispatch(setPageLoad(false));
      navigate("/chats");
    } catch (error) {
      dispatch(setPageLoad(false));
      toast.error(`${error.message}`, {
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
  return (
    <>
      <div className="text-[#0d0c22] m-auto w-full px-5 mt-14 sm:w-[400px] sm:shadow-xl sm:py-5 sm:rounded sm:mt-10">
        <h1 className="text-2xl	font-bold	mb-[40px]">Sign in to Hichat</h1>
        <Button
          variant="outlined"
          className="flex justify-center items-center gap-4 rounded-full w-full border-gray-400 py-[16px]"
          onClick={() => handleGoogle()}
        >
          <img src={googleLogo} alt="" className="w-[16px]" />
          <p className="text-sm font-semibold capitalize">
            Sign in with Google
          </p>
        </Button>
        <div className="flex justify-center items-center w-full my-5">
          <hr className="w-full h-[3px] bg-gray-400 border dark:bg-gray-700" />
          <p className="w-[500px] text-center text-gray-500 text-sm">
            or sign in with email
          </p>
          <hr className="w-full h-[3px] bg-gray-400 border dark:bg-gray-700" />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2 mb-4">
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
          <div className="flex flex-col gap-1 mb-8">
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
          Don't have an account?{" "}
          <Link className="underline" to={"/register"}>
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
}
