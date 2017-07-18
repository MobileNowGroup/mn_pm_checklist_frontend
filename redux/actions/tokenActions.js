import * as types from "./types";

export function handleError(dispatch, error) {
  let status = error.response.status;
  if (status == 401) {
    // token过期
    dispatch(setTokenState(true));
  } else {
    console.log('error:  '+error);
  }
}

export function setTokenState(isTokenExpired) {
  return {
    type: types.SET_TOKEN_STATE,
    isTokenExpired
  };
}
