import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  KeyboardAvoidingView,
  TextInput,
  Image,
  TouchableOpacity,
  Alert
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
    this.state = {
      userName: "18684909663",
      userPwd: "123456"
    };
    this.login = this.login.bind(this);
  }

  // 定义函数
  updateNum(newText) {
    this.setState(state => {
      return {
        userName: newText
      };
    });
  }
  // 定义函数
  updatePW(newText) {
    this.setState(() => {
      // 用不到的参数也可以不用写
      return {
        userPwd: newText
      };
    });
  }

  login() {
    if (this.state.userName.length < 6) {
      Alert.alert("温馨提醒", "用户名必须大于6位!");
      return;
    } else if (this.state.userPwd.length < 6) {
      Alert.alert("温馨提醒", "密码必须大于6位!");
      return;
    }
    // console.log("this props are " + this.props.actions.login());
    this.props.actions.login("Perry", "123").then(responce => {
      // console.log(responce);
      if (responce.userInfo.Basic.Role.RoleName == "PM") {
        this.props.navigation.navigate("ManagerTabNavigator");
      } else if (responce.userInfo.Basic.Role.RoleName == "PM") {
        this.props.navigation.navigate("Home");
      }
    });
  }

  render() {
    return (
      <View style={styles.bgView}>
        <Image
          source={require("../img/background.jpg")}
          style={styles.backgroundImage}
        >
          <View style={styles.content}>
            <Text style={styles.logo}>- Check List -</Text>
            <View style={styles.inputContainer}>
              <TextInput
                underlineColorAndroid="transparent"
                style={styles.input}
                placeholder="username"
                onChangeText={newText => this.updateNum(newText)}
                value={this.state.userName}
              />

              <TextInput
                secureTextEntry={true}
                underlineColorAndroid="transparent"
                style={styles.input}
                placeholder="password"
                onChangeText={newText => this.updatePW(newText)}
                value={this.state.userPwd}
              />
            </View>

            <TouchableOpacity
              onPress={this.login}
              style={styles.buttonContainer}
            >
              <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>
          </View>
        </Image>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bgView: {
    flex: 1
  },
  backgroundImage: {
    flex: 1,
    alignSelf: "stretch",
    width: null,
    justifyContent: "center"
  },
  content: {
    alignItems: "center"
  },
  logo: {
    color: "white",
    fontSize: 40,
    fontStyle: "italic",
    fontWeight: "bold",
    textShadowColor: "#252525",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 15,
    marginBottom: 20,
    backgroundColor: "transparent"
  },
  inputContainer: {
    margin: 20,
    marginBottom: 0,
    padding: 20,
    paddingBottom: 10,
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "rgba(255, 255, 255, 0.2)"
  },
  input: {
    fontSize: 16,
    height: 40,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "rgba(255, 255, 255, 1)"
  },
  buttonContainer: {
    alignSelf: "stretch",
    margin: 20,
    padding: 20,
    backgroundColor: "blue",
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "rgba(255, 255, 255, 0.6)"
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center"
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
