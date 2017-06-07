import React from "react";
import { StackNavigator } from "react-navigation";
import Home from "../screens/Home";
import New from "../screens/New";
import Detail from "../screens/Detail";
import Login from "../screens/Login";
import ManagerTabNavigator from "../screens/ManagerTabNavigator";
import NewCheckItemScreen from "../screens/NewCheckItemScreen";
import NewDetail from "../screens/NewDetail";
export const Root = StackNavigator(
  {
    Login: { screen: Login },
    ManagerTabNavigator: { screen: ManagerTabNavigator },
    Home: { screen: Home },
    New: { screen: New },
    NewDetail: { screen: NewDetail },
    Detail: { screen: Detail },
    NewCheckItemScreen: { screen: NewCheckItemScreen }
  },
  {
    mode: "card"
    // headerMode: "none"
  }
);
