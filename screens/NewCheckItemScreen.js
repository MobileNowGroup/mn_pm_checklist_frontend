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
  constructor(props) {
    super(props);
    this.state = {
      isEssential: false,
      itemTitle: "",
      itemDesc: ""
    };
    this.handleNewProjectSuccess = this.handleNewProjectSuccess.bind(this);
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
      Tags: "基础信息"
    };

    this.props.actions
      .newCheckItem(body)
      .then(responce => this.handleNewProjectSuccess());
    /*
    let url = "http://119.23.47.185:4001/checkitem";
    axios
      .post(url, body)
      .then(responce => console.log(responce))
      .catch(error => console.log(error));
      */
  }

  handleNewProjectSuccess() {
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
          onChangeText={text => this.setState({ itemTitle: text })}
          //   value={this.state.text}
        />
        <TextInput
          style={styles.textView}
          placeholder="请输入描述"
          multiline={true}
          onChangeText={text => this.setState({ itemDesc: text })}
          //   value={this.state.text}
        />
        <View style={styles.checkBoxContainer}>
          <CheckBox
            style={styles.checkbox}
            onClick={() => this.onCheck()}
            leftText="是否必需"
            // leftTextStyle={{ textColor: "#000" }}
            // rightText={"saffsda"}
            //   style={styles.checkbox}
            isChecked={this.state.isEssential}
          />
        </View>
        <TouchableOpacity
          style={styles.okButton}
          //   underlayColor="#763563"
          onPress={() => this.onOK()}
        >
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
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center"
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
