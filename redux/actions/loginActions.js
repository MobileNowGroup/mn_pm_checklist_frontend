import * as types from "./types";
import axios from "axios";

// action creator
export function login(name, password) {
  /*
  return {
    type: types.SET_USERINFO,
    userInfo: { userName: "Perry" }
  };
  */
  return (dispatch, getState) => {
    return axios
      .post("http://119.23.47.185:4001/login", {
        username: name,
        password: password
      })
      .then(responce => dispatch(setUserInfo({ userInfo: responce.data })))
      .catch(error => console.log("error is " + error));
  };
}

// action creator
export function setUserInfo({ userInfo }) {
  return {
    type: types.SET_USERINFO,
    userInfo
  };
}
