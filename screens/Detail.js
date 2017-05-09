import React, { Component } from "react";
import { View, Text, StyleSheet, Button, Alert, ListView } from "react-native";
import axios from "axios";
import ItemRow from "../views/ItemRow";
import SegmentedControlTab from "react-native-segmented-control-tab";

const onButtonPress = () => {
  Alert.alert("Save Button has been pressed!");
};

class Detail extends Component {
  static navigationOptions = props => ({
    title: props.navigation.state.params.releaseTitle,
    headerRight: <Button title="保存" onPress={onButtonPress} />
  });

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      releaseId: this.props.navigation.state.params.releaseId,
      items: [],
      selectedIndex: 0,
      dataSource: ds.cloneWithRows([])
    };
    this.setSource = this.setSource.bind(this);
  }

  componentWillMount() {
    // console.log(this.state.releaseId);
    this.getReleaseDetail(this.state.releaseId);
  }

  setSource(items) {
    var sortedItems = [];
    console.log("index is " + this.state.selectedIndex);
    switch (this.state.selectedIndex) {
      case 0:
        sortedItems = items;
        break;
      case 1:
        for (var i = 0; i < items.length; i++) {
          var anItem = items[i];
          if (anItem.IsChecked) sortedItems.push(anItem);
        }
        break;
      case 2:
        for (var i = 0; i < items.length; i++) {
          var anItem = items[i];
          if (!anItem.IsChecked) sortedItems.push(anItem);
        }
        break;
      default:
        sortedItems = items;
        break;
    }
    console.log(items);
    this.setState({
      ...this.state,
      dataSource: this.state.dataSource.cloneWithRows(sortedItems)
    });
  }

  getReleaseDetail(releaseId) {
    axios
      .get("http://192.168.31.206:3000/release/" + releaseId)
      .then(response => this.handleReleaseDetail(response.data.CheckRecordDtl));
  }

  handleReleaseDetail(items) {
    // this.state.items = items;
    // console.log("items are " + items);
    this.setSource(items);
  }

  handleIndexChange = index => {
    this.setState({
      ...this.state,
      selectedIndex: index
    });
    this.setSource(this.state.items);
  };

  render() {
    return (
      <View style={styles.container}>
        <ListView
          style={styles.list}
          enableEmptySections
          dataSource={this.state.dataSource}
          renderRow={data => (
            <ItemRow {...data} callbackFunc={this.handleRowCallback} />
          )}
          renderSeparator={(sectionId, rowId) => (
            <View key={rowId} style={styles.seperator} />
          )}
          renderHeader={() => (
            <SegmentedControlTab
              values={["全部", "通过", "未通过"]}
              selectedIndex={this.state.selectedIndex}
              onTabPress={this.handleIndexChange}
            />
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
  list: {
    flex: 1
  },
  seperator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#8E8E8E"
  }
});

export default Detail;
