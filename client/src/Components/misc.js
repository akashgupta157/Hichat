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
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  if (urlRegex.test(str)) {
    const imageRegex = /\.(jpg|jpeg|png|gif)$/i;
    const videoRegex = /\.(mp4|ogg|webm)$/i;
    const audioRegex = /\.(mp3|wav)$/i;
    const documentRegex = /\.(pdf|doc|docx|xls|xlsx)$/i;
    if (imageRegex.test(str)) {
      return "image";
    } else if (videoRegex.test(str)) {
      return "video";
    } else if (audioRegex.test(str)) {
      return "audio";
    } else if (documentRegex.test(str)) {
      return "document";
    }
  }else{
    return str
  }
}
