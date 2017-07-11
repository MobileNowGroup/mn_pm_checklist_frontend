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
 * 状态
 */
let isLoading = true;

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
    };
    this.getReleases = this.getReleases.bind(this);
    this.addAction = this.addAction.bind(this);
    this.itemOnPress = this.itemOnPress.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
     //绑定添加按钮点击事件
    this.props.navigation.setParams({ handleNew: this.addAction });
    //加载项目列表 
     axios
      .get(Api.API_PROJECT_LIST)
      .then(response => this.setProjects(response.data.data))
      .catch(error => console.log(error));
      //监听保存成功的通知
      this.subscription = DeviceEventEmitter.addListener('RefreshNotification', () => {
         //在收到通知后刷新当前显示的列表 
          let project = this.state.projects[selectIndex];
          this.getReleases(project.ProjectId)
      });
  
  }

  componentWillUnmount(){
      //移除通知
     this.subscription.removeAllListeners('RefreshNotification');
  }

  /**
   * 新增
   */
  addAction() {
    this.props.navigation.navigate("New", {projects: this.state.projects});
  }

  //跳转到对应tab的方法
  goToPage(i) {
    selectIndex = i;
    //根据当前选中的项目获取eleases
    let project = this.state.projects[i];
    this.getReleases(project.ProjectId)
  }
  
  //根据项目id获取到相应的release
  getReleases(projectId) {
   const { release } = this.props;
   console.log('release: ' + release);
   release(projectId,isLoading)
   console.log('projectId: ' + projectId);

  }
   
  //设置projects的值
  setProjects(projects) {
     this.setState({
      projects,
    });
    console.log('projects length:  ' + projects.length)
    let first = projects[0];
    console.log('first ProjectId:  ' + first.ProjectId)
    this.getReleases(first.ProjectId)
  }
   
  //单元格的点击事件
  itemOnPress(rowData) {
    let { ReleaseId,ReleaseTitle } = rowData;
    this.props.navigation.navigate("Detail", {
      releaseId: ReleaseId,
      releaseTitle: ReleaseTitle,
    });
    
  }

  //刷新内容
  renderContent(dataSource) {
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
                     : <Text style={styles.itemTimeText}>已延期{Math.abs(lessValue)}天</Text> }
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
    return <Loading visible={true} size='large' color='white'/>;
  }

  render() {

    if (this.state.projects.length == 0) {
      return <View/>
    }
    console.log('this.state.projects.length: ' + this.state.projects.length);

    const { Release } = this.props;
    let releaseList = Release.releaseList;

    console.log('releaseList: ' + releaseList.length);

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
           const typeView = ( 
             <View key={project.ProjectId} tabLabel={project.ProjectName} style={styles.base}>
                {Release.isLoading ? 
                  this.renderLoading() :
                  this.renderContent(
                  this.state.dataSource.cloneWithRows(
                    releaseList.length === 0
                      ? []
                      : releaseList
                  )
                )}     
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
  }

});

export default connect((state) => {
    const { Release } = state;
    return {
        Release
    }
}, { release })(Home)