import * as types from "../actions/types";

/**
 * 初始化状态
 */
const initialState = {
  checkItems: [],
  isLoading: true,
  addResult: null,
};

let checkItemsReducer = (state = initialState, action) => {
   switch (action.type) {
        case types.LOAD_CHECKITEM_LIST:
            return Object.assign({}, state, {
                isLoading: action.isLoading,
                addResult: null,
            });
        case types.GET_CHECKITEM_LIST:
            return Object.assign({}, state, {
                isLoading: false,
                checkItems: action.checkItems,
                addResult: null,
            });
         case types.ADD_RELEASE:
            return Object.assign({}, state, {
                addResult: action.addResult,
                isLoading: action.isLoading,
            });
        default:
            return state;
    }
}

export default checkItemsReducer;

