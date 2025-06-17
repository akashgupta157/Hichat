import axios from "axios";
import { url } from "../misc";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { login } from "../Redux/Auth/action";
import googleLogo from "../assets/google-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { setPageLoad } from "../Redux/PageLoad/action";
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
      sessionStorage.setItem(
        "user",
        JSON.stringify({ ...data.user, token: data.token })
      );
      dispatch(login({ ...data.user, token: data.token }));
      setTimeout(() => {
        navigate(`/profilePicture/${data.user._id}`);
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
    dispatch(setPageLoad(true));
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
  }
  return (
    <>
      <div className="sm:shadow-xl m-auto mt-10 sm:mt-5 px-5 sm:py-5 sm:rounded w-full sm:w-[400px] text-[#0d0c22]">
        <h1 className="text-2xl	font-bold	mb-[30px]">Sign up to Hichat</h1>
        <Button
          variant="outlined"
          className="flex justify-center items-center gap-4 py-[16px] border-gray-400 rounded-full w-full"
          onClick={() => handleGoogle()}
        >
          <img src={googleLogo} alt="" className="w-[16px]" />
          <p className="font-semibold text-sm capitalize">
            Sign up with Google
          </p>
        </Button>
        <div className="flex justify-center items-center my-5 w-full">
          <hr className="bg-gray-400 dark:bg-gray-700 border w-full h-[3px]" />
          <p className="w-[500px] text-gray-500 text-sm text-center">
            or sign up with email
          </p>
          <hr className="bg-gray-400 dark:bg-gray-700 border w-full h-[3px]" />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className="flex flex-col gap-2 mb-3">
            <fieldset className="flex flex-col gap-2">
              <label className="font-semibold" htmlFor="email">
                Name:
              </label>
              <div className="flex items-center gap-1 px-2 py-3 pl-5 border border-gray-400 focus-within:border-2 focus-within:border-black rounded-md text-gray-600 focus-within:text-[#0d0c22] transition duration-300 ease-in-out">
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
              <p className="flex items-center gap-2 font-medium text-red-700">
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
              <div className="flex items-center gap-1 px-2 py-3 pl-5 border border-gray-400 focus-within:border-2 focus-within:border-black rounded-md text-gray-600 focus-within:text-[#0d0c22] transition duration-300 ease-in-out">
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
              <p className="flex items-center gap-2 font-medium text-red-700">
                <AlertCircle />
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1 mb-5">
            <fieldset className="flex flex-col">
              <label
                className="flex justify-between items-center font-semibold"
                htmlFor="password"
              >
                <p>Password:</p>
                <IconButton variant="text" onClick={togglePasswordVisibility}>
                  {showPassword ? <Eye /> : <EyeOff />}
                </IconButton>
              </label>
              <div className="flex items-center gap-1 px-2 py-3 pl-5 border border-gray-400 focus-within:border-2 focus-within:border-black rounded-md text-gray-600 focus-within:text-[#0d0c22] transition duration-300 ease-in-out">
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
              <p className="flex items-center gap-2 font-medium text-red-700">
                <AlertCircle />
                {errors.password.message}
              </p>
            )}
          </div>
          {loading ? (
            <Button className="py-[16px] rounded-full w-full text-sm capitalize">
              <Loader2 className="m-auto animate-spin" />
            </Button>
          ) : (
            <Button
              className="py-[16px] rounded-full w-full text-sm capitalize"
              type="submit"
            >
              Sign in
            </Button>
          )}
        </form>
        <p className="mt-4 w-full text-gray-600 text-sm text-right">
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
