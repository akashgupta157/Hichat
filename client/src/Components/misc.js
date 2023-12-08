// export const url = "https://hichat-backend.vercel.app";
export const url = "http://localhost:3000";
export function configure(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}
