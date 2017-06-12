import * as types from "./types";
import axios from "axios";
import * as tokenActions from "./tokenActions";

// action creator
export function login(name, password) {
  return (dispatch, getState) => {
    return axios
      .post("http://119.23.47.185:4001/login", {
        username: name,
        password: password
      })
      .then(responce => handleLoginResponce(responce, dispatch))
      .catch(error => tokenActions.handleError(dispatch, error));
  };
}

function handleLoginResponce(responce, dispatch) {
  axios.defaults.headers.common["Access-Token"] = responce.data.Token;

  dispatch(tokenActions.setTokenState(false));

  dispatch(setUserInfo({ userInfo: responce.data }));
}

// action creator
export function setUserInfo({ userInfo }) {
  return {
    type: types.SET_USERINFO,
    userInfo
  };
}
