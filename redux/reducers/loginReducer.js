import * as types from "../actions/types";

const initialState = {
  userInfo: {}
};

let loginReducer = (state = {}, action) => {
  switch (action.type) {
    case types.SET_USERINFO:
      return {
        ...state,
        userInfo: action.userInfo
      };
    default:
      return {
        ...state
      };
  }
}

export default loginReducer;

