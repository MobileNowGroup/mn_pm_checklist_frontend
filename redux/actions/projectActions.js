import axios from "axios";
import * as types from "./types";

export function fetchProjects() {
  return (dispatch, getState) => {
    return axios
      .get("http://119.23.47.185:4001/projects")
      .then(responce => dispatch(setProjects({ projects: responce.data })))
      .catch(error => console.log(error));
  };
}

export function deleteProject(projectID, index) {
  return (dispatch, getState) => {
    let currentState = getState();
    const { projects } = currentState.default.projectReducer;
    return axios
      .delete("http://119.23.47.185:4001/projects/" + projectID)
      .then(responce =>
        handleDeleteProject(responce, dispatch, projects, index)
      )
      .catch(error => console.log(error));
  };
}

export function newProject(body) {
  return (dispatch, getState) => {
    let url = "http://119.23.47.185:4001/projects";
    return axios
      .post(url, body)
      .then(responce => dispatch(fetchProjects()))
      .catch(error => console.log(error));
  };
}

function handleDeleteProject(responce, dispatch, projects, index) {
  if (responce.status == 200) {
    projects.splice(index, 1);
    dispatch(setProjects({ projects: projects }));
  }
}

export function setProjects({ projects }) {
  return {
    type: types.SET_PROJECTS,
    projects
  };
}
