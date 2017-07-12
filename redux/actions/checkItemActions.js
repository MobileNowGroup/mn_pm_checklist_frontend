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


export function deleteCheckItem(itemID, index) {
  return (dispatch, getState) => {
    let currentState = getState();
    const { checkItems } = currentState.default.checkItemsReducer;
    return axios
      .delete(API_DELETE_CHECKITEM + itemID)
      .then(responce => handleDeleteItem(responce, dispatch, checkItems, index))
      .catch(error => tokenActions.handleError(dispatch, error));
  };
}

function handleDeleteItem(responce, dispatch, checkItems, index) {
  if (responce.status == 200) {
    checkItems.splice(index, 1);
    dispatch(setCheckItems({ checkItems: checkItems }));
  }
}

export function newCheckItem(body) {
  return (dispatch, getState) => {
    let url = "http://119.23.47.185:4001/checkitem";
    return axios
      .post(url, body)
      .then(responce => dispatch(fetchCheckItems()))
      .catch(error => tokenActions.handleError(dispatch, error));
  };
}

export function updateCheckItem(checkItemId, body) {
  return (dispatch, getState) => {
    let url = "http://119.23.47.185:4001/checkitem/" + checkItemId;
    return axios
      .put(url, body)
      .then(responce => dispatch(fetchCheckItems()))
      .catch(error => tokenActions.handleError(dispatch, error));
  };
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
