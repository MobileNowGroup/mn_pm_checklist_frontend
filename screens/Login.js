import React, { Component } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, combineReduxers, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import createLogger from "redux-logger";

class Login extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "MNReleaseTool",
    headerRight: (
      <Button title=" + " onPress={() => navigation.navigate("New")} />
    )
  });

  render() {
    return (
      <View style={styles.container}>
        <Text>Login</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50"
  }
});

export default Login;
