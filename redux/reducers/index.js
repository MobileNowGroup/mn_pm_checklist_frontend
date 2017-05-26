import { combineReducers } from "redux";
import * as checkItemReducers from "./checkItemReducer";
import * as loginReducers from "./loginReducer";

export default combineReducers({ ...loginReducers, ...checkItemReducers });

// export { loginReducers };
