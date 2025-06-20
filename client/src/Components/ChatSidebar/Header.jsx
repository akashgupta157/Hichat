import { logout } from "../../Redux/Auth/action";
import { notSelectedChat } from "../../Redux/SelectedChat/action";
import { ChevronDown, UsersRound, LogOut, Sun, Moon } from "lucide-react";
import {
  Avatar,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";

const Header = ({ theme, you, toggleDialog, dispatch, toggleTheme }) => {
  return (
    <div
      className={`flex justify-between items-center ${
        theme ? "text-white" : "text-black"
      }`}
    >
      <h1 className="font-semibold text-3xl">Chats</h1>
      <div className="flex items-center gap-3">
        <Avatar
          src={you.profilePicture}
          className={`${theme ? "skeleton-dark" : "skeleton-light"}`}
        />
        <Menu>
          <MenuHandler>
            <ChevronDown className="cursor-pointer" />
          </MenuHandler>
          <MenuList className={`${theme ? "bg-[#131312] text-gray-400" : ""}`}>
            <MenuItem
              className="flex items-center gap-2"
              onClick={toggleDialog}
            >
              <UsersRound />
              <p className="text-lg">Create Group</p>
            </MenuItem>
            <MenuItem className="flex items-center gap-2" onClick={toggleTheme}>
              {theme ? <Sun /> : <Moon />}
              <p className="text-lg">{theme ? "Light Mode" : "Dark Mode"}</p>
            </MenuItem>
            <MenuItem
              className="flex items-center gap-2"
              onClick={() => {
                sessionStorage.clear();
                dispatch(logout());
                dispatch(notSelectedChat());
              }}
            >
              <LogOut />
              <p className="text-lg">Sign out</p>
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
    </div>
  );
};

export default Header;
