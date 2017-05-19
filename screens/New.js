//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Picker,
  KeyboardAvoidingView,
  SegmentedControlIOS,
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
    modalOpen: false
  };

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={this.state.behavior}
          style={styles.container}
        >
          <TextInput placeholder="<TextInput />" style={styles.textInput} />
          {" "}
        </KeyboardAvoidingView>

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
    // backgroundColor: '#2c3e50',
  },

  textInput: {
    borderRadius: 5,
    borderWidth: 1,
    height: 44,
    paddingHorizontal: 10
  }
});

//make this component available to the app
export default New;
