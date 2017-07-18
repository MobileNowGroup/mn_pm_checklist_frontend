import React, { Component } from "react";
import { Platform,NativeEventEmitter } from 'react-native';
import { Root } from "./config/router";
import { IosRoot } from "./config/router";
import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import createLogger from "redux-logger";
import store from './app/store/store';
import * as launchImage from 'react-native-launch-image';

class App extends Component {
  
  componentDidMount() {
    //关闭启动动画,直到launchImage.hide();被调用之前，启动画面会一直保持在屏幕上，这样你的用户就不会看到难看的白屏了！
    if (Platform.OS === 'ios') {
        launchImage.hide();
    }
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <Provider store={store}>
        { Platform.OS === 'ios' 
            ? <IosRoot/> 
            : <Root/>
        }
      </Provider>
    );
  }
}

export default App;
