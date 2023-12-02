import { legacy_createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import themeReducer from "./Theme/reducer";
const rootReducer = combineReducers({
  theme: themeReducer,
});
const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

export default store;
