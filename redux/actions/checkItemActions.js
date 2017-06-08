import * as types from "./types";
import axios from "axios";

export function deleteCheckItem(itemID, index) {
  return (dispatch, getState) => {
    let currentState = getState();
    const { checkItems } = currentState.default.checkItemsReducer;
    return axios
      .delete("http://119.23.47.185:4001/checkitem/" + itemID)
      .then(responce => handleDeleteItem(responce, dispatch, checkItems, index))
      .catch(error => console.log(error));
  };
  // return {
  //   type: types.DELETECHECKITEM
  // };
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
      .catch(error => console.log(error));
  };
}

export function fetchCheckItems() {
  return (dispatch, getState) => {
    return axios
      .get("http://119.23.47.185:4001/checkitems")
      .then(responce => dispatch(setCheckItems({ checkItems: responce.data })))
      .catch(error => console.log(error));
  };
}

export function setCheckItems({ checkItems }) {
  return {
    type: types.SET_CHECKITEMS,
    checkItems
  };
}
