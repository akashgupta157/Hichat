const initialState = false;
const pageLoadReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_PAGE_LOAD":
      return action.payload;
    default:
      return state;
  }
};
export default pageLoadReducer