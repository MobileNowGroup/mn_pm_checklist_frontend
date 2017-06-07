import React, { Component } from "react";
import { View, Text, StyleSheet, Button, Alert, ListView } from "react-native";
import axios from "axios";
import ItemRow from "../views/ItemRow";
import SegmentedControlTab from "react-native-segmented-control-tab";

class NewDetail extends Component {
  static navigationOptions = props => {
    const { state, setParams } = props.navigation;
    return {
      title: state.params.releaseTitle,
      headerRight: <Button title={"保存"} onPress={state.params.handleSave} />
    };
  };

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      releaseId: this.props.navigation.state.params.releaseId,
      items: [],
      selectedIndex: 0,
      dataSource: ds.cloneWithRows([]),
      listViewNeedRerender: false
    };
    this.setSource = this.setSource.bind(this);
    this.handleRowCallback = this.handleRowCallback.bind(this);
    this.save = this.save.bind(this);
    this.putCheckItems = this.putCheckItems.bind(this);
  }

  componentWillMount() {
    // console.log(this.state.releaseId);
    this.getReleaseDetail(this.state.releaseId);
  }

  componentDidMount() {
    this.props.navigation.setParams({ handleSave: this.save });
    console.log(this.state.releaseId);
  }

  save() {
    this.putCheckItems();
  }

  putCheckItems() {
    var checkedItems = [];
    var uncheckedItems = [];
    for (var i = 0; i < this.state.items.length; i++) {
      var anItem = this.state.items[i];
      if (Boolean(anItem.IsChecked)) {
        checkedItems.push(anItem.ItemId);
      } else {
        uncheckedItems.push(anItem.ItemId);
      }
    }
    console.log(checkedItems, uncheckedItems);
    var url = "http://192.168.31.206:9000/checkitems";
    axios
      .put(url, {
        uncheck_items: uncheckedItems,
        check_items: checkedItems
      })
      .then(response => Alert.alert("success"))
      .catch(error => console.log(error));
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
    // for (var i = 0; i < sortedItems.length; i++) {
    //   var anItem = sortedItems[i];
    //   console.log(anItem.IsChecked);
    // }
    this.state.listViewNeedRerender = !this.state.listViewNeedRerender;
    this.setState({
      items,
      dataSource: this.state.dataSource.cloneWithRows(sortedItems)
    });
  }

  getReleaseDetail(releaseId) {
    axios
      .get("http://192.168.31.206:9000/checkitems")
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
    // this.setState({ selectedIndex: index });
    // this.setSource(this.state.items);
  };

  handleRowCallback(isChecked, itemId) {
    console.log(isChecked, itemId);
    for (var i = 0; i < this.state.items.length; i++) {
      var anItem = this.state.items[i];
      if (anItem.ItemId == itemId) {
        anItem.IsChecked = isChecked;
      }
    }
    this.setSource(this.state.items);
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          key={this.state.listViewNeedRerender}
          style={styles.list}
          enableEmptySections
          dataSource={this.state.dataSource}
          renderRow={data => (
            <ItemRow {...data} callbackFunc={this.handleRowCallback} />
          )}
          renderSeparator={(sectionId, rowId) => (
            <View key={rowId} style={styles.seperator} />
          )}
          renderSectionHeader={() => (
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

export default NewDetail;
