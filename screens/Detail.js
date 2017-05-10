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
    this.handleRowCallback = this.handleRowCallback.bind(this);
  }

  componentWillMount() {
    // console.log(this.state.releaseId);
    this.getReleaseDetail(this.state.releaseId);
  }

  setSource(items) {
    var sortedItems = [];
    switch (this.state.selectedIndex) {
      case 0:
        sortedItems = items;
        break;
      case 1:
        for (var i = 0; i < items.length; i++) {
          var anItem = items[i];
          if (Boolean(anItem.IsChecked)) sortedItems.push(anItem);
        }
        break;
      case 2:
        for (var i = 0; i < items.length; i++) {
          var anItem = items[i];
          if (!Boolean(anItem.IsChecked)) sortedItems.push(anItem);
        }
        break;
      default:
        sortedItems = items;
        break;
    }
    for (var i = 0; i < sortedItems.length; i++) {
      var anItem = sortedItems[i];
      console.log(anItem.IsChecked);
    }
    var newSortedItems = sortedItems.slice();
    for (var i = 0; i < newSortedItems.length; i++) {
      newSortedItems[i] = {
        IsChecked: newSortedItems[i].IsChecked,
        ItemId: newSortedItems[i].ItemId,
        ItemTitle: newSortedItems[i].ItemTitle
      };
    }
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.setState({
      items,
      dataSource: ds.cloneWithRows(newSortedItems)
    });
  }
  getReleaseDetail(releaseId) {
    axios
      .get("http://192.168.31.206:3000/release/" + releaseId)
      .then(response => this.handleReleaseDetail(response.data.CheckRecordDtl));
  }

  handleReleaseDetail(items) {
    this.setSource(items);
  }

  handleIndexChange = index => {
    // set state is asynchronous
    this.setState({ selectedIndex: index }, function() {
      this.setSource(this.state.items);
    });
  };

  handleRowCallback(isChecked, itemId) {
    console.log(isChecked, itemId);
    for (var i = 0; i < this.state.items.length; i++) {
      var anItem = this.state.items[i];
      if (anItem.ItemId == itemId) {
        // must copy item to get listview updated
        // var items = this.state.items;
        // var anItemCopy = Object.assign({}, anItem);
        anItem.IsChecked = isChecked;
        // var removedItems = items.splice(i, 1, anItemCopy);
        // this.setState({
        //   items
        // });
      }
    }
    this.setSource(this.state.items);
  }

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
