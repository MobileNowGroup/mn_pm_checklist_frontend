import React, { Component } from "react";
import {
   View,
   Text, 
   StyleSheet, 
   Alert, 
   ListView,
   TouchableOpacity,
   Image,
   Dimensions,
   DeviceEventEmitter 
} from "react-native";

import SegmentedControlTab from "react-native-segmented-control-tab";
import Loading from '../app/components/Loading';
import Button from '../app/components/Button';
import * as timeTool from "../tool/timeTool";
import ToastUtil from '../tool/ToastUtil';
import { commonstyles } from '../common/CommonStyles'
import * as Api from '../app/constant/api';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DetailCreators from '../redux/actions/checkItemActions';

/**
 * 状态
 */
let isLoading = true;
/**
 * 判断
 */
let isFirstLoad = true;
let filterData = [];

class NewDetail extends Component {
  static navigationOptions = props => {
    const { state, setParams } = props.navigation;
    return {
      title: '新 增',
      headerStyle: commonstyles.headerStyle,
      headerTitleStyle: commonstyles.headerTitleStyle,
    };
  };
  //属性类型
  static propTypes = {
      projectId: React.PropTypes.number,
      appName: React.PropTypes.string,
      updateText: React.PropTypes.string,
      versionText: React.PropTypes.string,
      releaseDate: React.PropTypes.string,
      releaseTitle: React.PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0,
      checkItemData: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      listViewNeedRerender: false,
    };
    this.setSource = this.setSource.bind(this);
    this.save = this.save.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.itemOnPress = this.itemOnPress.bind(this);
    this.setDataSource = this.setDataSource.bind(this);

  //  this.handleResult = this.handleResult.bind(this);
  }

  componentWillMount() {
    //加载题目列表
    const { detailActions } = this.props;
    detailActions
      .checkItem(isLoading)
      .then(response => this.setDataSource(response.checkItems))
  }

  componentDidMount() {
    this.props.navigation.setParams({ handleSave: this.save });
  }


  componentWillUnmount() {
     //清空定时器
    clearTimeout(this.timer);
  }
  
  /**
   * 设置数据源
   */
  setDataSource(checkItems) { 
    //根据是否是基本题来判断是否需要选中
    for (let i = 0;i < checkItems.length; i++) {
        let anItem = checkItems[i];
        if (anItem.IsChecked == undefined) {
          anItem.IsChecked = anItem.IsMandatory;
        }
      }
    checkItemData = checkItems;
    //刷新列表 
    this.setState({
      checkItemData: checkItems,
      dataSource: this.state.dataSource.cloneWithRows(checkItems),
    })
  }
 
  /**
   * 保存
   */
  save() {

   //获取当前选中的题目id
   let tempItems = this.state.checkItemData;
   let selectItems = [];
   for (let i = 0; i < tempItems.length; i++) {
     let anItem = tempItems[i];
     if (anItem.IsChecked === 1) {
       selectItems.push(anItem.ItemId)
     }
   }

   const { params } = this.props.navigation.state;
   let { projectId,appName,updateText,versionText,releaseDate,releaseTitle } = params;
   let dic = {
     'release_notes': updateText,
     'release_title': releaseTitle,
     'version': versionText,
     'release_date': timeTool.getTimeIntervalSince1970(params.releaseDate),
     'project_id': projectId,
     'check_items': selectItems,
   }
   //新增release
   const { detailActions } = this.props;
   detailActions
     .addRelease(dic,true)
     .then(response => this.handleResult(response.addResult));
  }

  /**
   * 处理保存结果
   */
  handleResult(isSuccess) {

    if (isSuccess == true) {
      //发送刷新列表成功的通知
      DeviceEventEmitter.emit('RefreshNotification');
      let parentKey = this.props.navigation.state.params.parentKey;
      this.timer =  setTimeout(() => {
         ToastUtil.showShort('保存成功')
         this.props.navigation.goBack(parentKey);
      },500);
    }else {
      this.timer = setTimeout(() => {
        ToastUtil.showShort('保存失败，请重试')
      },500);
    }
   
  }

 
  /**
   * 
   * 根据当前选中的selectedIndex显示不同的数据
   */
  setSource(items) {
    var sortedItems = [];
    switch (this.state.selectedIndex) {
      case 0:
        sortedItems = items;
        break;
      case 1:
        for (var i = 0; i < items.length; i++) {
          var anItem = items[i];
          if (Boolean(anItem.IsMandatory)) sortedItems.push(anItem);
        }
        break;
      case 2:
        for (var i = 0; i < items.length; i++) {
          var anItem = items[i];
          if (!Boolean(anItem.IsMandatory)) sortedItems.push(anItem);
        }
        break;
      default:
        sortedItems = items;
        break;
    }
    this.setState({
      checkItemData: this.state.checkItemData,
      dataSource: this.state.dataSource.cloneWithRows(sortedItems),
    })
  }

  /**
   * 修改当前显示的index
   */
  handleIndexChange = index => {
    // set state is asynchronous
    this.setState({ selectedIndex: index }, function() {
      this.setSource(this.state.checkItemData);
    });
  };

  /**
   * 单元格的点击事件
   * @param {object} item 
   */
  itemOnPress(item) {

    if (item.IsMandatory === 1) {
      //如果是必选的，则不可修改
      return;
    }
    item.IsChecked = !item.IsChecked;
    for (let i = 0; i < this.state.checkItemData.length; i++) {
      let anItem = this.state.checkItemData[i];
      if (anItem.ItemId == item.ItemId) {
        anItem.IsChecked = item.IsChecked
      }
    }
    let tempItems = JSON.parse(JSON.stringify(this.state.checkItemData));
    this.setSource(tempItems)
  }
  /*
  刷新单元格
  */
  renderItem(item) {
    let source = require('../img/selected_icon.png')
    if (item.IsChecked === false || item.IsChecked === 0 )  {
      if (item.IsChecked === true) {
        source = require('../img/selected_icon.png')
      }else {
        source = require('../img/unSelected_icon.png')
      }
    }
    return (
      <TouchableOpacity onPress={() => this.itemOnPress(item)} >
       <View style={styles.containerItem}>
        <Text style={styles.itemContent} >
          {item.ItemTitle}
        </Text>
        <Image source={source} style={{marginRight: 20}} />
      </View>  
      </TouchableOpacity>
    )
  }
  /*
  加载动画
  */
  renderLoading() {
    return <Loading visible={isLoading} size='large' color='white'/>;
  }

  render() {
    
    const { CheckItem } = this.props;
    isLoading = CheckItem.isLoading;

    return (
      <View style={styles.container}>
        {this.renderLoading()}
        <View style={styles.segmentedContainer} >
          <SegmentedControlTab
            values={["全部", "基础", "定制"]}
            selectedIndex={this.state.selectedIndex}
            onTabPress={this.handleIndexChange}
            tabStyle={styles.tabStyle}
            activeTabStyle={styles.activeTabStyle}
            tabsContainerStyle={styles.tabsContainerStyle}
            tabStyle={styles.tabStyle}
          />
        </View>
        <ListView
          key = {this.state.listViewNeedRerender}
          style={styles.list}
          enableEmptySections
          dataSource={this.state.dataSource}
          renderRow={this.renderItem}
          renderSeparator={(sectionId, rowId) => (
            <View key={rowId} style={styles.seperator} />
          )}
        />
        <Button 
          onPress={this.save}
          text='完成'
          style={styles.buttonText}
          containerStyle={styles.buttonContainer}
        />
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerStyle: {
    backgroundColor: 'white',
  },
  list: {
    flex: 1,
    backgroundColor: 'white',
  },
  seperator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#8E8E8E"
  },
  segmentedContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc', 
  },
  activeTabStyle: {
    backgroundColor: '#51c4d4',
  },
  tabStyle: {
    borderColor: '#51c4d4',
    backgroundColor: 'white',
  },
  tabsContainerStyle: {
    margin: 20,
    backgroundColor: '#fff',
   },
   buttonContainer: {
    alignSelf: "stretch",
    margin: 10,
    marginTop: 5,
    marginBottom: 10,
    padding: 15,
  },
  buttonText: {
    justifyContent: 'center',
    paddingTop: 12,
    fontSize: 15,
    textAlign: "center",
    backgroundColor: '#78e9ff',
    color: '#3f7a86',
    //设置圆角
    borderRadius: 21,
    overflow: 'hidden',
    height: 42,
  },
  containerItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    flexDirection: "row",
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
  },
  itemContent: {
    fontSize: 16,
    textAlign: 'left',
    color: '#404040',
    margin: 10,
    marginLeft: 20,
    marginRight: 0,
    width: Dimensions.get("window").width - 90,
  },
});

const mapStateToProps = (state) => {
  const { CheckItem } = state;
  return {
    CheckItem
  };
};

const mapDispatchToProps = (dispatch) => {
  const detailActions = bindActionCreators(DetailCreators, dispatch);
  return {
    detailActions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewDetail);

// export default connect((state) => {
//     const { CheckItem } = state;
//     return {
//         CheckItem
//     }
// }, { checkItem })(NewDetail)

// /**
//  * 将state,action绑定到props
//  */
// export default connect((state) => {
//     const {CheckItem} = state;// => var Main = state.Main;调用rootReducer中声明的reducer
//     return {
//         CheckItem // 1.相当于返回Main:Main，当key和value相同时，可省略key ==> es6（即可通过this.props.Main获取state中的状态值）
//     }
// }, { checkItem }) // 2.注入action,即可调用action中声明的方法,（即可通过this.props.main获取,用于调用main中的方法）
// (NewDetail)// 3.将组件注入