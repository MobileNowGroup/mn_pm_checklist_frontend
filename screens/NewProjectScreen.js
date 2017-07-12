import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert
} from "react-native";
import CheckBox from "react-native-check-box";
import axios from "axios";
import * as projectActions from "../redux/actions/projectActions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from '../app/components/Button';
import ToastUtil from '../tool/ToastUtil';

class NewProjectScreen extends Component {
  static navigationOptions = props => {
    const { state, setParams } = props.navigation;
    return {
      title: state.params == undefined 
               ? "新建项目"
               : "编辑项目"
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      projectName: ''
    };
    this._handleResult = this._handleResult.bind(this);
    this._save = this._save.bind(this);
  }

  componentDidMount() {
    //获取上个页面的传值
    this.setState({
      projectName: this.props.navigation.state.params === undefined
                     ? ""
                     : this.props.navigation.state.params.project.ProjectName
    })
  }

  /**
   * 
   * 保存
   * @memberof NewProjectScreen
   */
  _save() {
    if (this.state.projectName.length == 0) {
      ToastUtil.showShort('请输入项目名');
      return;
    }

    var body = {
      ProjectName: this.state.projectName,
      ProjectCode: this.state.projectName
    };

    if (typeof this.props.navigation.state.params == "undefined") {
      this.props.actions
        .newProject(body)
        .then(responce => this.handleNewProjectSuccess(responce));
    } else {
      this.props.actions
        .updateProject(
          this.props.navigation.state.params.project.ProjectId,
          body
        )
        .then(responce => this._handleResult(responce));
      // .catch(error => console.log(error));
    }

  }
  
  /**
   * 
   * 处理返回结果
   * @param {any} response 
   * @memberof NewProjectScreen
   */
  _handleResult(response) {
    if (typeof responce == "undefined") {
      return;
    }
    Alert.alert("Success", "", [
      { text: "OK", onPress: () => this.props.navigation.goBack() }
    ]);
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.nameInputContainer} >
            <Text style={styles.subTitle}>输入项目名:</Text>
              <TextInput
                placeholder='项目名称'
                style={styles.textInput}
                value={this.state.projectName}
                onChangeText={(text) => {
                this.state.projectName = text;
                }}
              />
          </View>
          <Button 
            onPress={this._save}
            text='保 存'
            style={styles.buttonText}
            containerStyle={styles.buttonContainer}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4"
  },
  nameInputContainer: {
    margin: 0,
    marginTop: 5,
    flexDirection: "row",
    alignItems: 'center',
    backgroundColor: 'white',
    height: 60,
    borderBottomWidth: 0.5,
    borderBottomColor: '#cccccc',
    borderTopColor: '#cccccc',
  },
  textInput: {
    width: 200,
    fontSize: 16,
  },
  subTitle: {
    marginLeft: 20,
    width: 95,
    fontSize: 14,
    textAlign: "left",
    color: '#404040',
  },
 
  checkbox: {
    // flex: 1,
    padding: 0,
    width: 100,
    height: 60
    // backgroundColor: "#383748"
    // justifyContent: "flex-start"
    // height: 60
  },
  checkBoxContainer: {
    // flex: 1,
    // justifyContent: "flex-start",
    // alignItems: "flex-start",
    width: Dimensions.get("window").width - 40,
    height: 60,
    // marginLeft: 20,
    // marginRight: 20,
    // backgroundColor: "#142523",
    marginTop: 10
  },
  buttonContainer: {
    alignSelf: "stretch",
    margin: 10,
    marginTop: 5,
    marginBottom: 10,
    padding: 15,
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
});

// export default NewCheckItemScreen;

export default connect(
  state => ({
    // checkItems: Object.assign({}, state.default.checkItemsReducer.checkItems)
  }),
  dispatch => ({
    actions: bindActionCreators(projectActions, dispatch)
  })
)(NewProjectScreen);
