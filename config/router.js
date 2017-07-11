import React, { Component } from "react";
import { StackNavigator } from "react-navigation";
import Login from "../screens/Login";
import Main from "./main";
import Splash from '../screens/Splash';


export const Root = StackNavigator(
  {
    Splash: { screen: Splash },
    Main: { screen: Main },
    Login: { screen: Login },
  },
  {
    mode: "modal",
    headerMode: "none"
  }
);
