import { combineReducers } from "redux";
import * as checkItemReducers from "./checkItemReducer";
import * as loginReducers from "./loginReducer";
import * as projectReducers from "./projectReducer";

export default combineReducers(
  Object.assign(checkItemReducers, loginReducers, projectReducers)
);

// export { loginReducers };
