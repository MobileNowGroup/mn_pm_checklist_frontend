import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import Swipeout from "react-native-swipeout";
import * as projectActions from "../redux/actions/projectActions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class ProjectRow extends Component {
  constructor(props) {
    super(props);
    this.handlePress = this.handlePress.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
  }

  componentWillMount() {}

  handlePress() {
    // this.props.callbackFunc(this.props.ReleaseId, this.props.ReleaseTitle);
  }

  deleteRow() {
    console.log("rowId is " + this.props.rowID);
    this.props.actions.deleteProject(this.props.ProjectId, this.props.rowID);
  }

  render() {
    let swipeBtns = [
      {
        text: "Delete",
        backgroundColor: "red",
        underlayColor: "rgba(0, 0, 0, 1, 0.6)",
        onPress: () => {
          this.deleteRow();
        }
      }
    ];
    // const { counter, increment, decrement } = this.props;
    return (
      // <TouchableHighlight underlayColor="lightgray" onPress={this.handlePress}>
      (
        <Swipeout
          // style={styles.container}
          buttonWidth={60}
          // sensitivity={100}
          right={swipeBtns}
          autoClose="true"
          backgroundColor="transparent"
        >
          <TouchableHighlight
            underlayColor="lightgray"
            onPress={this.handlePress}
          >
            <View style={styles.container}>
              <Text style={styles.text} numberOfLines={1}>
                {this.props.ProjectName}
              </Text>
              <Text style={styles.subText}>
                {"Code: " + this.props.ProjectCode}
              </Text>
              <Text style={styles.subText}>
                {"创建时间：" + this.props.UpdatedAt}
              </Text>
            </View>
          </TouchableHighlight>
        </Swipeout>
      )
      // </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    height: 80,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start"
  },
  text: {
    height: 25,
    marginLeft: 12,
    fontSize: 16,
    marginTop: 10,
    fontWeight: "bold"
  },
  subText: {
    fontSize: 12,
    marginLeft: 12,
    marginTop: 2
  }
});

// export default CheckItemRow;

export default connect(
  state => ({
    // state: state.checkItems
  }),
  dispatch => ({
    actions: bindActionCreators(projectActions, dispatch)
  })
)(ProjectRow);
