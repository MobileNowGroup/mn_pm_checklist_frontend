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
    title: "新增Release"
  });
  constructor(props) {
    super(props);
    this.state = {
      behavior: "padding",
      selectedName: "",
      showPicker: 0,
      releaseId: 0
    };
    // this.projectDidClick = this.projectDidClick.bind(this);
  }
  // state = {
  //   behavior: "padding",
  //   selectedName: "",
  //   showPicker: 1
  // };

  showPicker(show) {
    this.setState({
      showPicker: show
    });
  }
  nextBtnClick(releaseId) {
    this.props.navigation.navigate("NewDetail", {
      releaseId: this.state.releaseId
    });
  }

  render() {
    // alert(this.props.navigation.state.params.projects.count);
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.rowContainer}
          behavior={this.state.behavior}
        >
          <Text style={styles.subTitle}>请选择APP:</Text>
          <TextInput
            placeholder="请选择"
            style={styles.textInput}
            value={this.state.selectedName}
            onTouchStart={() => this.showPicker(1)}
          />
        </KeyboardAvoidingView>
        <KeyboardAvoidingView
          style={styles.rowContainer}
          behavior={this.state.behavior}
        >
          <Text style={styles.subTitle}>请输入版本:</Text>
          <TextInput
            placeholder="TextInput"
            style={styles.textInput}
            onTouchStart={() => this.showPicker(0)}
          />
        </KeyboardAvoidingView>

        <KeyboardAvoidingView
          style={styles.rowContainer}
          behavior={this.state.behavior}
        >
          <Text style={styles.subTitle}>更新内容:</Text>
          <TextInput
            style={styles.textInputMutibleLine}
            multiline={true}
            onTouchStart={() => this.showPicker(0)}
          />
        </KeyboardAvoidingView>
        <KeyboardAvoidingView
          style={styles.rowContainer}
          behavior={this.state.behavior}
        >
          <Button onPress={() => this.nextBtnClick()} title="下一步" />
        </KeyboardAvoidingView>

        {this.state.showPicker === 1
          ? <View state={styles.pickerContainer}>
              <Picker
                selectedValue={this.state.selectedName}
                onValueChange={(value, label) =>
                  this.setState({ selectedName: label, releaseId: value })}
              >
                {this.props.navigation.state.params.projects.map(function(
                  project
                ) {
                  console.log(project);
                  return (
                    <Picker.Item
                      label={project.ProjectName}
                      value={project.value}
                    />
                  );
                })}
              </Picker>
            </View>
          : null}
      </View>
    );
  }
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
  textInputMutibleLine: {
    borderRadius: 5,
    borderWidth: 1,
    height: 120,
    width: 200,
    paddingHorizontal: 10
  },
  rowContainer: {
    //flex: 2,
    padding: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  pickerContainer: {
    padding: 20
  },
  subTitle: {
    margin: 10,
    width: 100,
    fontSize: 16,
    textAlign: "right"
  }
});

//make this component available to the app
export default New;
