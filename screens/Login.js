import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  KeyboardAvoidingView,
  TextInput
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as loginActions from "../redux/actions/loginActions";
import LOGIN from "../redux/actions/types";

class Login extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "登录"
  });

  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
  }

  login() {
    // console.log("this props are " + this.props.actions.login());
    this.props.actions.login("Perry", "123").then(responce => {
      // console.log(responce);
      if (responce.userInfo.Basic.Role.RoleName == "PM") {
        this.props.navigation.navigate("ManagerTabNavigator");
      } else if (responce.userInfo.Basic.Role.RoleName == "PM") {
        this.props.navigation.navigate("Home");
      }
    });
    console.log("userInfo is " + this.props.userInfo);
    // this.props.navigation.navigate("ManagerTabNavigator");
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

// export default Login;

export default connect(
  state => ({
    userInfo: state.userInfo
  }),
  dispatch => ({
    actions: bindActionCreators(loginActions, dispatch)
  })
)(Login);

/*
function mapStateToProps(state) {
  return {
    userInfo: state.userInfo
  };
}

function mapDispatchToProps(dispatch) {
  return {
    login: () => {
      dispatch({
        type: "LOGIN"
      });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
*/
