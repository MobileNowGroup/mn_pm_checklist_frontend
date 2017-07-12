import axios from "axios";
import * as types from "./types";
import * as tokenActions from "./tokenActions";
import * as Api from '../../app/constant/api';

export function fetchProjects(isLoading,isRefreshing) {
  return dispatch => {
    // 1.发出拉取数据的信号
    dispatch(loadProjectData(isLoading,isRefreshing));
      // 2.请求网络
    return axios
      .get(Api.API_PROJECT_LIST)
      .then(responce => dispatch(receiveProjectData(responce.data.data)))
      .catch(error => tokenActions.handleError(dispatch, error));
  };
}

let loadProjectData = (isLoading,isRefreshing) => {
    return {
        type: types.LOAD_PROJECT_LIST,
        isLoading: isLoading,
        isRefreshing: isRefreshing,
    }
}

let receiveProjectData = (projectList) => {
    return {
        type: types.SET_PROJECTS,
        projects: projectList,
    }
}

export function deleteProject(projectID, index) {
  return (dispatch, getState) => {
    let currentState = getState();
    const { projects } = currentState.Project;
    return axios
      .delete(API_DELETE_PROJECT + projectID)
      .then(responce =>
        handleDeleteProject(responce, dispatch, projects, index)
      )
      .catch(error => tokenActions.handleError(dispatch, error));
  };
}

export function updateProject(projectID, body) {
  return (dispatch, getState) => {
    let url = "http://119.23.47.185:4001/projects/" + projectID;
    return axios
      .put(url, body)
      .then(responce => dispatch(fetchProjects()))
      .catch(error => tokenActions.handleError(dispatch, error));
  };
}

export function newProject(body) {
  return (dispatch, getState) => {
    let url = "http://119.23.47.185:4001/projects";
    return axios
      .post(url, body)
      .then(responce => dispatch(fetchProjects()))
      .catch(error => tokenActions.handleError(dispatch, error));
  };
}

function handleDeleteProject(responce, dispatch, projects, index) {
  if (responce.status == 200) {
    projects.splice(index, 1);
    dispatch(setProjects({ projects: projects }));
  }
}


