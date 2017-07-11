import React, { Component } from "react";
import { View, Text, StyleSheet, Alert, ListView,TouchableOpacity,Dimensions,Image,DeviceEventEmitter } from "react-native";
import axios from "axios";
import ItemRow from "../views/ItemRow";
import SegmentedControlTab from "react-native-segmented-control-tab";
import Button from '../app/components/Button';
import { commonstyles } from '../common/CommonStyles'
import * as Api from '../app/constant/api';
import * as DetailCreators from '../redux/actions/releaseDetailAction';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ToastUtil from '../tool/ToastUtil';
import Loading from '../app/components/Loading';

/**
 * 用于标识当前题目是否已经全部选中
 */
let flag = false

class Detail extends Component {
  static navigationOptions = props => {
    const { state, setParams } = props.navigation;
    return {
      title: state.params.releaseTitle,
      headerRight: (
        <TouchableOpacity onPress={state.params.handleDelete}>
            <Text style={{color: '#f47411',marginRight: 15}} >删除</Text>
        </TouchableOpacity>
      ),
      headerStyle: commonstyles.headerStyle,
      headerTitleStyle: commonstyles.headerTitleStyle,
      headerTintColor: 'black',
    };
  };

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      releaseId: this.props.navigation.state.params.releaseId,
      selectedIndex: 0,
      dataSource: ds.cloneWithRows([]),
      listViewNeedRerender: false,
      detailData: {},
      checkItemData: [],
      isLoading: true,
      bottomBtnTitle: '保存',
      isFinished: false,
    };
    this.setSource = this.setSource.bind(this);
    this.save = this.save.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.itemOnPress = this.itemOnPress.bind(this);
    this.renderLoading = this.renderLoading.bind(this);
    this.setDataSource = this.setDataSource.bind(this);
    this.publish = this.publish.bind(this);
    this.deleteRelease = this.deleteRelease.bind(this);
    this.handleResult = this.handleResult.bind(this);
    this.handlePublishResult = this.handlePublishResult.bind(this);
    this.handleDeleteResult = this.handleDeleteResult.bind(this);

  }

  componentWillMount() {
    //加载题目列表及release详情
    const { detailActions } = this.props;
    detailActions
      .releaseDetail(this.state.releaseId,this.state.isLoading)
      .then(response => this.setDataSource(response))
  }

  componentDidMount() {
    //绑定导航栏右侧的点击事件
    this.props.navigation.setParams({ handleDelete: this.deleteRelease});
    console.log(this.state.releaseId);
  }

 componentWillUnmount() {
     //清空定时器
    clearTimeout(this.timer);
  }

  /**
   * 设置数据源
   */
  setDataSource(response) { 

    const { detailData,checkItemList } = response;
    if (detailData.Status == 6) {
      //如果当前的状态是已发布,右上角按钮则隐藏
      this.setState({
        bottomBtnTitle: '',
        isFinished: true,
      })
    }else {
      //判断题目是否已检查完毕
      let result = true;
      for (let i = 0; i < checkItemList.length; i ++) {
      let anItem = checkItemList[i];
      if (anItem.IsChecked === false || anItem.IsChecked === 0) {
        result = false
        }
      }
      flag = result;
      //如果已检查完毕
      if (result === true) {
        this.setState({
          bottomBtnTitle: '发布',
          isFinished: false,
        })
      }
   }
    

    //刷新列表 
    this.setState({
      detailData,
      isLoading: response.isLoading,
      checkItemData: checkItemList,
      dataSource: this.state.dataSource.cloneWithRows(checkItemList),
    })
  }

  /**
   * 保存
   */
  save() {

    if (this.state.bottomBtnTitle == '发布') {
      this.publish();
      return;
    }

   let tempItems = this.state.checkItemData;
   if (tempItems.length == 0) {
     ToastUtil.showShort('当前无数据');
     return
   }

    this.setState({
      isLoading: true,
    })

   let checkedItems = [];
   let unCheckedItems = [];
   for (let i = 0;i < tempItems.length; i++) {
     var anItem = tempItems[i];
     if (anItem.IsChecked == 1) {
       checkedItems.push(anItem.RecordId);
     }else {
       unCheckedItems.push(anItem.RecordId);
     }
   }
   if (unCheckedItems.length === 0) {
     flag = true;
   }else {
     flag = false;
   }
   let params = {'check_items': checkedItems,'uncheck_items': unCheckedItems};
   const { detailActions } = this.props;
   detailActions
     .editRelease(this.state.releaseId,params,true)
     .then(response => this.handleResult(response))
  }

  /**
   * 删除release
   */
  deleteRelease() {
     //开始加载动画
    this.setState({
      isLoading: true,
    })
    //开始删除 
    const { detailActions } = this.props;
    detailActions
     .deleteRelease(this.state.releaseId,true)
     .then(response => this.handlePublishResult(response))

  }

  /**
   * 
   * @param {object} response 
   * 处理删除release的结果 
   */
  handleDeleteResult(response) {
    //停止加载动画
    this.setState({
      isLoading: response.isLoading
    })
    if (response.editResult == true) {
        //发送刷新列表成功的通知
      DeviceEventEmitter.emit('RefreshNotification');
      this.timer =  setTimeout(() => {
        ToastUtil.showShort('删除成功')
        this.props.navigation.goBack();
      },500);
    }else {
      this.timer =  setTimeout(() => {
        ToastUtil.showShort('删除失败，请重试')
      },500);
    }
  }
  
  /**
   * 处理返回结果
   * @param {*结果} isSuccess 
   */
  handleResult(response) {
    //停止加载动画
    this.setState({
      isLoading: response.isLoading
    })
     
    //如果题目已做完，且保存成功，则提示用户发布
    if (flag == true && response.editResult == true) {
      this.setState({
          bottomBtnTitle: '发布',
          isFinished: false,
        })
        // iOS和Android上都可用
        this.timer =  setTimeout(() => {
          Alert.alert(
         '温馨提示',
         '检查完毕，是否发布此版本？',
         [
           {text: '取消', onPress: () => console.log('取消发布'),style: 'cancel'},
           {text: '发布', onPress: () => this.publish()},
         ],
         { cancelable: false }
        )},500);
        return
    }
    //如果没有检查完毕，则提示保存成功或失败
    if (response.editResult == true) {
      this.timer =  setTimeout(() => {
        ToastUtil.showShort('保存成功')
        this.props.navigation.goBack();
      },500);
    }else {
      this.timer =  setTimeout(() => {
        ToastUtil.showShort('保存失败，请重试')
      },500);
    }
  }
  
  /**
   * 发布
   */
  publish() {
    let tempItems = this.state.checkItemData;
    if (tempItems.length == 0) {
      ToastUtil.showShort('当前无数据');
      return
    }
    //开始加载动画
    this.setState({
      isLoading: true,
    })
    //开始发布
    const { detailActions } = this.props;
    console.log('开始发布.....')
    detailActions
     .publishRelease(this.state.releaseId,true)
     .then(response => this.handlePublishResult(response))
  }
  
  /**
   * 
   * @param {object} isSuccess 
   * 处理发布release的返回结果 
   */
  handlePublishResult(response) {
     //停止加载动画
    this.setState({
      isLoading: response.isLoading
    })

    if (response.publishResult == true) {
        //发送刷新列表成功的通知
      DeviceEventEmitter.emit('RefreshNotification');
      this.timer =  setTimeout(() => {
        ToastUtil.showShort('发布成功')
        this.props.navigation.goBack();
      },500);
    }else {
      this.timer =  setTimeout(() => {
        ToastUtil.showShort('发布失败，请重试')
      },500);
    }

  }
  
  /**
   * 
   * 切换显示数据
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

    this.setState({
      checkItemData: this.state.checkItemData,
      dataSource: this.state.dataSource.cloneWithRows(sortedItems),
    })
  }
  
  /**
   * SegmentedControlTab点击事件
   */
  handleIndexChange = index => {
    // set state is asynchronous
    this.setState({ selectedIndex: index }, function() {
      this.setSource(this.state.checkItemData);
    });
  };

  /**
   * 
   * 单元格点击事件 
   */
  itemOnPress(item) {
  //如果当前release已发布，则不允许更改
   if (this.state.detailData.Status == 6) {
     return;
   }

    item.IsChecked = !item.IsChecked;
    //在题目检查完毕时，再修改单元格的状态，则将flag重置为false,底部按钮重置为保存
    if (flag == true) {
      flag = false;
      this.setState({
          bottomBtnTitle: '保存',
          isFinished: false,
        })
    }

    for (let i = 0; i < this.state.checkItemData.length; i++) {
      let anItem = this.state.checkItemData[i];
      if (anItem.ItemId == item.ItemId) {
        anItem.IsChecked = item.IsChecked
      }
    }
    let tempItems = JSON.parse(JSON.stringify(this.state.checkItemData));
    this.setSource(tempItems)
  }
  
  /**
   * 
   * 刷新单元格  
   */
  renderItem(item) {
    console.log('ItemTitle  ' + item.ItemTitle)
    let source = require('../img/selected_icon.png')
    if (item.IsChecked === false || item.IsChecked === 0 ) {
        source = require('../img/unSelected_icon.png')
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

  /**
   * 加载动画
   */
  renderLoading() {
    return <Loading visible={this.state.isLoading} size='large' color='white'/>;
  }

  render() {
    // const { ReleaseDetail } = this.props;
    // isLoading = ReleaseDetail.isLoading;

    return (
      <View style={styles.container}>
        {this.renderLoading()}
        <View style={styles.segmentedContainer} >
          <SegmentedControlTab
            values={["全部", "通过", "未通过"]}
            selectedIndex={this.state.selectedIndex}
            onTabPress={this.handleIndexChange}
            tabStyle={styles.tabStyle}
            activeTabStyle={styles.activeTabStyle}
            tabsContainerStyle={styles.tabsContainerStyle}
            tabStyle={styles.tabStyle}
          />
        </View>
        <ListView
          style={styles.list}
          enableEmptySections
          dataSource={this.state.dataSource}
          renderRow={this.renderItem}
          renderSeparator={(sectionId, rowId) => (
            <View key={rowId} style={styles.seperator} />
          )}
        />
        {this.state.isFinished == true
         ? null
         : <Button 
            onPress={this.save}
            text={this.state.bottomBtnTitle}
            style={styles.buttonText}
            containerStyle={styles.buttonContainer}
           />
          }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  list: {
    flex: 1,
    backgroundColor: 'white',
  },
  seperator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#cccccc"
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
});

const mapStateToProps = (state) => {
  const { ReleaseDetail } = state;
  return {
    ReleaseDetail
  };
};

const mapDispatchToProps = (dispatch) => {
  const detailActions = bindActionCreators(DetailCreators, dispatch);
  return {
    detailActions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Detail);