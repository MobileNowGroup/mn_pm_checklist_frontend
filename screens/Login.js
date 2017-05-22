import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  KeyboardAvoidingView,
  TextInput
} from "react-native";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, combineReduxers, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import createLogger from "redux-logger";

class Login extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "登录"
  });

  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
  }

  login() {
    this.props.navigation.navigate("ManagerTabNavigator");
    // this.props.navigation.navigate("Home");
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={"padding"}>
        <TextInput style={styles.textInput} placeholder="请输入用户名" />
        <TextInput
          style={styles.textInput}
          placeholder="请输入密码"
          secureTextEntry={true}
        />
        <Button title="登录" onPress={this.login} style={styles.button} />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "space-between",
    paddingTop: 150,
    paddingLeft: 50,
    paddingRight: 50,
    paddingBottom: 150,
    alignItems: "center",
    backgroundColor: "#fff"
  },
  textInput: {
    height: 40,
    borderColor: "gray",
    borderRadius: 10,
    borderWidth: 1,
    paddingLeft: 20
  },
  button: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1
  }
});

export default Login;
