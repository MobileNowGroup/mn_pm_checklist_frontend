import React from "react";
import { StackNavigator } from "react-navigation";
import Home from "../screens/Home";
import New from "../screens/New";
import Detail from "../screens/Detail";
import Login from "../screens/Login";

export const Root = StackNavigator(
  {
    Home: {
      screen: Home
    },
    New: { screen: New },
    Detail: { screen: Detail },
    Login: {
      screen: Login
    }
  },
  {
    mode: "card"
    // headerMode: "none"
  }
);
