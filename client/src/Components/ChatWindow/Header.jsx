import InfoDrawer from "../InfoDrawer";
import { Avatar } from "@material-tailwind/react";
import { notSelectedChat } from "../../Redux/SelectedChat/action";
import { Phone, Video, MoreHorizontal, ArrowLeft } from "lucide-react";

const Header = ({
  selectChat,
  theme,
  isUserOnline,
  openDrawer,
  closeDrawer,
  open,
  dispatch,
  you
}) => {
  return (
    <nav
      className={`flex justify-between items-center px-3 md:px-7 h-[9%] md:h-[10%] shadow-md ${
        theme ? "text-white shadow-gray-900" : "text-black"
      }`}
    >
      <div className="flex items-center gap-2 md:gap-4">
        <ArrowLeft
          className="lg:hidden"
          onClick={() => {
            dispatch(notSelectedChat());
          }}
        />
        <Avatar
          src={
            selectChat.data.isChatGroup
              ? selectChat.data.detail.groupPicture
              : selectChat.data.detail.profilePicture
          }
          className={`${theme ? "skeleton-dark" : "skeleton-light"}`}
          size="sm"
          alt="avatar"
        />
        <div>
          <h3 className={`font-semibold text-md md:text-lg`}>
            {selectChat.data.isChatGroup
              ? selectChat.data.detail.chatName
              : selectChat.data.detail.name}
          </h3>
          {selectChat.data.isChatGroup || (
            <p className={`font-medium text-sm`}>
              {isUserOnline(selectChat.data.detail._id)
                ? "Online"
                : "Offline"}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Phone cursor={"pointer"} />
        <Video cursor={"pointer"} />
        <MoreHorizontal cursor={"pointer"} onClick={openDrawer} />
      </div>
      <InfoDrawer open={open} closeDrawer={closeDrawer} />
    </nav>
  );
};

export default Header;