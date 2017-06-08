import React, { Component } from "react";
import { Root } from "./config/router";
import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import createLogger from "redux-logger";
import * as reducers from "./redux/reducers";

// const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
// const store = createStoreWithMiddleware(reducer);
// const store = createStore(App, {});

// middleware that logs actions
// const loggerMiddleware = createLogger({
//   predicate: (getState, action) => __DEV__
// });

function configureStore(initialState) {
  const enhancer = compose(
    applyMiddleware(
      thunk // lets us dispatch() functions
      // loggerMiddleware
    )
  );
  return createStore(reducer, initialState, enhancer);
}

const store = configureStore({});

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    );
  }
}

export default App;
