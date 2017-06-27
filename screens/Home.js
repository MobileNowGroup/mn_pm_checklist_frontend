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
} from "react-native";
import HomeRow from "../views/HomeRow";
import Header from "../views/Header";
import axios from "axios";
import Icon from "react-native-vector-icons/Octicons";
import ScrollableTabView, {
  ScrollableTabBar
} from 'react-native-scrollable-tab-view';

const propTypes = {
  goToPage: React.PropTypes.func, // 跳转到对应tab的方法
  activeTab: React.PropTypes.number, // 当前被选中的tab下标
}

class Home extends Component {
  static navigationOptions = props => {
    const { state, setParams } = props.navigation;
    if (typeof state.params == "undefined") {
      return {
        title: "MNReleaseTool",
        headerLeft: null,
        headerStyle: styles.headerStyle,
      };
    } else {
      return {
        title: "Check List",
        headerLeft: null,
        headerStyle: styles.headerStyle,
        headerRight: (
          <TouchableOpacity onPress={state.params.handleNew}>
            <Image source={require('../img/plus_icon.png')} />
          </TouchableOpacity>
        )
      };
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
      }),
      releases: [],
      projects: []
    };
    this.setRealeases = this.setRealeases.bind(this);
    this.getReleases = this.getReleases.bind(this);
    this.handleRowCallback = this.handleRowCallback.bind(this);
    this.addAction = this.addAction.bind(this);
  }

  componentWillMount() {
    //绑定添加按钮点击事件
    this.props.navigation.setParams({ handleNew: this.addAction });
    //加载projects
     axios
      .get("http://119.23.47.185:4001/projects")
      .then(response => this.setProjects(response.data))
      .catch(error => console.log(error));
  }

  //新增
  addAction() {
    this.props.navigation.navigate("New", { projects: this.state.projects });
  }

  //跳转到对应tab的方法
  goToPage(i) {
    //根据当前选中的项目获取eleases
    let project = this.state.projects[i];
    this.getReleases(project.ProjectId)
  }
  
  //根据项目id获取到相应的release
  getReleases(projectId) {
    axios
      .get("http://119.23.47.185:4001/projects/" + projectId + "/releases")
      .then(response => this.setRealeases(response.data))
      .catch(error => console.log(error));
  }
   
  //设置projects的值
  setProjects(projects) {
     this.setState({
      projects,
    });
    let first = projects[0];
    this.getReleases(first.ProjectId)
  }
   
   //填充realeases的值
  setRealeases(releases) {
    this.setState({
      releases,
    })
  }
  
  //刷新内容
  renderContent(dataSource) {
    return (
       <ListView
        initialListSize={1}
        dataSource={dataSource}
        renderRow={aRelease => (
            <HomeRow {...aRelease} callbackFunc={this.handleRowCallback} />
          )}
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

  //单元格的点击事件
  handleRowCallback(releaseId, releaseTitle) {
    this.props.navigation.navigate("Detail", {
      releaseId: releaseId,
      releaseTitle: releaseTitle
    });
    
  }

  render() {
    if (this.state.projects.length == 0) {
      return <View/>
    }
    return (
      <View style={styles.container}>
        <ScrollableTabView
         renderTabBar={() => (
           <ScrollableTabBar tabStyle={styles.tab} textStyle={styles.tabText} />
         )}
         onChangeTab={(obj) => this.goToPage(obj.i)}
         tabBarBackgroundColor='#fcfcfc'
         tabBarUnderlineStyle={styles.tabBarUnderline} 
         tabBarActiveTextColor='#78e9ff'
         tabBarInactiveTextColor='#aaa'
       >
       {this.state.projects.map((project) => {
           const typeView = (
             <View key={project.ProjectId} tabLabel={project.ProjectName} style={styles.base}>
                {this.renderContent(
                  this.state.dataSource.cloneWithRows(
                    this.state.releases === undefined
                      ? []
                      : this.state.releases
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
  headerStyle: {
    backgroundColor: 'white',
  },
  tab: {
    paddingBottom: 0
  },
  tabText: {
    fontSize: 16
  },
  tabBarUnderline: {
    backgroundColor: '#78e9ff',
    height: 2
  }
});

export default Home;
