import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ListView,
  Dimensions,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  RefreshControl,
} from "react-native";
import { bindActionCreators } from "redux";
import * as ProjectCreators from "../redux/actions/projectActions";
import * as loginActions from "../redux/actions/loginActions";
import { connect } from "react-redux";
import NewProjectScreen from "./NewProjectScreen";
import Icon from "react-native-vector-icons/Octicons";
import { commonstyles } from '../common/CommonStyles';
import Swipeout from "react-native-swipeout";
import * as timeTool from "../tool/timeTool";
import Loading from '../app/components/Loading';

/**
 * 初始化状态
 */
let isLoading = true;
let isRefreshing = false;
/**
 * 记录当前将要删除的item的位置
 */
let deleteIndex = -1

class ProjectScreen extends Component {
 static navigationOptions = props => {
    const { state, setParams } = props.navigation;
    return {
        title: "项目",
        headerLeft: null,
        headerStyle: commonstyles.headerStyle,
        headerTitleStyle: commonstyles.headerTitleStyle,
        headerRight: ( 
          state.params === undefined
          ? null
          : <TouchableOpacity onPress={() => {
              state.params.handleNew();
            }}>
              <Image source={require('../img/plus_icon.png')}  style={{marginRight: 15}} />
            </TouchableOpacity>
        ),
      };
  };

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      projectList: [],
      dataSource: ds.cloneWithRows([])
    };
    this.new = this.new.bind(this);
    this.setSource = this.setSource.bind(this);
    this.itemOnPress = this.itemOnPress.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }

  componentDidMount() {
    /**  
     * 将单击回调函数作为参数传递  
     */ 
    this.props.navigation.setParams({ handleNew: this.new });
    //加载项目列表数据
     const { projectActions } = this.props;
     projectActions
      .fetchProjects(isLoading,isRefreshing)
      .then(response => this.setSource(response.projects))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.projects !== this.props.projects) {
      this.setSource(nextProps.projects);
    }
  }
  
  /**
   * 
   * 下拉刷新
   * @memberof ProjectScreen
   */
  onRefresh() {

    isRefreshing = true;
    isLoading = false;

    const { projectActions } = this.props;
    projectActions
      .fetchProjects(isLoading,isRefreshing)
      .then(response => this.setSource(response.projects))
  }

  /**
   * 新增项目
   */
  new() {
    this.props.navigation.navigate("NewProjectScreen");
  }
  /**
   * 
   * 设置数据源
   * @param {Array} projects 
   * @memberof ProjectScreen
   */
  setSource(projects) {

    isRefreshing = false;
    isLoading = false;

    this.setState({
      projectList: projects,
      dataSource: this.state.dataSource.cloneWithRows(projects)
    });
  }

  /**
   * 
   * 删除单元格
   * @param {object} itemData
   * @param {int} rowId  
   * @memberof ProjectScreen
   */
  deleteItem(itemData,rowId) {
    deleteIndex = rowId
    const { projectActions } = this.props;
    projectActions
      .deleteProject(itemData.ProjectId, rowId)
      .then(responce => console.log("res is " + responce))
      .catch(error => console.log("error is " + error));
  }
  
  /**
   * 处理删除单元格的返回结果
   * @param {any} response 
   * @memberof ProjectScreen
   */
  handleDeleteResult(response) {

  }

  /**
   * 
   * 单元格的点击事件
   * @param {object} itemData 
   * @memberof ProjectScreen
   */
  itemOnPress(itemData) {
    //前往编辑页面
    this.props.navigation.navigate("NewProjectScreen", {
      project: itemData,
    });
  }

  /**
   * 
   * 刷新单元格
   * @param {object} itemData 
   * @memberof ProjectScreen
   */
 
  renderItem(itemData,rowId) {
    //创建左滑删除的按钮
     let swipeBtns = [
      {
        text: "删除",
        backgroundColor: "red",
        underlayColor: "rgba(0, 0, 0, 0.6)",
        onPress: () => {
          this.deleteItem(itemData,rowId);
        }
      }
    ];
    return (
      <Swipeout
        buttonWidth={60}
        right={swipeBtns}
        autoClose={true}
        backgroundColor="transparent"
      >
        <TouchableHighlight
          underlayColor="lightgray"
          onPress={this.itemOnPress}
        >
          <View style={styles.itemContainer}>
            <Text style={styles.itemText} numberOfLines={1}>{itemData.ProjectName}</Text>
            <Text style={styles.itemSubText}>
              {"更新时间：" + timeTool.formatTimeString(itemData.UpdatedAt)}
            </Text>
          </View>
        </TouchableHighlight>
      </Swipeout>
    );
  }

  /*
  加载动画
  */
  renderLoading() {
    return <Loading visible={isLoading} size='large' color='white'/>;
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderLoading()}
        <ListView
          style={styles.list}
          enableEmptySections
          removeClippedSubviews={false}
          dataSource={this.state.dataSource}
          renderRow={this.renderItem}
          renderSeparator={(sectionId, rowId) => (
            <View key={rowId} style={styles.seperator} />
          )}
          refreshControl={
            <RefreshControl
              style={styles.refreshControlBase}
              refreshing={isRefreshing}
              onRefresh={() => this.onRefresh()}
              title='Loading...'
              colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
            />
          }
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
    backgroundColor: "#f4f4f4"
  },
  list: {
    // flex: 1,
    width: Dimensions.get("window").width,
    backgroundColor: "#fff"
  },
  seperator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#ccc"
  },
  itemContainer: {
    flex: 1,
    flexDirection: "column",
  },
  itemText: {
    marginLeft: 15,
    marginRight: 15,
    fontSize: 16,
    marginTop: 10,
    color: '#333'
  },
  itemSubText: {
    marginLeft: 15,
    fontSize: 12,
    marginTop: 5,
    marginBottom: 5,
    color: "#666",
  },
  refreshControlBase: {
    backgroundColor: 'transparent',
  },
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
