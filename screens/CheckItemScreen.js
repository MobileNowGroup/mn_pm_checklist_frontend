import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ListView,
  TouchableOpacity
} from "react-native";
import axios from "axios";
import CheckItemRow from "../views/CheckItemRow";
import { bindActionCreators } from "redux";
import * as checkItemActions from "../redux/actions/checkItemActions";
import * as loginActions from "../redux/actions/loginActions";
import { connect } from "react-redux";
import NewCheckItemScreen from "./NewCheckItemScreen";
import Icon from "react-native-vector-icons/Octicons";

class CheckItemScreen extends Component {
  static navigationOptions = props => {
    const { state, setParams } = props.navigation;
    if (typeof state.params == "undefined") {
      return {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="checklist" size={30} color="#000" />
        ),
        title: "题库",
        headerLeft: null
        // headerRight: <Button title=" + " onPress={state.params.handleNew} />
      };
    } else {
      return {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="checklist" size={30} color="#000" />
        ),
        title: "题库",
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
      // checkItems: [],
      dataSource: ds.cloneWithRows([])
    };
    this.new = this.new.bind(this);
    this.getCheckItems = this.getCheckItems.bind(this);
    this.handleCheckItems = this.handleCheckItems.bind(this);
    this.setSource = this.setSource.bind(this);
  }

  componentWillMount() {
    // console.log(this.props.)
    this.props.navigation.setParams({ handleNew: this.new });
  }

  componentDidMount() {
    this.getCheckItems();
  }

  new() {
    this.props.navigation.navigate("NewCheckItemScreen");
  }

  getCheckItems() {
    /*
    axios
      .get("http://119.23.47.185:4001/checkitems")
      .then(responce => this.handleCheckItems(responce.data))
      .catch(error => console.log(error));
      */

    this.props.actions.fetchCheckItems();
    // .then(responce => this.handleCheckItems(responce.checkItems));
  }

  handleCheckItems(checkItems) {
    this.setSource(checkItems);
  }

  setSource(checkItems) {
    console.log("check items are " + checkItems[0].ItemTitle);
    this.setState({
      // checkItems,
      dataSource: this.state.dataSource.cloneWithRows(checkItems)
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.checkItems !== this.props.checkItems) {
      this.setSource(nextProps.checkItems);
    }
  }

  render() {
    const { checkItems, actions } = this.props;
    console.log("check items are " + checkItems);
    return (
      <View style={styles.container}>
        <ListView
          style={styles.list}
          enableEmptySections
          removeClippedSubviews={false}
          dataSource={this.state.dataSource}
          renderRow={(aCheckItem, sectionID, rowID) => (
            <CheckItemRow {...aCheckItem} rowID={rowID} />
          )}
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

// export default CheckItemScreen;

export default connect(
  state => ({
    checkItems: Object.assign({}, state.default.checkItemsReducer.checkItems)
  }),
  dispatch => ({
    actions: bindActionCreators(checkItemActions, dispatch)
  })
)(CheckItemScreen);

/*
function mapStateToProps(state) {
  return {
    checkItems: state.checkItems
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchCheckItems: () => dispatch(fetchCheckItems())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckItemScreen);
*/
