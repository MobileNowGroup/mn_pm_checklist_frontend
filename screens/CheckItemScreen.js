import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ListView,
  Dimensions,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  RefreshControl,
  DeviceEventEmitter,
  InteractionManager,
} from "react-native";

import NewCheckItemScreen from "./NewCheckItemScreen";
import Swipeout from "react-native-swipeout";
import Loading from '../app/components/Loading';
import * as timeTool from "../tool/timeTool";
import ToastUtil from '../tool/ToastUtil';
import { commonstyles } from '../common/CommonStyles'
import * as Api from '../app/constant/api';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DetailCreators from '../redux/actions/checkItemActions';
import * as Notification from '../app/constant/notification';


/**
 * 初始化状态
 */
let isRefreshing = false;
let deleteIndex = -1;


class CheckItemScreen extends Component {
  static navigationOptions = props => {
    const { state, setParams } = props.navigation;
    return {
        headerTitle: "题库",
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
      isLoading: true,
      checkItemData: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
    };
    this.new = this.new.bind(this);
    this.setDataSource = this.setDataSource.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.itemOnPress = this.itemOnPress.bind(this);
    this.loadData = this.loadData.bind(this);
    this.onRefresh  = this.onRefresh.bind(this);
  }

  componentDidMount() {
     //绑定导航栏右侧按钮的点击事件
    this.props.navigation.setParams({ handleNew: this.new });
    // 加载题目列表
    //用InteractionManager来延时加载
    InteractionManager.runAfterInteractions(() => {
      this.loadData();
    });

    //监听刷新列表的通知
    this.subscription = DeviceEventEmitter.addListener(Notification.CheckItemRefreshNotification, () => {
        //在收到通知后刷新列表
        this.loadData(); 
    });

  }

  componentWillUnmount() {
    //移除通知
    this.subscription.removeAllListeners(Notification.CheckItemRefreshNotification);
  }

  /**
   * 
   * 加载列表
   * @memberof CheckItemScreen
   */
  loadData() {
    //开始加载动画
    this.setState({
      isLoading: true,
    });
    isRefreshing = false;
    const { detailActions } = this.props;
    detailActions
      .checkItem(this.state.isLoading,isRefreshing)
      .then(response => this.setDataSource(response.checkItems))

  }
  
  /**
   * 
   * 新增题目
   * @memberof CheckItemScreen
   */
  new() {
    this.props.navigation.navigate("NewCheckItemScreen");
  }

  /**
   * 
   * 设置数据源
   * @param {array} checkItems 
   * @memberof CheckItemScreen
   */
  setDataSource(checkItems) {

    isRefreshing = false;
    let tempItems = JSON.parse(JSON.stringify(checkItems));

    this.setState({
      isLoading: false,
      checkItemData: tempItems,
      dataSource: this.state.dataSource.cloneWithRows(tempItems),
    });
  }

  // componentWillReceiveProps(nextProps) {
  //   // if (nextProps.checkItems !== this.props.checkItems) {
  //   //   this.setSource(nextProps.checkItems);
  //   // }
  // }
  
  /**
   * 下拉刷新
   * 
   * @memberof CheckItemScreen
   */
  onRefresh() {
   
    this.setState({
      isLoading: false,
    })
    isRefreshing = true;

     //加载题目列表
    const { detailActions } = this.props;
    detailActions
      .checkItem(this.state.isLoading,isRefreshing)
      .then(response => this.setDataSource(response.checkItems))

  }
  
  /**
   * 
   * 删除单元格
   * @param {object} itemData 
   * @param {ind} rowId 
   * @memberof CheckItemScreen
   */
  deleteItem(itemData,rowId) {
    deleteIndex = parseInt(rowId);
    this.setState({
      isLoading: true,
    })
    const { detailActions } = this.props;
    detailActions
      .deleteCheckItem(itemData.ItemId,this.state.isLoading)
      .then(response => this.handleDeleteResult(response))
      .catch(error => this.showError(error));
  }

  /**
   * 处理删除单元格的返回结果
   * @param {any} response 
   * @memberof CheckItemScreen
   */
  handleDeleteResult(response) {
    console.log('deleteIndex: ' + deleteIndex);
    const { CheckItem } = this.props;
    //如果操作成功
    if (response.deleteResult === true && deleteIndex !== -1 && deleteIndex < CheckItem.checkItems.length) {
      //删除数据源，并刷新列表
      CheckItem.checkItems.splice(deleteIndex, 1);
      this.setDataSource(CheckItem.checkItems);
      deleteIndex = -1;
    }else {
      ToastUtil.showShort('删除失败，请重试');
    }

  }
  
  /**
   * 
   * 显示错误信息
   * @param {any} error 
   * @memberof CheckItemScreen
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
   * @param {any} itemData 
   * @memberof CheckItemScreen
   */
  itemOnPress(itemData) {
     this.props.navigation.navigate("NewCheckItemScreen", {
      checkItem: itemData,
    });
  }
  
  /**
   * 没有数据时显示的视图
   * 
   * @memberof CheckItemScreen
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
   * @param {any} itemData 
   * @memberof CheckItemScreen
   */
  renderItem(itemData,sectionId,rowId) {
    console.log('itemTitle:  ' + itemData.ItemTitle);

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
            <Text style={styles.itemText} numberOfLines={1}>{itemData.ItemTitle}</Text>
            <Text style={styles.itemSubText}>
              是否必须: {itemData.IsMandatory === 1 
                         ? <Text style={{color: '#f47411'}} >是</Text>
                         : <Text style={{color: '#666'}} >否</Text>
                       } 
            </Text>
            <Text style={styles.itemTimeText}>{"更新时间时间：" + timeTool.formatTimeString(itemData.UpdatedAt)} </Text>
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
    const { CheckItem } = this.props;
    if (this.state.isLoading === false && CheckItem.checkItems.length === 0) {
      //在数据加载完成后，如果数据为空,则显示空视图
      return this.renderEmptyView();
    }
    return (
      <View style={styles.container}>
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
    backgroundColor: "#fff"
  },
  list: {
    backgroundColor: "#fff"
  },
  seperator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#cccccc"
  },
  itemContainer: {
    flex: 1,
    padding: 0,
   // height: 80,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start"
  },
  itemText: {
    marginLeft: 15,
    marginRight: 15,
    fontSize: 16,
    marginTop: 5,
    color: '#333',
  },
  itemTimeText: {
    fontSize: 12,
    marginLeft: 15,
    marginTop: 5,
    color: "#999",
    marginBottom: 5,
  },
 
  itemSubText: {
    fontSize: 14,
    marginLeft: 15,
    marginTop: 5,
    color: "#666",
  },
  refreshControlBase: {
    backgroundColor: 'transparent'
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

export default connect(mapStateToProps, mapDispatchToProps)(CheckItemScreen);

