import { combineReducers } from "redux";
import * as checkItemReducers from "./checkItemReducer";
import * as loginReducers from "./loginReducer";
import * as projectReducers from "./projectReducer";
import * as tokenReducers from "./tokenReducer";

export default combineReducers(
  Object.assign(
    checkItemReducers,
    loginReducers,
    projectReducers,
    tokenReducers
  )
);

// export { loginReducers };
