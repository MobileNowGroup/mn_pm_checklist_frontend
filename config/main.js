import React, { Component } from "react";
import { View } from "react-native";
import { StackNavigator } from "react-navigation";
import Home from "../screens/Home";
import New from "../screens/New";
import Detail from "../screens/Detail";
import Login from "../screens/Login";
import ManagerTabNavigator from "../screens/ManagerTabNavigator";
import NewCheckItemScreen from "../screens/NewCheckItemScreen";
import NewProjectScreen from "../screens/NewProjectScreen";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as loginActions from "../redux/actions/loginActions";
import LOGIN from "../redux/actions/types";
import axios from "axios";
import * as projectActions from "../redux/actions/projectActions";

export const PMStack = StackNavigator(
  {
    ManagerTabNavigator: { screen: ManagerTabNavigator },
    NewCheckItemScreen: { screen: NewCheckItemScreen },
    NewProjectScreen: { screen: NewProjectScreen }
  },
  {
    mode: "card"
    // headerMode: "none"
  }
);

export const DeveloperStack = StackNavigator(
  {
    Home: { screen: Home },
    New: { screen: New },
    Detail: { screen: Detail }
  },
  {
    mode: "card"
    // headerMode: "none"
  }
);

class Main extends Component {
  componentWillMount() {
    this.props.navigation.navigate("Login");
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isTokenExpired) {
      this.props.navigation.navigate("Login");
    }
  }

  render() {
    if (typeof this.props.userInfo == "undefined") {
      return <View />;
    }
    if (this.props.userInfo.Basic.RoleId == 4) {
      return <DeveloperStack />;
      // return <PMStack />;
    } else if (this.props.userInfo.Basic.RoleId == 4) {
      // return <DeveloperStack />;
      return <PMStack />;
    }
  }
}

function mapStateToProps(state) {
  return {
    userInfo: state.default.default.userInfo,
    isTokenExpired: state.default.tokenReducer.isTokenExpired
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    Object.assign(loginActions, projectActions),
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
