import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import Swipeout from "react-native-swipeout";
import * as projectActions from "../redux/actions/projectActions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as timeTool from "../tool/timeTool";

class ProjectRow extends Component {
  constructor(props) {
    super(props);
    ProjectRow.propTypes = {
      callbackFunc: React.PropTypes.func
    };
    this.handlePress = this.handlePress.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
  }

  componentWillMount() {}

  handlePress() {
    this.props.callbackFunc(this.props.rowID);
  }

  deleteRow() {
    this.props.actions
      .deleteProject(this.props.ProjectId, this.props.rowID)
      .then(responce => console.log("res is " + responce))
      .catch(error => console.log("error is " + error));
  }

  render() {
    let swipeBtns = [
      {
        text: "Delete",
        backgroundColor: "red",
        underlayColor: "rgba(0, 0, 0, 0.6)",
        onPress: () => {
          this.deleteRow();
        }
      }
    ];
    return (

      <Swipeout
        // style={styles.container}
        buttonWidth={60}
        // sensitivity={100}
        right={swipeBtns}
        autoClose={true}
        backgroundColor="transparent"
      >
        <TouchableHighlight
          underlayColor="lightgray"
          onPress={this.handlePress}
        >
          <View style={styles.container}>
            <Text style={styles.text} numberOfLines={1}> {this.props.ProjectName}</Text>
            <Text style={styles.subText}>
              {"更新时间：" + timeTool.convertTimeStampToDate(this.props.UpdatedAt)}
            </Text>
          </View>
        </TouchableHighlight>
      </Swipeout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
   // height: 80,
    flexDirection: "column",
    // alignItems: "flex-start",
    // justifyContent: "flex-start"
  },
  text: {
   // height: 25,
    marginLeft: 15,
    fontSize: 16,
    marginTop: 10,
    color: '#333'
   // fontWeight: "bold"
  },
  subText: {
    fontSize: 12,
    marginLeft: 18,
    marginTop: 5,
    marginBottom: 5,
    color: "#666",
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
