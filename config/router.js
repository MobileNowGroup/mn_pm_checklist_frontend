import React from "react";
import { StackNavigator } from "react-navigation";
import Home from "../screens/Home";
import New from "../screens/New";
import Detail from "../screens/Detail";
import Login from "../screens/Login";
import ManagerTabNavigator from "../screens/ManagerTabNavigator";
import NewCheckItemScreen from "../screens/NewCheckItemScreen";

export const Root = StackNavigator(
  {
    Login: { screen: Login },
    ManagerTabNavigator: { screen: ManagerTabNavigator },
    Home: { screen: Home },
    New: { screen: New },
    Detail: { screen: Detail },
    NewCheckItemScreen: { screen: NewCheckItemScreen }
  },
  {
    mode: "card"
    // headerMode: "none"
  }
);
