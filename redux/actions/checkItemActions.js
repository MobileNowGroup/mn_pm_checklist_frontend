import * as types from "./types";
import axios from "axios";

export function deleteCheckItem() {
  return {
    type: types.DELETECHECKITEM
  };
}

export function fetchCheckItems() {
  return (dispatch, getState) => {
    return axios
      .get("http://192.168.31.206:8080/checkitems")
      .then(responce => dispatch(setCheckItems({ checkItems: responce.data })))
      .catch(error => console.log(error));
  };
}

export function setCheckItems({ checkItems }) {
  return {
    type: types.SET_CHECKITEMS,
    checkitems
  };
}
