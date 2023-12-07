export const selectedChat = (data) => ({
  type: "SELECTED_CHAT",
  payload: data,
});
export const notSelectedChat = () => ({
  type: "NOT_SELECTED_CHAT",
});
