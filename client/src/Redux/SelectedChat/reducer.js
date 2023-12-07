const initialState = {
  isChatSelected: false,
  data: null,
};
const selectedChatReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SELECTED_CHAT":
      return {
        ...state,
        isChatSelected: true,
        data: action.payload,
      };
    case "NOT_SELECTED_CHAT":
      return {
        ...state,
        isChatSelected: false,
        data: null,
      };
    default:
      return state;
  }
};
export default selectedChatReducer;
