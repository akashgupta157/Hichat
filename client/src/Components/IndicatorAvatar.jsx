const IndicatorAvatar = ({ src, isOnline, theme }) => {
  return (
    <>
      <div className="relative">
        <img
          className={`rounded-full w-12 h-12 ${
            theme ? "skeleton-dark" : "skeleton-light"
          }`}
          src={src}
          alt=""
        />
        <span
          className={`bottom-0 left-9 absolute w-3.5 h-3.5 ${
            isOnline ? "bg-green-500" : "bg-red-500"
          }  border-2 dark:border-gray-800 rounded-full`}
        ></span>
      </div>
    </>
  );
};

export default IndicatorAvatar;
