import * as types from "../actions/types";

const initialState = {
  userInfo: {}
};

export default function loginReducer(state = {}, action) {
  switch (action.type) {
    case types.LOGIN:
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
