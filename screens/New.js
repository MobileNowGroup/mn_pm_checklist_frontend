//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  KeyboardAvoidingView,
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

  render() {
    console.log(this.props.navigation.state.params.projects);
    return (
      <View style={styles.container}>
        <Text>New</Text>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50"
  }
});

//make this component available to the app
export default New;
