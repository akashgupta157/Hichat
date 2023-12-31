const user = sessionStorage.getItem("user");
const initialState = {
  isAuthenticated: user ? true : false,
  user: user ? JSON.parse(user) : [],
};
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};
export default authReducer;
