import * as types from "../actions/types";

const initialState = {
  projects: [],
  isRefreshing: false,
  isLoading: false,
};

let projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOAD_PROJECT_LIST: 
      return Object.assign({}, state, {
        isRefreshing: action.isRefreshing,
        loading: action.isLoading,
      });
    case types.SET_PROJECTS:
      return Object.assign({}, state, {
        isRefreshing: false,
        isLoading: false,
        projects: action.projects,
      });
    default:
      return state;
  }
}

export default projectReducer;