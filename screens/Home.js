import React, { Component } from "react";
import {
 StyleSheet,
  ListView,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  InteractionManager,
  ActivityIndicator,
  Image,
  View,
  DeviceEventEmitter,
  TouchableHighlight,
  NativeAppEventEmitter,
} from "react-native";
import HomeRow from "../views/HomeRow";
import Header from "../views/Header";
import axios from "axios";
import Icon from "react-native-vector-icons/Octicons";
import ScrollableTabView, {
  ScrollableTabBar
} from 'react-native-scrollable-tab-view';
import { commonstyles } from '../common/CommonStyles'
import * as Api from '../app/constant/api';
import { release } from  '../redux/actions/releaseAction';
import Loading from '../app/components/Loading';
import { connect } from 'react-redux';
import { convertTimeStampToDate } from '../tool/timeTool';
import * as timeTool from "../tool/timeTool";

/**
 * 初始化状态
 */
let isRefreshing = false;

/**
 * 当前选中的项目
 */
let selectIndex = 0;

const propTypes = {
  goToPage: React.PropTypes.func, // 跳转到对应tab的方法
  activeTab: React.PropTypes.number, // 当前被选中的tab下标
}

class Home extends Component {
  static navigationOptions = props => {
    const { state, setParams } = props.navigation;
    return {
        title: "Check List",
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
    this.state = {
      dataSource: new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
      }),
      releases: [],
      projects: [],
      isLoading: true,
    };
    this.getReleases = this.getReleases.bind(this);
    this.addAction = this.addAction.bind(this);
    this.itemOnPress = this.itemOnPress.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderContent = this.renderContent.bind(this);
    this.setProjectDataSource = this.setProjectDataSource.bind(this);
    this.setReleaseDataSource = this.setReleaseDataSource.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.renderEmptyView = this.renderEmptyView.bind(this);
    this.showError = this.showError.bind(this);

  }

  componentDidMount() {
     //绑定添加按钮点击事件
    this.props.navigation.setParams({ handleNew: this.addAction });
    InteractionManager.runAfterInteractions(() => {
       //加载项目列表 
       this.loadProjectData();
    })
      //监听保存成功的通知
    this.subscription = DeviceEventEmitter.addListener('RefreshNotification', () => {
         //在收到通知后刷新当前显示的列表 
          let project = this.state.projects[selectIndex];
          this.getReleases(project.ProjectId)
    });
    
    //监听app通知,监听 ReceiveNotification 事件，收到到推送的时候会回调
    NativeAppEventEmitter.addListener(
      'ReceiveNotification',
      (notification) => {
        ToastUtil.showShort('收到通知了，收到通知了');
        this.loadProjectData();
      }
    );
  
  }

  componentWillUnmount(){
      //移除通知
     this.subscription.removeAllListeners('RefreshNotification');
     NativeAppEventEmitter.removeAllListeners('ReceiveNotification');

  }

  /**
   * 新增
   */
  addAction() {
    this.props.navigation.navigate("New", {projects: this.state.projects});
  }

  /**
   * 
   * 加载项目列表数据
   * @memberof Home
   */
  loadProjectData() {
    axios
       .get(Api.API_PROJECT_LIST)
       .then(response => this.setProjectDataSource(response.data.data))
       .catch(error => this.showError(error));

  }

  /**
   * 
   * 设置projects数据源
   * @param {array} projects 
   * @memberof Home
   */
  setProjectDataSource(projects) {
     this.setState({
      projects,
    });
    console.log('setProjectDataSource projects length:  ' + projects.length)
    let first = projects[0];
    console.log('first ProjectId:  ' + first.ProjectId)
    InteractionManager.runAfterInteractions(() => {
      this.getReleases(first.ProjectId);
    })
  }


  //跳转到对应tab的方法
  goToPage(i) {
    selectIndex = i;
     this.setState({
      isLoading: true,
    })
    //根据当前选中的项目获取releases
    let project = this.state.projects[i];
    this.getReleases(project.ProjectId)
  }
  
  //根据项目id获取到相应的release
  getReleases(projectId) {
    //开始加载动画
    this.setState({
      isLoading: true,
    });
    const { release } = this.props;
    release(projectId,this.state.isLoading)
      .then(response => this.setReleaseDataSource(response.releaseList))
      .catch(error => this.showError(error))
    console.log('release: ' + release);
    console.log('projectId: ' + projectId);
  }
  
  /**
   * 
   * 显示错误信息
   * @param {any} error 
   * @memberof Home
   */
  showError(error) {
    this.setState({
      isLoading: false,
    });
    ToastUtil.showShort(error);
  }

  /**
   * 
   * 设置release的数据源
   * @param {any} releaseList 
   * @memberof Home
   */
  setReleaseDataSource(releaseList) {
    isRefreshing = false;
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(releaseList),
      isLoading: false,
    });

  }
   
  /**
   * 
   * 无数据时的下拉刷新
   * @memberof Home
   */
  onRefresh() {
    this.setState({
      isLoading: false,
    })
    isRefreshing = true;
     //根据当前选中的项目刷新releases
    let project = this.state.projects[selectIndex];
    this.getReleases(project.ProjectId)
  }
  
  /**
   * 
   * 单元格的点击事件
   * @param {object} rowData 
   * @memberof Home
   */
  itemOnPress(rowData) {
    let { ReleaseId,ReleaseTitle } = rowData;
    this.props.navigation.navigate("Detail", {
      releaseId: ReleaseId,
      releaseTitle: ReleaseTitle,
    });
    
  }

   /**
   * 没有数据时显示的视图
   * 
   * @memberof Home
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
            目前没有数据，你可以尝试刷新重试
          </Text>
        </View>
      </ScrollView>
    )
  }

  //刷新内容
  renderContent(dataSource) {

    const { Release } = this.props;
    let releaseList = Release.releaseList;

    if (this.state.isLoading === false && releaseList.length === 0) {
      return this.renderEmptyView();
    }

    console.log('renderContent releaseList: ' + releaseList.length);
    return (
       <ListView
        initialListSize={1}
        dataSource={dataSource}
        renderRow={this.renderItem}
        renderSeparator={(sectionId, rowId) => (
            <View key={rowId} style={styles.seperator} />
          )}
        style={styles.listView}
       // onEndReached={() => this.onEndReached(typeId)}
        onEndReachedThreshold={10}
        enableEmptySections
       // renderFooter={this.renderFooter}
      />
    );
  }
  /*
  刷新单元格
  */
  renderItem(rowData) {
  
    const { Release } = this.props;
    if (Release === undefined) {
      console.log('Release是undefined: ' + Release);
      return <View/>
    }
    let releaseList = Release.releaseList;
    console.log('这里是刷新内容  Release: ' + Release);
    if (releaseList === null) {
       console.log('releaseList是null ' + Release);
       return <View/>
    }
    if (releaseList === undefined) {
     console.log('releaseList是undefined ' + Release);
      return <View/>
    }

    if (releaseList.length === 0) {
      console.log('releaseList的长度是0');
      return <View/>
    }

    console.log('renderContent releaseListLength: ' + releaseList.length);

    let lessValue = timeTool.getLessValue(rowData.ReleaseDate);
    return (
      <TouchableHighlight underlayColor="lightgray"  onPress={() => this.itemOnPress(rowData)}>
        <View style={styles.itemContainer}>
          <View style={styles.itemContent}>
            <View style={styles.itemTimeContent}>
              <Text style={styles.itemText}>{rowData.ReleaseTitle} </Text>
              {rowData.Status == 6
                ? <Text style={styles.itemTimeText,{color: '#51c4d4'}}>已发布</Text>
                : lessValue == 0
                   ? <Text style={styles.itemTimeText}>今天发布</Text>
                   : lessValue > 0
                     ? <Text style={styles.itemTimeText}>距发布日期:{lessValue}天</Text> 
                     : <Text style={styles.itemTimeText,{color: 'red'}}>已延期{Math.abs(lessValue)}天</Text>
              }
             </View>
            <Text style={styles.itemVersionText}>版本号: {rowData.Version} </Text>
            <Text style={styles.itemsubText}>更新时间: {timeTool.formatTimeString(rowData.UpdatedAt)}</Text>
          </View>
          <View style={styles.arrowContainer} >
            <Image source={require('../img/arrow_icon.png')} />
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  /*
  加载动画
  */
  renderLoading() {
    return <Loading visible={this.state.isLoading} size='large' color='white'/>;
  }

  render() {

    if (this.state.projects.length === 0 || this.state.projects === undefined) {
      return <View/>
    }
    console.log('this.state.projects.length: ' + this.state.projects.length);

    const { Release } = this.props;
    let releaseList = Release.releaseList;

    console.log('render releaseList: ' + releaseList.length);

    return (
      <View style={styles.container}>
        <ScrollableTabView
         renderTabBar={() => (
           <ScrollableTabBar tabStyle={styles.tab} textStyle={styles.tabText} />
         )}
         onChangeTab={(obj) => this.goToPage(obj.i)}
         tabBarBackgroundColor='#fcfcfc'
         tabBarUnderlineStyle={styles.tabBarUnderline} 
         tabBarActiveTextColor='#51c4d4'
         tabBarInactiveTextColor='#aaa'
       >
       {this.state.projects.map((project) => {
           {this.renderLoading()}
           const typeView = ( 
             <View key={project.ProjectId} tabLabel={project.ProjectName} style={styles.base}>
                {this.renderContent(this.state.dataSource)}     
               </View>
           );
           return typeView;
         })}
        </ScrollableTabView>  
      </View>
    );
  }
}

const styles = StyleSheet.create({
  base: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    flexDirection: 'column',
  },
  list: {},
  seperator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#dddddd"
  },
  tab: {
    paddingBottom: 0
  },
  tabText: {
    fontSize: 16
  },
  tabBarUnderline: {
    backgroundColor: '#51c4d4',
    height: 2,
  },
  itemContainer: {
   flex: 1,
   flexDirection: 'row',
  },
  arrowContainer: {
    justifyContent: 'center',
    marginRight: 15,
  },
  itemContent: {
    flex: 1,
    padding: 0,
   // height: 80,
    flexDirection: "column",
    // alignItems: "flex-start",
    // justifyContent: "flex-start"
  },
  itemTimeContent: {
    flex: 1,
    marginTop: 10,
    marginBottom: 5,
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 0,
    height: 20,
  },
  itemText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#404040'
   // fontWeight: "bold"
  },
  itemTimeText: {
  //  paddingRight: 20,
   // marginRight: 20,
   // marginLeft: 30,
    fontSize: 13,
    textAlign: 'right',
    color: '#f47411',
    marginRight: 0,
  },
  itemVersionText: {
    marginLeft: 15,
    fontSize: 14,
    marginTop: 5,
    color: '#666',
    marginBottom: 5,
  },

  itemsubText: {
    fontSize: 12,
    marginLeft: 15,
    marginTop: 5,
    color: '#828282',
    marginBottom: 5,
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

export default connect((state) => {
    const { Release } = state;
    return {
        Release
    }
}, { release })(Home)