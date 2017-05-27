import * as types from "./types";
import axios from "axios";

export function deleteCheckItem(itemID, index) {
  return (dispatch, getState) => {
    let currentState = getState();
    const { checkItems } = currentState.default.checkItemsReducer;
    return axios
      .delete("http://192.168.31.206:8000/checkitem/" + itemID)
      .then(responce => handleDeleteItem(responce, dispatch, checkItems, index))
      .catch(error => console.log(error));
  };
  return {
    type: types.DELETECHECKITEM
  };
}

function handleDeleteItem(responce, dispatch, checkItems, index) {
  if (responce.status == 200) {
    checkItems.splice(index, 1);
    dispatch(setCheckItems({ checkItems: checkItems }));
  }
}

export function fetchCheckItems() {
  return (dispatch, getState) => {
    return axios
      .get("http://192.168.31.206:8000/checkitems")
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
