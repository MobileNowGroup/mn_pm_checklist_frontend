//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Picker,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";
import ReactNative from 'react-native';

import DatePicker from 'react-native-datepicker'
import ToastUtil from '../tool/ToastUtil';
import Button from '../app/components/Button'
import * as timeTool from "../tool/timeTool";
import { commonstyles } from '../common/CommonStyles'

// create a component
class New extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "新 增",
    headerStyle: commonstyles.headerStyle,
    headerTitleStyle: commonstyles.headerTitleStyle,
  });
  constructor(props) {
    super(props);
    this.state = {
      behavior: "padding",
      selectedName: "",
      showPicker: 0,
      showDatePicker: 0,
      projectId: 0,
      projects: [],
      versionText: '',
      updateText: '',
      releaseTitle: '',
      //当前日期
      date: timeTool.getNowFormatDate(),
    };
     this.nextBtnClick = this.nextBtnClick.bind(this);
     this.scrollViewTo = this.scrollViewTo.bind(this);
  }

  componentWillMount() {
    //获取上个页面传过来的projects的值
    let projects = this.props.navigation.state.params.projects;
    this.setState({
      projects: projects,
    })
  }
  
  /**
   * 
   * scrollView滑动到指定高度
   * @param {any} event 
   * @memberof New
   */
  scrollViewTo(event) {
    let target = event.nativeEvent.target;
    let scrollLength = 160;
    this.refs.scroll.scrollTo({x: 0,y: scrollLength,animated: true});
  }
  
  /**
   * 
   * 显示或隐藏选择项目的picker
   * @param {bool} show 
   * @memberof New
   */
  showPicker(show) {
    if (show == true) {
      //隐藏键盘
      const dismissKeyboard = require('dismissKeyboard');
      dismissKeyboard()
    }
    
    this.setState({
      showPicker: show,
      showDatePicker: 0
    });
  }
  /**
   * 
   * 显示或隐藏选择日期的picker
   * @param {bool} show 
   * @memberof New
   */
  showDatePicker(show) {
    this.setState({
      showPicker: 0,
      showDatePicker: show
    });
  }

  //下一步
  nextBtnClick() {
    if (this.state.selectedName.length == 0 || this.state.selectedName.replace(/\s+/g, '') === '') {
      ToastUtil.showShort('请选择app哦~');
      return;
    } else if (this.state.versionText.length == 0 || this.state.versionText.replace(/\s+/g, '') === '') {
      ToastUtil.showShort('请填写版本哦~');
      return;
    }else if (this.state.releaseTitle.length == 0 || this.state.releaseTitle.replace(/\s+/g, '') === '') {
      ToastUtil.showShort('请填写标题哦~');
      return;
    }
    let parentKey = this.props.navigation.state.key;
    let projectId = this.state.projects[this.state.projectId].ProjectId;
    this.props.navigation.navigate("NewDetail", {
      projectId,
      appName: this.state.selectedName,
      versionText: this.state.versionText,
      updateText: this.state.updateText,
      releaseDate: this.state.date,
      releaseTitle: this.state.releaseTitle,
      parentKey,
    });
  }

  render() {
    return (
      <ScrollView ref='scroll' keyboardShouldPersistTaps='always' style={styles.container}>
        <View style={styles.content} onStartShouldSetResponderCapture={(event) => {
          const target = event.nativeEvent.target;
          if (target !== ReactNative.findNodeHandle(this.refs.updateInput)) {
            this.refs.updateInput.blur();
          }
        }}>
          <View style={styles.rowContainer}>
            <Text style={styles.subTitle}>选择app:</Text>
              <TextInput
                placeholder="请选择"
                style={styles.textInput}
                value={this.state.selectedName}
                onFocus={() => this.showPicker(1)}
              />
          </View>
          <View style={styles.rowContainer} >
            <Text style={styles.subTitle}>输入标题:</Text>
              <TextInput
                style={styles.textInput}
                onTouchStart={() => this.showPicker(0)}
                onChangeText={(text) => {
                this.state.releaseTitle = text;
                }}
              />
          </View>
          <View style={styles.rowContainer} >
            <Text style={styles.subTitle}>输入版本号:</Text>
              <TextInput
                style={styles.textInput}
                onTouchStart={() => this.showPicker(0)}
                keyboardType='decimal-pad'
                onChangeText={(text) => {
                this.state.versionText = text;
                }}
              />
          </View>
          <View style={styles.rowContainer} >
            <Text style={styles.subTitle}>选择发布日期:</Text>
              <DatePicker 
                style={{marginLeft: 0,width: 170 }} 
                date={this.state.date}
                mode='date'
                placeholder='选择日期'
                format='YYYY-MM-DD'
                minDate={this.state.date}
                confirmBtnText='确定'
                cancelBtnText='取消'
                onDateChange={(date) => {this.setState({date: date})}} 
              />
          </View>
          <View style={styles.updateContainer} >
            <Text style={styles.subTitle}>更新内容:</Text>
              <TextInput
                style={styles.textInputMutibleLine}
                ref = 'updateInput'
                multiline={true}
                onTouchStart={() => this.showPicker(0)}
                onChangeText={(text) => {
                this.state.updateText = text;
                }}
                onFocus={this.scrollViewTo}
                onEndEditing={() => this.refs.scroll.scrollTo({x: 0,y: 0,animated: true})}
            />
          </View>
          <Button 
            onPress={this.nextBtnClick}
            text='下一步'
            style={styles.buttonText}
            containerStyle={styles.buttonContainer}
         />
         {this.state.showPicker === 1
          ? <Picker
              style={styles.pickerContent}
               selectedValue={this.state.selectedName}
               onValueChange={(label,value,key) =>
                   this.setState({ selectedName: label,projectId: value })
               }
              >
              {this.state.projects.map((project) => {
                 const typeView = (
                   <Picker.Item label={project.ProjectName} value={project.ProjectName} key={project.ProjectId} />
                );
               return typeView;
               })}
              </Picker>
          : null} 
          </View>
      </ScrollView>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    height: Dimensions.get('window').height,
  },
  content: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    height: Dimensions.get('window').height,
  },
  rowContainer: {
    margin: 0,
    flexDirection: "row",
    alignItems: 'center',
    backgroundColor: 'white',
    height: 60,
    borderBottomWidth: 0.5,
    borderBottomColor: '#cccccc',
  },
  updateContainer: {
    margin: 0,
    flexDirection: "row",
    alignItems: 'center',
    backgroundColor: 'white',
    height: 100,
    borderBottomWidth: 0.5,
    borderBottomColor: '#cccccc',
  },
  subTitle: {
    marginLeft: 20,
    width: 95,
    fontSize: 14,
    textAlign: "left",
    color: '#404040',
  },
  textInput: {
    width: 200,
    fontSize: 16,
  },
  textInputMutibleLine: {
    height: 100,
    width: 200,
    fontSize: 16,
    marginTop: 5,
    marginBottom: 5,
  },
  pickerContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    alignSelf: "stretch",
    margin: 20,
    marginBottom: 0,
    padding: 20,
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
    marginBottom: 0,
  },

});

//make this component available to the app
export default New;
