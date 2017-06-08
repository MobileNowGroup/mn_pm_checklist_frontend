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
import * as checkItemActions from "../redux/actions/checkItemActions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class NewCheckItemScreen extends Component {
  static navigationOptions = props => {
    const { state, setParams } = props.navigation;
    if (typeof state.params == "undefined") {
      return {
        title: "新建题目"
      };
    } else {
      return {
        title: "编辑题目"
      };
    }
  };

  constructor(props) {
    super(props);
    if (typeof this.props.navigation.state.params == "undefined") {
      this.state = {
        isEssential: false,
        itemTitle: "",
        itemDesc: ""
      };
    } else {
      this.state = {
        isEssential: Boolean(
          this.props.navigation.state.params.checkItem.IsMandatory
        ),
        itemTitle: this.props.navigation.state.params.checkItem.ItemTitle,
        itemDesc: this.props.navigation.state.params.checkItem.ItemDesc
      };
    }

    this.handleNewCheckItemSuccess = this.handleNewCheckItemSuccess.bind(this);
  }

  onCheck() {
    this.setState({
      isEssential: !this.state.isEssential
    });
  }

  onOK() {
    if (this.state.itemTitle.length == 0) {
      Alert.alert("请输入名称");
      return;
    }
    if (this.state.itemDesc.length == 0) {
      Alert.alert("请输入描述");
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
    Alert.alert("Success", "", [
      { text: "OK", onPress: () => this.props.navigation.goBack() }
    ]);
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container}>
        <TextInput
          style={styles.textInput}
          placeholder="请输入名称"
          placeholderTextColor="lightgray"
          onChangeText={text => this.setState({ itemTitle: text })}
          value={this.state.itemTitle}
        />
        <TextInput
          style={styles.textView}
          placeholder="请输入描述"
          placeholderTextColor="lightgray"
          multiline={true}
          onChangeText={text => this.setState({ itemDesc: text })}
          value={this.state.itemDesc}
        />
        <View style={styles.checkBoxContainer}>
          <CheckBox
            style={styles.checkbox}
            onClick={() => this.onCheck()}
            leftText="是否必需"
            isChecked={this.state.isEssential}
          />
        </View>
        <TouchableOpacity onPress={() => this.onOK()}>
          <Text style={styles.okText}>{"确定"}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  textInput: {
    height: 40,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 40,
    paddingLeft: 10,
    borderRadius: 5,
    borderColor: "gray",
    borderWidth: 1
  },
  textView: {
    height: 100,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 40,
    paddingLeft: 10,
    borderRadius: 5,
    borderColor: "gray",
    borderWidth: 1
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
  okButton: {
    alignSelf: "stretch",
    margin: 20,
    padding: 20,
    backgroundColor: "blue",
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "rgba(255, 255, 255, 0.6)"
  },
  okText: {
    width: Dimensions.get("window").width - 40,
    height: 40,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    borderColor: "black"
  }
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
