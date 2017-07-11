import * as types from "../actions/types";

const initialState = {
  isTokenExpired: false
};

let tokenReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_TOKEN_STATE:
      return {
        ...state,
        isTokenExpired: action.isTokenExpired
      };

    default:
      return state;
  }
}

export default tokenReducer;