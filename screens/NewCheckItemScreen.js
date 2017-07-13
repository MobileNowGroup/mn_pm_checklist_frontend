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

} from "react-native";
import CheckBox from "react-native-check-box";
import axios from "axios";
import * as checkItemActions from "../redux/actions/checkItemActions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ToastUtil from '../tool/ToastUtil';
import Button from '../app/components/Button'
import * as timeTool from "../tool/timeTool";
import { commonstyles } from '../common/CommonStyles'

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
        itemDesc: ""
    };
    // if (typeof this.props.navigation.state.params == "undefined") {
    //   this.state = {
    //     isEssential: false,
    //     itemTitle: "",
    //     itemDesc: ""
    //   };
    // } else {
    //   this.state = {
    //     isEssential: Boolean(
    //       this.props.navigation.state.params.checkItem.IsMandatory
    //     ),
    //     itemTitle: this.props.navigation.state.params.checkItem.ItemTitle,
    //     itemDesc: this.props.navigation.state.params.checkItem.ItemDesc
    //   };
    // }

    this.handleNewCheckItemSuccess = this.handleNewCheckItemSuccess.bind(this);
    this.save = this.save.bind(this);
  }

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
    var body = {
      ItemTitle: this.state.itemTitle,
      ItemDesc: this.state.itemDesc,
      IsMandatory: this.state.isEssential ? 1 : 0,
      Tags: "基础信息",
      ItemCode: this.state.itemTitle
    };

    if (typeof this.props.navigation.state.params == "undefined") {
      this.props.actions
        .newCheckItem(body)
        .then(responce => this.handleNewCheckItemSuccess(responce));
    } else {
      this.props.actions
        .updateCheckItem(
          this.props.navigation.state.params.checkItem.ItemId,
          body
        )
        .then(responce => this.handleNewCheckItemSuccess(responce))
        .catch(error => console.log(error));
    }

    /*
    let url = "http://119.23.47.185:4001/checkitem";
    axios
      .post(url, body)
      .then(responce => console.log(responce))
      .catch(error => console.log(error));
      */
  }

  handleNewCheckItemSuccess(responce) {
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
        <View style={styles.rowContainer} >
            <Text style={styles.subTitle}>输入标题:</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={(text) => {
                this.state.itemTitle = text;
                }}
              />
          </View>
        <View style={styles.updateContainer} >
            <Text style={styles.subTitle}>描述:</Text>
              <TextInput
                style={styles.textInputMutibleLine}
                ref = 'updateInput'
                multiline={true}
                onChangeText={(text) => {
                this.state.itemDesc = text;
                }}
            />
          </View>
          <View style={styles.checkBoxContainer}>
            <CheckBox
              style={styles.checkbox}
              onClick={() => this.onCheck()}
              leftText="是否必需"
              isChecked={this.state.isEssential}
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
    margin: 0,
    flexDirection: "row",
    alignItems: 'center',
    backgroundColor: 'white',
    height: 60,
    borderBottomWidth: 0.5,
    borderBottomColor: '#cccccc',
  },
  updateContainer: {
    margin: 0,
    flexDirection: "row",
    alignItems: 'center',
    backgroundColor: 'white',
    height: 100,
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
    width: 200,
    fontSize: 16,
  },
  textInputMutibleLine: {
    height: 100,
    width: 200,
    fontSize: 16,
    marginTop: 5,
    marginBottom: 5,
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

// export default NewCheckItemScreen;

export default connect(
  state => ({
    // checkItems: Object.assign({}, state.default.checkItemsReducer.checkItems)
  }),
  dispatch => ({
    actions: bindActionCreators(checkItemActions, dispatch)
  })
)(NewCheckItemScreen);
