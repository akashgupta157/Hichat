import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Smile, Send, Paperclip, Loader2 } from "lucide-react";
import { IconButton, Menu, MenuHandler, MenuList } from "@material-tailwind/react";

const InputBox = ({
  theme,
  messageInput,
  setMessageInput,
  sendMsg,
  sendLoading,
  handleFileChange,
}) => {
  const addEmoji = (e) => {
    const sym = e.unified.split("_");
    const cA = [];
    sym.forEach((el) => cA.push("0x" + el));
    let emoji = String.fromCodePoint(...cA);
    setMessageInput(messageInput + emoji);
  };

  return (
    <footer
      className={`border-t h-[8%] md:h-[10%] flex justify-center items-center ${
        theme ? "border-gray-800" : "border-gray-300"
      } `}
    >
      <div className="flex justify-center items-center gap-2 w-full">
        <div
          className={`flex items-center px-2 md:px-5 py-2 gap-3 rounded-lg w-[80%] md:w-[90%] ${
            theme ? "bg-[#252425] text-[#bebebe]" : "bg-gray-300"
          }`}
        >
          <Menu>
            <MenuHandler>
              <Smile cursor={"pointer"} />
            </MenuHandler>
            <MenuList className={`p-0 border-0 rounded-xl`}>
              <Picker data={data} onEmojiSelect={addEmoji} />
            </MenuList>
          </Menu>
          <label htmlFor="fileInput" className="cursor-pointer">
            <Paperclip cursor={"pointer"} size={"22px"} />
            <input
              id="fileInput"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <input
            type="text"
            required
            placeholder="Type your message here..."
            className="bg-transparent outline-none w-full"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.code === "Enter") {
                sendMsg();
                setMessageInput("");
              }
            }}
          />
        </div>
        {sendLoading ? (
          <IconButton disabled>
            <Loader2 className="m-auto animate-spin" />
          </IconButton>
        ) : (
          <IconButton
            type="submit"
            className="bg-[#000000]"
            onClick={sendMsg}
          >
            <Send />
          </IconButton>
        )}
      </div>
    </footer>
  );
};

export default InputBox;