import React, { useEffect, useState } from "react";
import { MessageCircle, Phone, SunMedium, Moon, Settings } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../Redux/Theme/action";
import { Avatar } from "@material-tailwind/react";
import logo from "../assets/logo.png";
const Menu = () => {
  const theme = useSelector((state) => state.theme.isDarkMode);
  const user = useSelector((state) => state.auth.user);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 768);
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [path, setPath] = useState();
  useEffect(() => {
    setPath(pathname);
  }, [pathname]);
  const style = {
    borderRadius: "5px",
    width: "35px",
    height: "35px",
    padding: "5px",
    backgroundColor: theme ? "#232222" : "#c6c7c9",
    color: theme ? "white" : "black",
  };
  return (
    <>
      {isLargeScreen ? (
        <>
          <div
            className={`w-[6vw] h-[100vh] flex flex-col justify-between py-5 ${
              theme ? "bg-[#010001]" : "bg-[#f6f6f7]"
            }`}
          >
            <div className="flex flex-col items-center gap-6">
              <img src={logo} alt="" className="w-10" />
              <Link to={"/chats"}>
                {path == "/chats" ? (
                  <MessageCircle style={{ ...style, color: "white" }} />
                ) : (
                  <MessageCircle
                    style={{
                      ...style,
                      backgroundColor: "transparent",
                    }}
                  />
                )}
              </Link>
              <Link to={"/calls"}>
                {path == "/calls" ? (
                  <Phone style={{ ...style, color: "white" }} />
                ) : (
                  <Phone
                    style={{
                      ...style,
                      backgroundColor: "transparent",
                    }}
                  />
                )}
              </Link>
            </div>
            <div className="flex flex-col items-center gap-6">
              <button
                className={`w-12 h-6 rounded-2xl border border-g flex items-center transition duration-300 focus:outline-none shadow ${
                  theme ? "bg-[#262b2f]" : "bg-[#c6c7c9]"
                }`}
                onClick={() => dispatch(toggleTheme())}
              >
                <div
                  className={`w-5 h-5 relative rounded-full transition duration-500 transform ${
                    theme
                      ? "bg-[#010100] translate-x-6"
                      : "bg-white translate-x-1"
                  } p-0.5`}
                >
                  {theme ? (
                    <Moon color="white" size={"16px"} />
                  ) : (
                    <SunMedium color="black" size={"16px"} />
                  )}
                </div>
              </button>
              <Link to={"/setting"}>
                {path == "/setting" ? (
                  <Settings style={{ ...style, color: "white" }} />
                ) : (
                  <Settings
                    style={{
                      ...style,
                      backgroundColor: "transparent",
                    }}
                  />
                )}
              </Link>
              <Avatar
                src={user?.profilePicture}
                size="md"
                alt="avatar"
                className="p-0.5"
                color={`${theme ? "white" : "black"}`}
              />
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Menu;
