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
  DeviceEventEmitter,
  ScrollView,
  InteractionManager,
} from "react-native";

import { bindActionCreators } from "redux";
import * as ProjectCreators from "../redux/actions/projectActions";
import { connect } from "react-redux";
import NewProjectScreen from "./NewProjectScreen";
import { commonstyles } from '../common/CommonStyles';
import Swipeout from "react-native-swipeout";
import * as timeTool from "../tool/timeTool";
import Loading from '../app/components/Loading';
import ToastUtil from '../tool/ToastUtil';
import * as Notification from '../app/constant/notification';


/**
 * 初始化状态
 */
let isRefreshing = false;
/**
 * 记录当前将要删除的item的位置
 */
let deleteIndex = -1

let flag = 0

class ProjectScreen extends Component {
 static navigationOptions = props => {
    const { state, setParams } = props.navigation;
    return {
        headerTitle: "项目",
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
      isLoading: true,
      projectList: [],
      dataSource: ds.cloneWithRows([])
    };
    this.new = this.new.bind(this);
    this.setSource = this.setSource.bind(this);
    this.itemOnPress = this.itemOnPress.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.handleDeleteResult = this.handleDeleteResult.bind(this);
    this.showError = this.showError.bind(this);
    this.loadData = this.loadData.bind(this);
  
  }

  componentDidMount() {
    /**  
     * 将单击回调函数作为参数传递  
     */ 
    this.props.navigation.setParams({ handleNew: this.new });
    //加载项目列表数据
   //InteractionManager 这个方法用来标记参数中传入的方法在所有当前进行的交互和动画完成后再执行。可以理解为将func加入到一个等待队列。
   InteractionManager.runAfterInteractions(() => {
      this.loadData();
   })
     //监听刷新列表的通知
    this.subscription = DeviceEventEmitter.addListener(Notification.ProjectRefreshNotification, () => {
        //在收到通知后刷新列表
        this.loadData(); 
    });
  }

    componentWillUnmount(){
      //移除通知
     this.subscription.removeAllListeners(Notification.ProjectRefreshNotification);
  }


  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.projects !== this.props.projects) {
  //     this.setSource(nextProps.projects);
  //   }
  // }
  
  /**
   * 
   * 加载数据
   * @memberof ProjectScreen
   */
  loadData() {
    this.setState({
      isLoading: true,
      isRefreshing: false,
    });
    const { projectActions } = this.props;
    projectActions
      .fetchProjects(this.state.isLoading,isRefreshing)
      .then(response => this.setSource(response.projects))
      .catch(error => ToastUtil.showShort(error));
  }
  /**
   * 
   * 下拉刷新
   * @memberof ProjectScreen
   */
  onRefresh() {
    flag = 1;
    isRefreshing = true;
    this.setState({
      isLoading: false,
    })

    const { projectActions } = this.props;
    projectActions
      .fetchProjects(this.state.isLoading,isRefreshing)
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

    let tempItems = JSON.parse(JSON.stringify(projects));

    this.setState({
      isLoading: false,
      projectList: tempItems,
      dataSource: this.state.dataSource.cloneWithRows(tempItems),
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

    //记录选择的删除单元格的位置
    deleteIndex = parseInt(rowId);
    this.setState({
      isLoading: true,
    })
    
    const { projectActions } = this.props;
    projectActions
      .deleteProject(itemData.ProjectId, this.state.isLoading)
      .then(response => this.handleDeleteResult(response))
      .catch(error => this.showError(error));

  }
  
  /**
   * 处理删除单元格的返回结果
   * @param {any} response 
   * @memberof ProjectScreen
   */
  handleDeleteResult(response) {
    console.log('deleteIndex: ' + deleteIndex);
    const { Project } = this.props;
    //如果操作成功
    if (response.deleteResult === true && deleteIndex !== -1 && deleteIndex < Project.projects.length) {
      //删除数据源，并刷新列表
      Project.projects.splice(deleteIndex, 1);
      this.setSource(Project.projects);
      deleteIndex = -1;
    }else {
      ToastUtil.showShort('删除失败，请重试');
    }

  }
  
  /**
   * 
   * 显示错误信息
   * @param {any} error 
   * @memberof ProjectScreen
   */
  showError(error) {
    //停止加载动画
    this.setState({
      isLoading: false,
    })
    //显示错误信息
    ToastUtil.showShort(error)
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
   * 没有数据时显示的视图
   * 
   * @memberof ProjectScreen
   */
  renderEmptyView() {
    return (
      <ScrollView
        automaticallyAdjustContentInsets={false}
        horizontal={false}
        contentContainerStyle={styles.empty}
        style={styles.flex}
        refreshControl={
          <RefreshControl
            style={styles.refreshControlBase}
            refreshing={isRefreshing}
            onRefresh={() => this.onRefresh()}
            title='Loading...'
            colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
          />
        }
      >
        <View style={{ alignItems:'center' }} >
          <Text style={{fontSize: 16}}>
            目前没有数据，请刷新重试...
          </Text>
        </View>
      </ScrollView>
    )
  }

  /**
   * 
   * 刷新单元格
   * @param {object} itemData 
   * @memberof ProjectScreen
   */
 
  renderItem(itemData,sectionId,rowId) {
    console.log('itemData:  '+itemData);
    if (itemData === undefined) {
      return <View/>;
    }
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
          onPress={() => this.itemOnPress(itemData)}
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
    return <Loading visible={this.state.isLoading} size='large' color='white'/>;
  }

  render() {

    const { Project } = this.props;
    if (this.state.isLoading === false && Project.projects.length === 0) {
      //在数据加载完成后，如果数据为空,则显示空视图
      return this.renderEmptyView();
    }

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
    backgroundColor: "#f8f8f8"
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
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
    backgroundColor: '#fff',
  },
  flex: {
    flex: 1,
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
