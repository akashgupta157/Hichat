const themeReducer = (state = { isDarkMode: true }, action) => {
  switch (action.type) {
    case "TOGGLE_THEME":
      return {
        ...state,
        isDarkMode: !state.isDarkMode,
      };
    default:
      return state;
  }
};
export default themeReducer;
