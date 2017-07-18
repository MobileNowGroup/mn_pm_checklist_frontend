import * as types from "../actions/types";

/**
 * 初始化状态
 */
const initialState = {
  checkItems: [],
  isLoading: true,
  isRefreshing: false,
  addResult: null,
  deleteResult: null,
  editResult: null,
  createResult: null,
};

let checkItemsReducer = (state = initialState, action) => {
   switch (action.type) {
        case types.LOAD_CHECKITEM_LIST:
            return Object.assign({}, state, {
                isLoading: action.isLoading,
                isRefreshing: action.isRefreshing,
                addResult: null,
                deleteResult: null,
                editResult: null,
                createResult: null,
            });
        case types.GET_CHECKITEM_LIST:
            return Object.assign({}, state, {
                isLoading: false,
                isRefreshing: false,
                checkItems: action.checkItems,
                addResult: null,
                deleteResult: null,
                editResult: null,
                createResult: null,
            });
         case types.ADD_RELEASE:
            return Object.assign({}, state, {
                addResult: action.addResult,
                isLoading: action.isLoading,
                isRefreshing: false,
                deleteResult: null,
                editResult: null,
                createResult: null,
            });
        default:
            return state;
    }
}

export default checkItemsReducer;

