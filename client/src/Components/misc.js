// export const url = "https://hichat-backend.vercel.app";
export const url = "http://localhost:3000";
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

  // Check if the date is the current date
  const isCurrentDate = date.toDateString() === currentDate.toDateString();

  if (isCurrentDate) {
    // If it's the current date, show only time
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes < 10 ? "0" : ""}${minutes} ${period}`;
  } else {
    // If it's not the current date, show date and time
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear() % 100; // Get last two digits of the year

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;

    return `${day}/${month}/${year} ${formattedHours}:${
      minutes < 10 ? "0" : ""
    }${minutes} ${period}`;
  }
}
