import React, { Component } from "react";
import { View, ListView, Text, StyleSheet, Alert } from "react-native";
import HeaderRow from "../views/HeaderRow";
import axios from "axios";

class Header extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      projects: [],
      dataSource: ds.cloneWithRows([])
    };
    Header.propTypes = {
      callbackFunc: React.PropTypes.func
    };
    this.setSource = this.setSource.bind(this);
    this.handleCallback = this.handleCallback.bind(this);
    this.getProjects = this.getProjects.bind(this);
  }

  componentWillMount() {
    this.getProjects();
  }

  getProjects() {
    axios
      .get("http://192.168.31.206:9000/projects")
      .then(response => this.setSource(response.data))
      .catch(error => console.log(error));
  }

  setSource(projects) {
    this.setState(
      {
        projects,
        dataSource: this.state.dataSource.cloneWithRows(projects)
      },
      function() {
        this.handleCallback(projects[0].ProjectId);
      }
    );
  }

  handleCallback(projectId) {
    this.props.callbackFunc(projectId, this.state.projects);
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          horizontal
          style={styles.list}
          enableEmptySections
          dataSource={this.state.dataSource}
          renderRow={data => (
            <HeaderRow {...data} callbackFunc={this.handleCallback} />
          )}
          renderSeparator={(sectionId, rowId) => (
            <View key={rowId} style={styles.seperator} />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: "#fff"
  },
  list: {
    flex: 1,
    padding: 12,
    flexDirection: "column"
  }
});

export default Header;
