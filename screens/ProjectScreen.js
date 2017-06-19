import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ListView,
  Dimensions,
  TouchableOpacity,
  Image
} from "react-native";
import axios from "axios";
import ProjectRow from "../views/ProjectRow";
import { bindActionCreators } from "redux";
import * as projectActions from "../redux/actions/projectActions";
import * as loginActions from "../redux/actions/loginActions";
import { connect } from "react-redux";
import NewProjectScreen from "./NewProjectScreen";
import Icon from "react-native-vector-icons/Octicons";

class ProjectScreen extends Component {
  static navigationOptions = props => {
    const { state, setParams } = props.navigation;
    if (typeof state.params == "undefined") {
      return {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="project" size={30} color="#000" />
        ),
        title: "项目",
        headerLeft: null
        // headerRight: <Button title=" + " onPress={state.params.handleNew} />
      };
    } else {
      return {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="project" size={30} color="#000" />
        ),
        title: "项目",
        headerLeft: null,
        headerRight: (
          <TouchableOpacity onPress={state.params.handleNew}>
            <Icon name="plus" size={30} color="#000" />
          </TouchableOpacity>
        )
      };
    }
  };

  renderPlusButton() {
    return (
      <TouchableOpacity onPress={this._onPressButton}>
        <Image style={styles.button} source="plus" />
      </TouchableOpacity>
    );
  }

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
    this.getProjects = this.getProjects.bind(this);
    this.handleCheckItems = this.handleCheckItems.bind(this);
    this.setSource = this.setSource.bind(this);
    // this.handleCallback = this.handleCallback.bind(this);
  }

  componentWillMount() {
    // console.log(this.props.)
    this.props.navigation.setParams({ handleNew: this.new });
  }

  componentDidMount() {
    this.getProjects();
  }

  new() {
    this.props.navigation.navigate("NewProjectScreen");
  }

  getProjects() {
    /*
    axios
      .get("http://119.23.47.185:4001/checkitems")
      .then(responce => this.handleCheckItems(responce.data))
      .catch(error => console.log(error));
      */

    this.props.actions.fetchProjects();
    // .then(responce => this.handleCheckItems(responce.checkItems));
  }

  handleCheckItems(projects) {
    this.setSource(projects);
  }

  setSource(projects) {
    this.setState({
      // checkItems,
      dataSource: this.state.dataSource.cloneWithRows(projects)
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.projects !== this.props.projects) {
      this.setSource(nextProps.projects);
    }
  }

  handleCallback(rowID) {
    // this.state.projects[parseInt(rowID)];
    this.props.navigation.navigate("NewProjectScreen", {
      project: this.props.projects[parseInt(rowID)]
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          style={styles.list}
          enableEmptySections
          removeClippedSubviews={false}
          dataSource={this.state.dataSource}
          renderRow={(aProject, sectionID, rowID) => (
            <ProjectRow
              {...aProject}
              rowID={rowID}
              callbackFunc={() => this.handleCallback(rowID)}
            />
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
    // flex: 1,
    width: Dimensions.get("window").width,
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
    projects: Object.assign({}, state.default.projectReducer.projects),
    isTokenExpired: state.default.projectReducer.isTokenExpired
  }),
  dispatch => ({
    actions: bindActionCreators(projectActions, dispatch)
  })
)(ProjectScreen);

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
