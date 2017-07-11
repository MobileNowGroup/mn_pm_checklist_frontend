import * as types from "../actions/types";

const initialState = {
  projects: []
};

let projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_PROJECTS:
      return {
        ...state,
        projects: action.projects
      };

    default:
      return state;
  }
}

export default projectReducer;