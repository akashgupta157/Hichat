import { formatDateTime } from "../../misc";
import IndicatorAvatar from "../IndicatorAvatar";
import { Avatar } from "@material-tailwind/react";
import { selectedChat } from "../../Redux/SelectedChat/action";

const ChatList = ({
  theme,
  chatList,
  selectChat,
  you,
  isUserOnline,
  notifyChats,
  countOccurrences,
  dispatch,
}) => {
  const getChatName = (item) => {
    if (item.isGroupChat) return item;

    let chatName = {};
    item.members.forEach((member) => {
      if (member._id !== you._id) {
        chatName = member;
      }
    });
    return chatName;
  };

  return (
    <>
      <div
        className={`h-[70vh] scrollbar-none ${
          chatList.length > 6 ? "overflow-scroll" : ""
        } md:${
          chatList.length > 5 ? "overflow-scroll" : ""
        } overflow-x-hidden mt-7 flex flex-col gap-1`}
      >
        {chatList?.map((item, index) => {
          const chatName = getChatName(item);
          const isSelected =
            selectChat.isChatSelected &&
            selectChat.data.detail._id === chatName._id;

          return (
            <div
              key={index}
              className={`flex relative p-3 rounded-xl justify-between items-start cursor-pointer ${
                theme
                  ? "hover:bg-[#4c4d52] bg-[#171718]"
                  : "hover:bg-[#d6d6d7] bg-[#f7f7f7]"
              } ${
                isSelected
                  ? theme
                    ? "bg-gray-900 hover:bg-gray-900"
                    : "bg-gray-300 hover:bg-gray-300"
                  : ""
              }`}
              onClick={() => {
                dispatch(
                  selectedChat({
                    id: item._id,
                    detail: chatName,
                    isChatGroup: item.isGroupChat,
                  })
                );
              }}
            >
              <div className="flex gap-3">
                {item.isGroupChat ? (
                  <Avatar
                    src={chatName.groupPicture}
                    className={`${theme ? "skeleton-dark" : "skeleton-light"}`}
                    alt=""
                  />
                ) : (
                  <IndicatorAvatar
                    src={chatName.profilePicture}
                    isOnline={isUserOnline(chatName._id)}
                    alt=""
                    theme={theme}
                  />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h2
                      className={`font-bold text-base ${
                        theme ? "text-white" : "text-black"
                      }`}
                    >
                      {item.isGroupChat ? chatName.chatName : chatName.name}
                    </h2>
                    {notifyChats.includes(item._id) && (
                      <p className="flex justify-center items-center bg-red-600 rounded-full w-4 h-4 text-white text-xs">
                        {countOccurrences(notifyChats, item._id)}
                      </p>
                    )}
                  </div>
                  <p
                    className={`text-sm overflow-hidden whitespace-nowrap overflow-ellipsis w-64 md:w-56 ${
                      theme ? "text-white" : "text-black"
                    }`}
                  >
                    {item.latestMessage
                      ? item.isGroupChat
                        ? `${
                            item.latestMessage.sender._id === you._id
                              ? "You"
                              : item.latestMessage.sender.name
                          } : ${item.latestMessage.content}`
                        : item.latestMessage.content
                      : "No previous Messages"}
                  </p>
                </div>
              </div>
              {item.latestMessage && (
                <small
                  className={`absolute top-2 right-2 ${
                    theme ? "text-white" : "text-black"
                  }`}
                >
                  {formatDateTime(item.updatedAt)}
                </small>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ChatList;
