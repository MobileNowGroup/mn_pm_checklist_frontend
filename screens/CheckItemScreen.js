import React, { Component } from "react";
import { View, Text, StyleSheet, Button, ListView } from "react-native";
import axios from "axios";
import CheckItemRow from "../views/CheckItemRow";
import { bindActionCreators } from "redux";
import * as checkItemActions from "../redux/actions/checkItemActions";
import { connect } from "react-redux";

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
      checkItems: [],
      dataSource: ds.cloneWithRows([])
    };
    this.new = this.new.bind(this);
    this.getCheckItems = this.getCheckItems.bind(this);
    this.handleCheckItems = this.handleCheckItems.bind(this);
    this.setSource = this.setSource.bind(this);
  }

  componentWillMount() {
    this.props.navigation.setParams({ handleNew: this.new });
  }

  componentDidMount() {
    this.getCheckItems();
  }

  new() {
    this.props.navigation.navigate("New", { projects: this.state.projects });
  }

  getCheckItems() {
    axios
      .get("http://192.168.31.206:8080/checkitems")
      .then(responce => this.handleCheckItems(responce.data))
      .catch(error => console.log(error));
  }

  handleCheckItems(checkItems) {
    this.setSource(checkItems);
  }

  setSource(checkItems) {
    console.log("check items are " + checkItems[0].ItemTitle);
    this.setState({
      checkItems,
      dataSource: this.state.dataSource.cloneWithRows(checkItems)
    });
  }

  render() {
    const { state, actions } = this.props;
    return (
      <View style={styles.container}>
        <ListView
          style={styles.list}
          enableEmptySections
          removeClippedSubviews={false}
          dataSource={this.state.dataSource}
          renderRow={aCheckItem => <CheckItemRow {...aCheckItem} />}
          renderSeparator={(sectionId, rowId) => (
            <View key={rowId} style={styles.seperator} />
          )}
          // renderSectionHeader={() => (
          //   <Header callbackFunc={this.handleHeaderCallback} />
          // )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  list: {
    backgroundColor: "#fff"
  },
  seperator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#8E8E8E"
  }
});

export default CheckItemScreen;
