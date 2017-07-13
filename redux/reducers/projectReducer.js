import * as types from "../actions/types";

const initialState = {
  projects: [],
  isRefreshing: false,
  isLoading: false,
  deleteResult: null,
  createResult: null,
  editResult: null,
};

let projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOAD_PROJECT_LIST: 
      return Object.assign({}, state, {
        isRefreshing: action.isRefreshing,
        loading: action.isLoading,
        deleteResult: null,
        createResult: null,
        editResult: null,
      });
    case types.SET_PROJECTS:
      return Object.assign({}, state, {
        isRefreshing: false,
        isLoading: false,
        projects: action.projects,
        deleteResult: null,
        createResult: null,
        editResult: null,
      });
    case types.DELETE_PROJECT:
       return Object.assign({}, state, {
        isRefreshing: false,
        isLoading: false,
        deleteResult: action.deleteResult,
        createResult: null,
        editResult: null,
      }); 
    case types.CREATE_PROJECT:
       return Object.assign({}, state, {
        isRefreshing: false,
        isLoading: false,
        deleteResult: null,
        createResult: action.createResult,
        editResult: null,
      }); 
    case types.EDIT_PROJECT:
       return Object.assign({}, state, {
        isRefreshing: false,
        isLoading: false,
        deleteResult: null,
        createResult: null,
        editResult: action.editResult,
      });
    
    default:
      return state;
  }
}

export default projectReducer;