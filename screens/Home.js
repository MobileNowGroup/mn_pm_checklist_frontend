import React, { Component } from "react";
import {
  View,
  Button,
  StyleSheet,
  Alert,
  ListView,
  TouchableOpacity
} from "react-native";
import HomeRow from "../views/HomeRow";
import Header from "../views/Header";
import axios from "axios";
import Icon from "react-native-vector-icons/Octicons";

class Home extends Component {
  static navigationOptions = props => {
    const { state, setParams } = props.navigation;
    if (typeof state.params == "undefined") {
      return {
        title: "MNReleaseTool",
        headerLeft: null
        // headerRight: <Button title=" + " onPress={state.params.handleNew} />
      };
    } else {
      return {
        title: "MNReleaseTool",
        headerLeft: null,
        headerRight: (
          <TouchableOpacity onPress={state.params.handleNew}>
            <Icon name="plus" size={30} color="#000" />
          </TouchableOpacity>
        )
      };
    }
  };

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      releases: [],
      dataSource: ds.cloneWithRows([]),
      projects: []
    };
    this.setSource = this.setSource.bind(this);
    this.getReleases = this.getReleases.bind(this);
    this.handleHeaderCallback = this.handleHeaderCallback.bind(this);
    this.handleRowCallback = this.handleRowCallback.bind(this);
    this.new = this.new.bind(this);
  }

  componentWillMount() {
    this.props.navigation.setParams({ handleNew: this.new });
  }

  new() {
    this.props.navigation.navigate("New", { projects: this.state.projects });
  }

  getReleases(projectId) {
    axios
      .get("http://119.23.47.185:4001/projects/" + projectId + "/releases")
      .then(response => this.setSource(response.data))
      .catch(error => console.log(error));
  }

  setSource(releases) {
    this.setState({
      releases,
      dataSource: this.state.dataSource.cloneWithRows(releases)
    });
  }

  handleHeaderCallback(projectId, projects) {
    this.getReleases(projectId);
    this.setState({
      projects
    });
  }

  handleRowCallback(releaseId, releaseTitle) {
    this.props.navigation.navigate("Detail", {
      releaseId: releaseId,
      releaseTitle: releaseTitle
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          style={styles.list}
          enableEmptySections
          dataSource={this.state.dataSource}
          renderRow={aRelease => (
            <HomeRow {...aRelease} callbackFunc={this.handleRowCallback} />
          )}
          renderSeparator={(sectionId, rowId) => (
            <View key={rowId} style={styles.seperator} />
          )}
          renderSectionHeader={() => (
            <Header callbackFunc={this.handleHeaderCallback} />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  list: {},
  seperator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#8E8E8E"
  }
});

export default Home;
