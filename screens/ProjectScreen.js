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
import * as ProjectCreators from "../redux/actions/projectActions";
import * as loginActions from "../redux/actions/loginActions";
import { connect } from "react-redux";
import NewProjectScreen from "./NewProjectScreen";
import Icon from "react-native-vector-icons/Octicons";
import { commonstyles } from '../common/CommonStyles'

class ProjectScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
     title: '项目',
      tabBarIcon: ({ tintColor }) => (
      <Icon name="checklist" size={25} color={tintColor} />
      ),
      headerRight: ( 
        navigation.state.params !== undefined &&
        navigation.state.params.isFirst
        ? null
        : <TouchableOpacity onPress={() => {
            navigation.state.params.handleNew();
          }}>
          <Image source={require('../img/plus_icon.png')}  style={{marginRight: 15}} />
          </TouchableOpacity>
        ),
      headerStyle: commonstyles.headerStyle,
      headerTitleStyle: commonstyles.headerTitleStyle,
      headerTintColor: 'black',
  });

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
    this.handleCheckItems = this.handleCheckItems.bind(this);
    this.setSource = this.setSource.bind(this);
    // this.handleCallback = this.handleCallback.bind(this);
  }

  componentWillMount() {
    // console.log(this.props.)
  }

  componentDidMount() {
    /**  
     * 将单击回调函数作为参数传递  
     */ 
    this.props.navigation.setParams({ handleNew: this.new });
    //加载项目列表数据
    const { projectActions } = this.props;
    projectActions
      .fetchProjects()
      .then(response => this.setSource(response.projects))

  }
  
  /**
   * 新增项目
   */
  new() {
    this.props.navigation.navigate("NewProjectScreen");
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
    
    const { Project } = this.props;
    console.log(Project.projects[parseInt(rowID)])
    this.props.navigation.navigate("NewProjectScreen", {
      project: Project.projects[parseInt(rowID)],
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

const mapStateToProps = (state) => {
  const { Project } = state;
  return {
    Project
  };
};

const mapDispatchToProps = (dispatch) => {
  const projectActions = bindActionCreators(ProjectCreators, dispatch);
  return {
    projectActions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectScreen);

// export default connect(
//   state => ({
//     projects: Object.assign({}, state.default.projectReducer.projects),
//     isTokenExpired: state.default.projectReducer.isTokenExpired
//   }),
//   dispatch => ({
//     actions: bindActionCreators(projectActions, dispatch)
//   })
// )(ProjectScreen);

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
