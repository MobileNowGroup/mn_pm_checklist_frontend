import * as types from "./types";
import axios from "axios";
import * as tokenActions from "./tokenActions";
import * as Api from '../../app/constant/api';

export let checkItem = (isLoading) => {
  return dispatch => {
    dispatch(loadCheckitemData(isLoading));
    return axios
      .get(Api.API_CHECKITEM_LIST)
      .then(responce => dispatch(receiveCheckitemData(responce.data.data)))
      .catch(error => tokenActions.handleError(dispatch, error));
  }
}

export let addRelease = (parmar,isLoading) => {
  return dispatch => {
    dispatch(loadCheckitemData(isLoading));
    let url = Api.API_ADD_RELEASE;
    return axios.post(url,parmar)
   .then(response => dispatch(receiveResult(response.data.data)))
   .catch(error => dispatch(handleError(dispatch,error)));
  }
}

let receiveResult = (result) => {
  return {
    type: types.ADD_RELEASE,
    addResult: true,
    isLoading: false,
  }
}

let handleError = (dispatch,error) => {
  tokenActions.handleError(dispatch, error)
  return {
    type: types.ADD_RELEASE,
    addResult: false,
    isLoading: false,
  }
}


let loadCheckitemData = (isLoading) => {
  return {
    type: types.LOAD_CHECKITEM_LIST,
    isLoading: isLoading,
  }
}

let receiveCheckitemData = (checkItemList) => {
  return {
    type: types.GET_CHECKITEM_LIST,
    checkItems: checkItemList,
  }
}

/**
 * 
 * 删除checkItem
 * @export
 * @param {int} itemID 
 * @param {bool} isLoading 
 * @returns 
 */
export function deleteCheckItem(itemID, isLoading) {
  return dispatch => {
    dispatch(loadCheckitemData(isLoading));
    let url = Api.API_DELETE_CHECKITEM + itemID;
    return axios
      .delete(url)
      .then(response => dispatch(receiveDeleteResult(response.data.data)))
      .catch(error => dispatch(handleDeleteError(dispatch, error)));
  };
}

/**
 * 接收删除checkItem的结果
 * @param {bool} result 
 */
let receiveDeleteResult = (result) => {
  return {
    type: types.DELETE_CHECKITEM,
    isLoading: false,
    deleteResult: result,
  }
}

/**
 * 处理删除checkItem报错
 * @param {*} dispatch 
 * @param {*} error 
 */
let handleDeleteError = (dispatch,error) => {
  tokenActions.handleError(dispatch, error)
  return {
    type: types.DELETE_CHECKITEM,
    deleteResult: false,
    isLoading: false,
  }
}


function handleDeleteItem(responce, dispatch, checkItems, index) {
  if (responce.status == 200) {
    checkItems.splice(index, 1);
    dispatch(setCheckItems({ checkItems: checkItems }));
  }
}

/**
 * 
 * 创建checkItem
 * @export
 * @param {any} body 
 * @returns 
 */
export function newCheckItem(body,isLoading) {
  return dispatch => {
    dispatch(loadCheckitemData(isLoading));
    let url = Api.API_CREATE_CHECKITEM;
    return axios
      .post(url, body)
      .then(response => dispatch(receiveCreateResult(response.data.data)))
      .catch(error => dispatch(handleCreateError(dispatch, error)));
  };
}

/**
 * 接收创建checkItem的结果
 * @param {bool} result 
 */
let receiveCreateResult = (result) => {
  return {
    type: types.CREATE_CHECKITEM,
    isLoading: false,
    createResult: result,
  }
}

/**
 * 处理创建checkItem报错
 * @param {*} dispatch 
 * @param {*} error 
 */
let handleCreateError = (dispatch,error) => {
  tokenActions.handleError(dispatch, error)
  return {
    type: types.CREATE_CHECKITEM,
    createResult: false,
    isLoading: false,
  }
}


/**
 * 
 * 编辑checkItem
 * @export
 * @param {any} checkItemId 
 * @param {any} body 
 * @returns 
 */
export function updateCheckItem(checkItemId, body,isLoading) {
  return dispatch => {
    dispatch(loadCheckitemData(isLoading));
    let url = 'http://119.23.47.185:4001/checkitems/' + checkItemId;
    console.log('url:  '+url);
    return axios
      .put(url, body)
      .then(response => dispatch(receiveEditResult(response.data.data)))
      .catch(error => dispatch(handleEditError(dispatch, error)));
  };
}

/**
 * 接收编辑checkItem的结果
 * @param {bool} result 
 */
let receiveEditResult = (result) => {
  return {
    type: types.EDIT_CHECKITEM,
    isLoading: false,
    editResult: result,
  }
}

/**
 * 处理编辑checkItem报错
 * @param {*} dispatch 
 * @param {*} error 
 */
let handleEditError = (dispatch,error) => {
  tokenActions.handleError(dispatch, error)
  return {
    type: types.EDIT_CHECKITEM,
    editResult: false,
    isLoading: false,
  }
}

export function fetchCheckItems() {
  return (dispatch, getState) => {
    return axios
      .get("http://119.23.47.185:4001/checkitems")
      .then(responce => dispatch(setCheckItems({ checkItems: responce.data.data })))
      .catch(error => tokenActions.handleError(dispatch, error));
  };
}

export function setCheckItems({ checkItems }) {
  return {
    type: types.SET_CHECKITEMS,
    checkItems
  };
}
