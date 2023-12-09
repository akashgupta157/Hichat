export const url = "https://hichat-backend.vercel.app";
// export const url = "http://localhost:3000";
export function configure(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}
export function formatTime(timestamp) {
  const date = new Date(timestamp);
  const currentDate = new Date();
  const isCurrentDate = date.toDateString() === currentDate.toDateString();
  if (isCurrentDate) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes < 10 ? "0" : ""}${minutes} ${period}`;
  } else {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() % 100;
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;

    return `${day}/${month}/${year} ${formattedHours}:${
      minutes < 10 ? "0" : ""
    }${minutes} ${period}`;
  }
}
