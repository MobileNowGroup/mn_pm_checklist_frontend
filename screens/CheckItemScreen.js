import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ListView,
  TouchableOpacity,
  Swipeout,
  TouchableHighlight,
  Image,
  RefreshControl,
} from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import NewCheckItemScreen from "./NewCheckItemScreen";
import * as DetailCreators from '../redux/actions/checkItemActions';
import { commonstyles } from '../common/CommonStyles';
import * as timeTool from "../tool/timeTool";
import Loading from '../app/components/Loading';

/**
 * 初始化状态
 */
let isLoading = false;
let isRefreshing = false;

let flag = false;
let flag2 = false;
let number = 0;
let first = null;



class CheckItemScreen extends Component {
  static navigationOptions = props => {
    const { state, setParams } = props.navigation;
    return {
        title: "题库",
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
      checkItemData: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
    };
    this.new = this.new.bind(this);
    this.setDataSource = this.setDataSource.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.itemOnPress = this.itemOnPress.bind(timeTool);
  }

  componentDidMount() {
     //绑定导航栏右侧按钮的点击事件
    this.props.navigation.setParams({ handleNew: this.new });
    // 加载题目列表
    const { detailActions } = this.props;
    detailActions
      .checkItem(isLoading)
      .then(response => this.setDataSource(response))
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
  setDataSource(response) {

    isLoading = false;
    
    if (response.checkItems.length !== 0) {
      flag = true;
      number = response.checkItems.length;
      first = response.checkItems[5];
    }

    // this.setState({
    //   checkItemData: response.checkItems,
    //   dataSource: this.state.dataSource.cloneWithRows(response.checkItems)
    // });
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.checkItems !== this.props.checkItems) {
    //   this.setSource(nextProps.checkItems);
    // }
  }
  
  /**
   * 下拉刷新
   * 
   * @memberof CheckItemScreen
   */
  onRefresh() {
    isLoading = false;
    isRefreshing = true;

     //加载题目列表
    const { detailActions } = this.props;
    detailActions
      .checkItem(isLoading)
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
    const { detailActions } = this.props;
    detailActions
      .deleteCheckItem(itemData.ItemId,rowId)
      .then(response => this.setDataSource(response.checkItems))
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
   * 
   * 刷新单元格
   * @param {any} itemData 
   * @memberof CheckItemScreen
   */
  // renderItem() {
  //   return <View style={{height: 30,backgroundColor: 'red'}} />
  // }

  renderItem(itemData,rowID) {
    let swipeBtns = [
      {
        text: "删除",
        backgroundColor: "red",
        underlayColor: "rgba(0, 0, 0, 0.6)",
        onPress: () => {
          this.deleteItem(itemData,rowID);
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
            <Text style={styles.itemText} numberOfLines={1}>
              {itemData.ItemTitle}
            </Text>
            <Text style={styles.itemSubText}>
              {"更新时间时间：" +
                timeTool.formatTimeString(itemData.UpdatedAt)}
            </Text>
            <Text style={styles.itemSubText}>
              {"是否必须：" + (Boolean(itemData.IsMandatory) ? "是" : "否")}
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
    height: 80,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start"
  },
  itemText: {
    height: 25,
    marginLeft: 12,
    fontSize: 16,
    marginTop: 10,
  },
  itemSubText: {
    fontSize: 12,
    marginLeft: 12,
    marginTop: 2,
    color: "gray"
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

