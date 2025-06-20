import { Search, Loader2 } from "lucide-react";
import { Avatar } from "@material-tailwind/react";

const SearchInput = ({
  theme,
  search,
  searchLoading,
  searchResults,
  setSearch,
  addChatList,
}) => {
  return (
    <>
      <label
        htmlFor="search"
        className={`flex items-center gap-2 ${
          theme ? "bg-[#252425] text-white" : "bg-[#f6f6f7] text-[#4c4d52]"
        } text-base p-2 rounded-lg mt-5 font-semibold`}
      >
        {searchLoading ? (
          <Loader2 strokeWidth={2} className="animate-spin" />
        ) : (
          <Search strokeWidth={2} />
        )}
        <input
          type="search"
          id="search"
          placeholder="Search by name and email..."
          autoComplete="off"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none last:w-full"
        />
      </label>
      <div className="relative">
        {searchLoading ? (
          <div
            className={`absolute w-full z-10 mt-1 shadow-2xl px-5 py-2 rounded-lg ${
              theme ? "bg-[#222222]" : "bg-white"
            }`}
          >
            <p className={`${theme ? "text-white" : "text-black"} py-3`}>
              Searching...
            </p>
          </div>
        ) : searchResults.length > 0 ? (
          <div
            className={`absolute w-full z-10 mt-1 shadow-2xl px-5 py-2 rounded-lg ${
              theme ? "bg-[#222222]" : "bg-white"
            }`}
          >
            <div
              className={`flex flex-col gap-1 max-h-52 ${
                searchResults.length > 3 ? "overflow-scroll" : ""
              } overflow-x-hidden`}
            >
              {searchResults.map((item, i) => (
                <div
                  key={i}
                  className={`flex gap-3 p-2 rounded-xl items-center cursor-pointer ${
                    theme ? "hover:bg-[#4c4d52]" : "hover:bg-[#d6d6d7]"
                  }`}
                  onClick={() => {
                    addChatList(item._id);
                  }}
                >
                  <Avatar
                    src={item.profilePicture}
                    size="sm"
                    className={`${theme ? "skeleton-dark" : "skeleton-light"}`}
                  />
                  <div>
                    <p className={`${theme ? "text-white" : "text-black"}`}>
                      {item.name}
                    </p>
                    <small className={`${theme ? "text-white" : "text-black"}`}>
                      {item.email}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          search?.length > 0 &&
          searchResults.length === 0 &&
          !searchLoading && (
            <div
              className={`absolute w-full z-10 mt-2 shadow-2xl px-5 py-2 rounded-lg ${
                theme ? "bg-[#222222]" : "bg-white"
              }`}
            >
              <p className={`${theme ? "text-white" : "text-black"} py-3`}>
                No results found for "{search}"
              </p>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default SearchInput;
