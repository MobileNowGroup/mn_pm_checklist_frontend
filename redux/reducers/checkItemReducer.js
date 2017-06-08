import * as types from "../actions/types";
import createReducer from "./createReducer";

const initialState = {
  checkItems: []
};

export function checkItemsReducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_CHECKITEMS:
      return Object.assign(
        {},
        {
          ...state,
          checkItems: action.checkItems
        }
      );
    // return {
    //   ...state,
    //   checkItems: action.checkItems
    // };
    // case types.DELETE_CHECKITEM:
    //   return {
    //     ...state,
    //     checkItems: action.checkItems
    //   };
    default:
      return state;
  }
}

/*
export default function checkItemsReducer(state = initialState, action) {
  switch (action.type) {
  }
  return {
    ...state
  };
}
*/

export function test2(state, action) {
  return {
    ...state
  };
}

/*
export const checkItems = createReducer(
  {},
  {
    [types.SET_CHECKITEMS](state, action) {
      let newState = {};
      console.log("action is " + action);
      return newState;
    }
  }
);
*/
