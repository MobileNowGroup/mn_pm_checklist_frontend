
import { TabNavigator } from "react-navigation";
import ProjectScreen from "./ProjectScreen";
import CheckItemScreen from "./CheckItemScreen";
import TabBarItem from '../app/components/TabBarItem';
import { Image } from 'react-native';
import React,{ Component } from 'react';

const ManagerTabNavigator = TabNavigator(
  {
  Recent: 
    { 
      screen: ProjectScreen,
      navigationOptions: ({navigation}) => ({
        tabBarLabel: '项目',
        tabBarIcon: ({focused, tintColor }) => (
          <TabBarItem
             normalImage={require('../img/project_normal.png')}
             selectedImage={require('../img/project_selected.png')} 
             tintColor={tintColor}
             focused={focused}
          />
        ),
      })
     },
  All: 
    { 
      screen: CheckItemScreen,
      navigationOptions: ({navigation}) => ({
        tabBarLabel: '题库',
        tabBarIcon: ({focused, tintColor }) => (
          <TabBarItem
             normalImage={require('../img/checkitem_normal.png')}
             selectedImage={require('../img/checkitem_selected.png')} 
             tintColor={tintColor}
             focused={focused}
          />
        )
      })   
     }
 },
 {
    lazy: true,
    tabBarPosition: 'bottom',
    swipeEnabled: false,   //是否允许在标签之间进行滑动
    animationEnabled: false,  //是否在更改标签时显示动画  
    tabBarOptions: {
      activeTintColor: '#51c4d4',
      inactiveTintColor: '#8a8a8a',
      labelStyle: {
        fontSize: 14,  //文字大小
      },
      showIcon: true,
      style: {
        backgroundColor: '#fff'
      },
      indicatorStyle: {
        opacity: 0
      },
      tabStyle: {
        padding: 0
      }
    }
  }
);

export default ManagerTabNavigator;
