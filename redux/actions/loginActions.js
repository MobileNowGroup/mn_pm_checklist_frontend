import * as types from "./types";
import axios from "axios";
import * as tokenActions from "./tokenActions";
import * as Api from '../../app/constant/api';

// action creator
export function login(name, password) {
  return (dispatch, getState) => {
    return axios
      .post(Api.API_LOGIN, {
        username: name,
        password: password
      })
      .then(responce => handleLoginResponce(responce, dispatch))
      .catch(error => tokenActions.handleError(dispatch, error));
  };
}

function handleLoginResponce(responce, dispatch) {
  console.log(responce.data.data.Token)
  //将Token放入请求头
  axios.defaults.headers.common["Access-Token"] = responce.data.data.Token;

  dispatch(tokenActions.setTokenState(false));

  dispatch(setUserInfo({ userInfo: responce.data.data }));
}

// action creator
export function setUserInfo({ userInfo }) {
  return {
    type: types.SET_USERINFO,
    userInfo
  };
}
