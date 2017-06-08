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

class NewProjectScreen extends Component {
  static navigationOptions = {
    title: "新建项目"
  };
  static navigationOptions = props => {
    const { state, setParams } = props.navigation;
    if (typeof state.params == "undefined") {
      return {
        title: "新建项目"
      };
    } else {
      return {
        title: "编辑项目"
      };
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      projectName: typeof this.props.navigation.state.params == "undefined"
        ? ""
        : this.props.navigation.state.params.project.ProjectName
    };
    this.handleNewProjectSuccess = this.handleNewProjectSuccess.bind(this);
  }

  componentWillMount() {}

  onOK() {
    if (this.state.projectName.length == 0) {
      Alert.alert("请输入名称");
      return;
    }

    var body = {
      ProjectName: this.state.projectName,
      ProjectCode: this.state.projectName
    };

    if (typeof this.props.navigation.state.params == "undefined") {
      this.props.actions
        .newProject(body)
        .then(responce => this.handleNewProjectSuccess());
    } else {
    }

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
          value={this.state.projectName}
          onChangeText={text => this.setState({ projectName: text })}
        />
        <TouchableOpacity
          // style={styles.okButton}
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
    marginBottom: 40,
    paddingLeft: 10,
    borderRadius: 8,
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
    // backgroundColor: "blue"
  }
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
