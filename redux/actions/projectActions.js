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

/**
 * 接收list数据
 * @param {array} projectList 
 */
let receiveProjectData = (projectList) => {
    return {
        type: types.SET_PROJECTS,
        projects: projectList,
    }
}

/**
 * 
 * 删除project
 * @export
 * @param {int} projectID 
 * @param {bool} isLoading 
 * @returns 
 */
export function deleteProject(projectID,isLoading) {
  return dispatch => {
    // 1.发出开始操作数据的信号
    dispatch(loadProjectData(isLoading,false));
    return axios
      .delete(Api.API_DELETE_PROJECT + projectID)
      .then(response => dispatch(receiveDeleteResult(response.data.data)))
      .catch(error => dispatch(handleDeleteError(dispatch, error)));
  };
}

/**
 * 接收删除project的结果
 * @param {bool} result 
 */
let receiveDeleteResult = (result) => {
  return {
    type: types.DELETE_PROJECT,
    isLoading: false,
    deleteResult: result,
  }
}

/**
 * 处理删除project报错
 * @param {*} dispatch 
 * @param {*} error 
 */
let handleDeleteError = (dispatch,error) => {
  tokenActions.handleError(dispatch, error)
  return {
    type: types.DELETE_PROJECT,
    deleteResult: false,
    isLoading: false,
  }
}

/**
 * 
 * 更新project
 * @export
 * @param {any} projectID 
 * @param {any} body 
 * @returns 
 */
export function updateProject(projectID, body,isLoading) {
  return dispatch => {
      // 1.发出开始操作数据的信号
    dispatch(loadProjectData(isLoading,false));
    let url = Api.API_EDIT_PROJECT + projectID;
    return axios
      .put(url, body)
      .then(response => dispatch(receiveEditResult(response.data.data)))
      .catch(error => dispatch(handleEditError(dispatch, error)));
  };
}

/**
 * 接收编辑project的结果
 * @param {bool} result 
 */
let receiveEditResult = (result) => {
  return {
    type: types.EDIT_PROJECT,
    isLoading: false,
    editResult: result,
  }
}

/**
 * 处理编辑project报错
 * @param {*} dispatch 
 * @param {*} error 
 */
let handleEditError = (dispatch,error) => {
  tokenActions.handleError(dispatch, error)
  return {
    type: types.EDIT_PROJECT,
    editResult: false,
    isLoading: false,
  }
}

/**
 * 
 * 创建project
 * @export
 * @param {any} body 
 * @returns 
 */
export function newProject(body,isLoading) {
  return dispatch => {
    let url = Api.API_CREATE_PROJECT;
      // 1.发出开始操作数据的信号
    dispatch(loadProjectData(isLoading,false));
    return axios
      .post(url, body)
      .then(response => dispatch(receiveCreateResult(response.data.data)))
      .catch(error => dispatch(handleCreateError(dispatch, error)));
  };
}

/**
 * 接收创建project的结果
 * @param {bool} result 
 */
let receiveCreateResult = (result) => {
  return {
    type: types.CREATE_PROJECT,
    isLoading: false,
    createResult: result,
  }
}

/**
 * 处理编辑project报错
 * @param {*} dispatch 
 * @param {*} error 
 */
let handleCreateError = (dispatch,error) => {
  tokenActions.handleError(dispatch, error)
  return {
    type: types.CREATE_PROJECT,
    createResult: false,
    isLoading: false,
  }
}


function handleDeleteProject(responce, dispatch, projects, index) {
  if (responce.status == 200) {
    projects.splice(index, 1);
    dispatch(setProjects({ projects: projects }));
  }
}


