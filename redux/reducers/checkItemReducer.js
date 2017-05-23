import * as types from "../actions/actionTypes";

const initialState = {
  checkItems: []
};

export default function handleCheckItem(
  state = initialState,
  action = {},
  checkItem
) {
  switch (action.type) {
    case types.DELETECHECKITEM:
      return {
        ...state,
        count: state.checkItems.append(checkItem)
      };
    default:
      return state;
  }
}
