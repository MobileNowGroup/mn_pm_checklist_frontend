import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  KeyboardAvoidingView,
  TextInput,
  Image,
  TouchableOpacity
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

      <View style={styles.bgView}>
        <Image source={require('../img/background.jpg')} style={styles.backgroundImage}>
          <View style={styles.content}>
            <Text style={styles.logo}>- Check List -</Text>
            <View style={styles.inputContainer}>
              <TextInput underlineColorAndroid='transparent' style={styles.input} placeholder='username'>
              </TextInput>

              <TextInput secureTextEntry={true} underlineColorAndroid='transparent' style={styles.input} placeholder='password'>
              </TextInput>
            </View>

            <TouchableOpacity onPress={this.login} style={styles.buttonContainer}>
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
    flex:1
  },
  backgroundImage: {
    flex:1,
    alignSelf: 'stretch',
    width: null,
    justifyContent:'center',
  },
  content: {
    alignItems: 'center'
  },
  logo: {
    color: 'white',
    fontSize: 40,
    fontStyle: 'italic',
    fontWeight: 'bold',
    textShadowColor: '#252525',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 15,
    marginBottom: 20,
    backgroundColor: 'transparent'
  },
  inputContainer: {
    margin: 20,
    marginBottom: 0,
    padding: 20,
    paddingBottom: 10,
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },
  input: {
    fontSize: 16,
    height: 40,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 1)'
  },
  buttonContainer: {
    alignSelf: 'stretch',
    margin: 20,
    padding: 20,
    backgroundColor: 'blue',
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.6)'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
});

export default Login;
