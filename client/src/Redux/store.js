import { legacy_createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import themeReducer from "./Theme/reducer";
import authReducer from "./Auth/reducer";
import pageLoadReducer from "./PageLoad/reducer";
const rootReducer = combineReducers({
  theme: themeReducer,
  auth: authReducer,
  pageLoad: pageLoadReducer,
});
const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

export default store;
