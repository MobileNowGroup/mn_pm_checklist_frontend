//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  KeyboardAvoidingView,
  Picker,
  TextInput
} from "react-native";

// create a component
class New extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "MNReleaseTool",
    headerRight: (
      <Button title="保存" onPress={() => navigation.navigate("New")} />
    )
  });
  state = {
    behavior: "padding",
    language: "java"
  };

  render() {
    console.log(this.props.navigation.state.params.projects);
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.rowContainer}
          behavior={this.state.behavior}
        >
          <Text>请选择APP:</Text>
          <TextInput
            placeholder="请选择"
            style={styles.textInput}
            onTouchStart={this.projectDidClick}
          />
        </KeyboardAvoidingView>
        <KeyboardAvoidingView
          style={styles.rowContainer}
          behavior={this.state.behavior}
        >
          <Text>请输入版本:</Text>
          <TextInput placeholder="TextInput" style={styles.textInput} />
        </KeyboardAvoidingView>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={this.state.language}
            onValueChange={lang => this.setState({ language: lang })}
          >
            <Picker.Item label="Java" value="java" />
            <Picker.Item label="JavaScript" value="js" />
          </Picker>
        </View>
      </View>
    );
  }

  projectDidClick() {}
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
    // backgroundColor: "#2c3e50"
  },
  textInput: {
    borderRadius: 5,
    borderWidth: 1,
    height: 44,
    width: 200,
    paddingHorizontal: 10
  },
  pickerContainer: {},
  rowContainer: {
    padding: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
});

//make this component available to the app
export default New;
