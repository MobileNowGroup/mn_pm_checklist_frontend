import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import CheckBox from "react-native-check-box";

class ItemRow extends Component {
  constructor(props) {
    super(props);
    ItemRow.propTypes = {
      callbackFunc: React.PropTypes.func
    };
    this.onCheck = this.onCheck.bind(this);
  }

  componentWillMount() {}

  onCheck() {
    this.props.callbackFunc(
      Boolean(this.props.IsChecked) ? 0 : 1,
      this.props.ItemId
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text} numberOfLines={2}>
          {this.props.ItemTitle}
        </Text>
        <CheckBox
          style={styles.checkbox}
          onClick={() => this.onCheck()}
          isChecked={Boolean(this.props.IsChecked)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    height: 60,
    flexDirection: "row"
    // alignItems: "center",
    // justifyContent: "center"
  },
  text: {
    marginLeft: 12,
    marginTop: 15,
    fontSize: 16,
    width: Dimensions.get("window").width - 60
    // textAlign: "center"
    // flexDirection: "column",
    // alignItems: "center",
    // justifyContent: "center"
  },
  checkbox: {
    flex: 1,
    padding: 15,
    height: 60
  }
});

export default ItemRow;
