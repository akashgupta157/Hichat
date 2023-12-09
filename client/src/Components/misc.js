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
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedTime = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
  return formattedTime;
}
