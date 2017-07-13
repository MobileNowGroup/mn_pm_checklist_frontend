import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as loginActions from "../redux/actions/loginActions";
import LOGIN from "../redux/actions/types";
import axios from "axios";
import * as projectActions from "../redux/actions/projectActions";
import LoadingView from '../app/components/LoadingView';
import Loading from '../app/components/Loading';
import Button  from '../app/components/Button';


class Login extends Component {
  static navigationOptions = ({ navigation }) => ({
    // title: "登录"
    header: null
  });

  constructor(props) {
    super(props);
    this.state = {
      userName: "1234567",
      userPwd: "1234567",
      animating: false,
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
    console.log('登录了登录了');
    // console.log("this props are " + this.props.login());
    this.setState({animating:true})
    this.props
      .login("Perry", "123")
      .then(responce => {
        this.props.navigation.goBack();
        this.setState({animating:false})
      })
      .catch(error => console.log(error));
  }

  render() {
    return (
      <View style={styles.bgView}>
        <Loading visible={this.state.animating}
          size='large'
          color='white'
          />
          <View style={styles.content}>
            <Image source={require('../img/logo.png')} style={styles.logo} />
            <View style={styles.inputContainer}>
              <Image source={require('../img/username_icon.png')} style={styles.icon} />
              <View style={styles.line} />
              <TextInput
                underlineColorAndroid="transparent"
                style={styles.input}
                placeholder="用户名"
                onChangeText={newText => this.updateNum(newText)}
                value={this.state.userName}
              />
            </View>
            <View style={styles.inputContainer}>
              <Image source={require('../img/password_icon.png')} style={styles.icon} />
              <View style={styles.line} />
              <TextInput
                secureTextEntry={true}
                underlineColorAndroid="transparent"
                style={styles.input}
                placeholder="密码"
                onChangeText={newText => this.updatePW(newText)}
                value={this.state.userPwd}
              />
            </View>

            <Button 
              onPress={this.login}
              text='登录'
              style={styles.buttonText}
              containerStyle={styles.buttonContainer}
              />
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bgView: {
    flex: 1,
    backgroundColor: 'white',
  },
  backgroundImage: {
    flex: 1,
    // alignSelf: "stretch",
    // width: null,
    // justifyContent: "center"
  },
  content: {
    alignItems: "center"
  },
  logo: {
    alignItems: 'center',
    marginTop: 140,
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 20,
    margin: 60,
    marginBottom: 0,
  //  padding: 20,
   // paddingBottom: 10,
    alignSelf: "stretch",
    borderWidth: 2,
    borderColor: "#51c4d4",
    borderRadius: 8,
    height: 42,
  },
  icon: {
     margin: 10,
     marginTop: 8,
  },
  line: {
    margin: 10,
    marginLeft: 0,
    marginTop: 8,
    backgroundColor: "#78e9ff",
    width: 1,
    height: 24,
  },
  input: {
    fontSize: 16,
    height: 40,
    marginRight: 10,
    marginLeft: 0,
    width: Dimensions.get('window').width - 180 ,
    color: '#828282',
  },
  buttonContainer: {
    alignSelf: "stretch",
    margin: 20,
    padding: 20,
  },
  buttonText: {
    justifyContent: 'center',
    paddingTop: 12,
    fontSize: 15,
    textAlign: "center",
    backgroundColor: '#78e9ff',
    color: '#3f7a86',
    //设置圆角
    borderRadius: 21,
    overflow: 'hidden',
    height: 42,
  },
  centering:{
    alignItems:'center',
    justifyContent:'center',
    padding:8,
  },
  transparent:{
    backgroundColor:'blue',
  }
});

function mapStateToProps(state) {
  return {
    userInfo: state.Login.userInfo,
    isTokenExpired: state.Project.isTokenExpired
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    Object.assign(loginActions, projectActions),
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
