import { combineReducers } from "redux";
import * as checkItemReducers from "./checkItemReducer";
import * as loginReducers from "./loginReducer";

export default combineReducers(Object.assign(checkItemReducers, loginReducers));

// export { loginReducers };
