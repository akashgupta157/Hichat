import { formatTime, isUrl } from "../../misc";
import { File, ExternalLink, AudioLines } from "lucide-react";

const MessageBubble = ({ msg, you, theme, selectChat }) => {
  const isSender = msg.sender._id === you._id;
  const messageType = isUrl(msg.content);
  const isShortText = !messageType && msg.content.length < 30;

  const MediaDisplay = () => {
    switch (messageType) {
      case "image":
        return (
          <div className="group relative">
            <img
              className="rounded-lg w-full h-auto max-h-80 object-cover"
              src={msg.content}
              alt="Sent image"
              loading="lazy"
            />
            <a
              href={msg.content}
              target="_blank"
              rel="noopener noreferrer"
              className="right-2 bottom-2 absolute bg-black/50 opacity-0 group-hover:opacity-100 p-2 rounded-full transition-opacity"
            >
              <ExternalLink size={16} className="text-white" />
            </a>
          </div>
        );
      case "video":
        return (
          <div className="group relative">
            <video
              className="rounded-lg w-full h-auto max-h-80 object-contain"
              controls
              playsInline
            >
              <source src={msg.content} />
              Your browser does not support the video tag.
            </video>
            <a
              href={msg.content}
              target="_blank"
              rel="noopener noreferrer"
              className="right-2 bottom-2 absolute bg-black/50 opacity-0 group-hover:opacity-100 p-2 rounded-full transition-opacity"
            >
              <ExternalLink size={16} className="text-white" />
            </a>
          </div>
        );
      case "audio":
        return (
          <div className="flex items-center gap-2 p-2">
            <AudioLines size={20} />
            <audio controls className="w-full">
              <source src={msg.content} />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      case "document":
        return (
          <a
            href={msg.content}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:bg-black/10 p-2 rounded transition-colors"
          >
            <File size={20} />
            <span className="max-w-[180px] md:max-w-[240px] truncate">
              {msg.content.split("file-").pop()}
            </span>
          </a>
        );
      default:
        return (
          <div
            className={`whitespace-pre-wrap break-words ${
              isShortText ? "px-2 py-1" : "p-2"
            }`}
          >
            {msg.content}
          </div>
        );
    }
  };

  return (
    <div
      className={`flex ${isSender ? "justify-end" : "justify-start"} px-2 py-1`}
    >
      <div
        className={`flex flex-col max-w-[90%] md:max-w-[80%] lg:max-w-[70%]`}
      >
        {/* Sender name for group chats */}
        {!isSender && selectChat.data.isChatGroup && (
          <span
            className={`text-xs mb-1 ${
              theme ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {msg.sender.name}
          </span>
        )}

        {/* Message bubble */}
        <div
          className={`rounded-2xl ${
            isSender
              ? theme
                ? "bg-[#0171b6] text-white rounded-br-none"
                : "bg-[#0eb6fa] text-white rounded-br-none"
              : theme
              ? "bg-[#212121] text-white rounded-bl-none"
              : "bg-[#d6d6d7] rounded-bl-none"
          } ${isShortText ? "px-3 py-2" : "p-2"}`}
        >
          <MediaDisplay />

          {/* Timestamp */}
          <div className={`flex justify-end items-center mt-1 gap-1`}>
            <span
              className={`text-xs ${
                isSender
                  ? "text-white/80"
                  : theme
                  ? "text-gray-300"
                  : "text-gray-600"
              }`}
            >
              {formatTime(msg.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
