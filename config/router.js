import React, { Component } from "react";
import { StackNavigator } from "react-navigation";
import Login from "../screens/Login";
import Main from "./main";

export const Root = StackNavigator(
  {
    Main: { screen: Main },
    Login: { screen: Login }
  },
  {
    mode: "modal",
    headerMode: "none"
  }
);
