import React, { Component } from "react";
import { View, Text, StyleSheet, Button, ListView } from "react-native";

class CheckItemScreen extends Component {
  static navigationOptions = props => {
    const { state, setParams } = props.navigation;
    if (typeof state.params == "undefined") {
      return {
        title: "题库",
        headerLeft: null
        // headerRight: <Button title=" + " onPress={state.params.handleNew} />
      };
    } else {
      return {
        title: "题库",
        headerLeft: null,
        headerRight: <Button title=" + " onPress={state.params.handleNew} />
      };
    }
  };

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      dataSource: ds.cloneWithRows([]),
      checkItems: []
    };
    this.new = this.new.bind(this);
  }

  componentWillMount() {
    // this.props.navigation.navigate("Login");
    this.props.navigation.setParams({ handleNew: this.new });
  }

  new() {
    // console.log(this.state.projects);
    this.props.navigation.navigate("New", { projects: this.state.projects });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>CheckItemScreen</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50"
  }
});

export default CheckItemScreen;
