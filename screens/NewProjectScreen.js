import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  DeviceEventEmitter,
} from "react-native";
import CheckBox from "react-native-check-box";
import axios from "axios";
import * as projectActions from "../redux/actions/projectActions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from '../app/components/Button';
import ToastUtil from '../tool/ToastUtil';
import Loading from '../app/components/Loading';

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
      isLoading: false,
      projectName: ''
    };
    this._handleResult = this._handleResult.bind(this);
    this._save = this._save.bind(this);
    this.renderLoading = this.renderLoading.bind(this);
    this._showError = this._showError.bind(this);
  }

  componentDidMount() {
    const { params } = this.props.navigation.state
    //获取上个页面的传值
    this.setState({
      projectName: params === undefined
                     ? ""
                     : params.project.ProjectName
    })
  }

  componentWillUnmount() {
     //清空定时器
    clearTimeout(this.timer);
  }

  /**
   * 
   * 保存
   * @memberof NewProjectScreen
   */
  _save() {

    if (this.state.projectName.length == 0 || this.state.projectName.replace(/\s+/g, '') === '') {
      ToastUtil.showShort('请输入项目名');
      return;
    }
  
    const { params } = this.props.navigation.state;
    const { actions } = this.props;

    let body = {
      ProjectName: this.state.projectName,
      ProjectCode: this.state.projectName
    };
    //显示加载动画
    this.setState({
      isLoading: true,
    })

    if (params === undefined) {
      //创建项目
      actions
        .newProject(body,this.state.isLoading)
        .then(responce => this._handleResult(responce))
        .catch(error => this._showError(error));

    } else {
      //编辑项目
      actions
        .updateProject(params.project.ProjectId,body,this.state.isLoading)
        .then(responce => this._handleResult(responce))
        .catch(error => this._showError(error));
    }

  }

  
  /**
   * 
   * 处理返回结果
   * @param {any} response 
   * @memberof NewProjectScreen
   */
  _handleResult(response) {
    this.setState({
      isLoading: false,
    })
    if (response.editResult === true || response.createResult === true) {
        //发送刷新项目列表成功的通知
      DeviceEventEmitter.emit('ProjectRefreshNotification');
      this.timer =  setTimeout(() => {
         ToastUtil.showShort('操作成功');
         this.props.navigation.goBack();
      },500);
    }else {
        ToastUtil.showShort('操作失败，请重试');
    }
  }

   /**
   * 
   * 显示错误信息
   * @param {any} error 
   * @memberof NewProjectScreen
   */
  _showError(error) {
    //停止加载动画
    this.setState({
      isLoading: false,
    })
    //显示错误信息
    ToastUtil.showShort(error);
  }

  /*
  加载动画
  */
  renderLoading() {
    return <Loading visible={this.state.isLoading} size='large' color='white'/>;
  }

  render() {
    return (
      <View style={styles.container}>
      {this.renderLoading()}
        <View style={styles.nameInputContainer} >
            <Text style={styles.subTitle}>输入项目名:</Text>
              <TextInput
                placeholder='项目名称'
                style={styles.textInput}
                value={this.state.projectName}
                onChangeText={(text) => {
                  this.setState({
                    projectName: text,
                  });
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
