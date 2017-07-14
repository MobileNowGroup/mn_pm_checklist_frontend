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
  Keyboard,

} from "react-native";
import CheckBox from "react-native-check-box";
import axios from "axios";
import { bindActionCreators } from 'redux';
import * as DetailCreators from '../redux/actions/checkItemActions';
import { connect } from "react-redux";
import ToastUtil from '../tool/ToastUtil';
import Button from '../app/components/Button'
import * as timeTool from "../tool/timeTool";
import { commonstyles } from '../common/CommonStyles'
import * as Notification from '../app/constant/notification';

class NewCheckItemScreen extends Component {
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
        isEssential: false,
        itemTitle: "",
        itemDesc: "",
        isLoading: false,
    };

    this.save = this.save.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.renderLoading = this.renderLoading.bind(this);
    this.handleResult = this.handleResult.bind(this);
    this.showError = this.showError.bind(this);

  }

  componentDidMount() {
    //获取上个页面的返回值
    const { params } = this.props.navigation.state;
    this.setState({
      isEssential: params === undefined 
                    ? false
                    : Boolean(params.checkItem.IsMandatory),
      itemTitle: params === undefined 
                    ? ""
                    : params.checkItem.ItemTitle,
      itemDesc: params === undefined 
                    ? ""
                    : params.checkItem.ItemDesc,
    })
  }

  /**
   * 
   * check按钮的点击事件
   * @memberof NewCheckItemScreen
   */
  onCheck() {
    this.setState({
      isEssential: !this.state.isEssential
    });
  }
  
  /**
   * 完成
   * 
   * @returns 
   * @memberof NewCheckItemScreen
   */
  save() {

    if (this.state.itemTitle.length == 0 || this.state.itemTitle.replace(/\s+/g, '') === '') {
      ToastUtil.showShort('请输入标题');
      return;
    }
    if (this.state.itemDesc.length == 0 || this.state.itemDesc.replace(/\s+/g, '') === '') {
      ToastUtil.showShort('请输入描述');
      return;
    }

    Keyboard.dismiss();

    const { params } = this.props.navigation.state;
    const { newActions } = this.props;

    let body = {
      ItemTitle: this.state.itemTitle,
      ItemDesc: this.state.itemDesc,
      IsMandatory: this.state.isEssential ? 1 : 0,
      Tags: "基础信息",
      ItemCode: params === undefined
                 ? this.state.itemTitle
                 : params.checkItem.ItemCode,
    };
    
    //开始加载动画
    this.setState({
      isLoading: true,
    });

    if (params === undefined) {
      //新建题目
      newActions
        .newCheckItem(body,this.state.isLoading)
        .then(response => this.handleResult(response))
        .catch(error => this.showError(error));

    } else {
      //编辑题目
      newActions
        .updateCheckItem(params.checkItem.ItemId,body,this.state.isLoadin)
        .then(response => this.handleResult(response))
        .catch(error => this.showError(error));
    }
  }

  /**
   * 
   * 处理返回结果
   * @param {any} response 
   * @memberof NewCheckItemScreen
   */
  handleResult(response) {
    //停止加载动画
    this.setState({
      isLoading: false,
    })
    if (response.editResult === true || response.createResult === true) {
        //发送刷新项目列表成功的通知
      DeviceEventEmitter.emit(Notification.CheckItemRefreshNotification);
      this.timer = setTimeout(() => {
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
   * @memberof NewCheckItemScreen
   */
  showError(error) {
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
    return <Loading visible={this.state.isLoading} size='large' color='white' text='保存中...'/>;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.rowContainer} >
            <Text style={styles.subTitle}>输入标题:</Text>
              <View style = {styles.flex}>
                <TextInput
                  style={styles.textInput}
                  autoCorrect={false}
                  autoCapitalize='none'
                  value={this.state.itemTitle}
                  onChangeText={(text) => {
                     this.setState({
                      itemTitle: text,
                    })
                  }}
                />
              </View>
          </View>
        <View style={styles.updateContainer} >
            <Text style={styles.subTitle}>描述:</Text>
              <View style = {styles.flex}>
                <TextInput
                  autoCorrect={false}
                  autoCapitalize='none'
                  style={styles.textInputMutibleLine}
                  value={this.state.itemDesc}
                  multiline={true}
                  onChangeText={(text) => {
                    this.setState({
                      itemDesc: text,
                    })
                  }}
                 />
              </View>
          </View>
          <View style={styles.checkBoxContainer}>
            <CheckBox
              style={styles.checkbox}
              onClick={() => this.onCheck()}
              leftText="是否必需"
              isChecked={!this.state.isEssential}
              leftTextStyle={{color: '#404040',fontSize: 14}}
            />
        </View>
          <Button 
            onPress={this.save}
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
    flexDirection: "column",
    // justifyContent: "flex-start",
    // alignItems: "center",
    backgroundColor: "#f4f4f4"
  },
  rowContainer: {
   // flex: 1,
    margin: 0,
    flexDirection: "row",
    alignItems: 'center',
    backgroundColor: 'white',
    height: 60,
    borderBottomWidth: 0.5,
    borderBottomColor: '#cccccc',
  },
  flex: {
    flex: 1,
  },
  updateContainer: {
    margin: 0,
    flexDirection: "row",
    alignItems: 'center',
    backgroundColor: 'white',
    height: 110,
    borderBottomWidth: 0.5,
    borderBottomColor: '#cccccc',
  },
  subTitle: {
    marginLeft: 20,
    width: 80,
    fontSize: 14,
    textAlign: "left",
    color: '#404040',
  },
  textInput: {
    paddingLeft: 5,
    marginLeft: 0,
    marginRight: 15,
    fontSize: 16,
    height: 60,
  },
  textInputMutibleLine: {
    height: 100,
    fontSize: 16,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 0,
    marginRight: 15,
  },
  buttonContainer: {
    alignSelf: "stretch",
    margin: 20,
    marginBottom: 0,
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
    marginBottom: 0,
  },
  checkBoxContainer: {
    height: 30,
    marginLeft: 20,
    marginTop: 10,
  },
  checkbox: {
    padding: 0,
    width: 100,
    height: 30,
  },
});

const mapStateToProps = (state) => {
  const { CheckItem } = state;
  return {
    CheckItem
  };
};

const mapDispatchToProps = (dispatch) => {
  const newActions = bindActionCreators(DetailCreators, dispatch);
  return {
    newActions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewCheckItemScreen);