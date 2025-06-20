export const url = import.meta.env.VITE_url;
export function configure(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}
export function formatTime(timestamp) {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedTime = `${formattedHours}:${
    minutes < 10 ? "0" : ""
  }${minutes} ${period}`;
  return formattedTime;
}
export function formatDateTime(timestamp) {
  const currentDate = new Date();
  const inputDate = new Date(timestamp);
  if (
    inputDate.getDate() === currentDate.getDate() &&
    inputDate.getMonth() === currentDate.getMonth() &&
    inputDate.getFullYear() === currentDate.getFullYear()
  ) {
    const hours = inputDate.getHours();
    const minutes = inputDate.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes < 10 ? "0" : ""}${minutes} ${period}`;
  } else {
    const day = inputDate.getDate();
    const month = inputDate.getMonth() + 1;
    const year = inputDate.getFullYear().toString().slice(-2);

    return `${day}/${month < 10 ? "0" : ""}${month}/${year}`;
  }
}
export function isUrl(str) {
  const urlLike = /^(https?|ftp):\/\//i.test(str);

  if (urlLike) {
    let urlObj;
    try {
      const tempStr = str.replace(/ /g, "%20");
      urlObj = new URL(tempStr);
    } catch (e) {
      const lastDotIndex = str.lastIndexOf(".");
      if (lastDotIndex === -1) return "link";

      const extension = str
        .slice(lastDotIndex + 1)
        .split(/[ ?]/)[0]
        .toLowerCase();

      const imageExtensions = [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "webp",
        "bmp",
        "svg",
      ];
      const videoExtensions = [
        "mp4",
        "mov",
        "avi",
        "mkv",
        "webm",
        "ogg",
        "wmv",
        "flv",
      ];
      const audioExtensions = ["mp3", "wav", "ogg", "m4a", "flac", "aac"];
      const documentExtensions = [
        "pdf",
        "doc",
        "docx",
        "xls",
        "xlsx",
        "ppt",
        "pptx",
        "txt",
        "rtf",
        "csv",
      ];

      if (imageExtensions.includes(extension)) return "image";
      if (videoExtensions.includes(extension)) return "video";
      if (audioExtensions.includes(extension)) return "audio";
      if (documentExtensions.includes(extension)) return "document";

      return "link";
    }
    const pathname = urlObj.pathname.toLowerCase();
    const lastDotIndex = pathname.lastIndexOf(".");

    if (lastDotIndex === -1) return "link";

    const extension = pathname.slice(lastDotIndex + 1).split(/[ ?]/)[0];

    const imageRegex = /(jpg|jpeg|png|gif|webp|bmp|svg)$/i;
    const videoRegex = /(mp4|mov|avi|mkv|webm|ogg|wmv|flv)$/i;
    const audioRegex = /(mp3|wav|ogg|m4a|flac|aac)$/i;
    const documentRegex = /(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|rtf|csv)$/i;

    if (imageRegex.test(extension)) return "image";
    if (videoRegex.test(extension)) return "video";
    if (audioRegex.test(extension)) return "audio";
    if (documentRegex.test(extension)) return "document";

    return "link";
  }

  return str;
}
