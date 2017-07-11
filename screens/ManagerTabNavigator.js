import { TabNavigator } from "react-navigation";
import ProjectScreen from "./ProjectScreen";
import CheckItemScreen from "./CheckItemScreen";

const ManagerTabNavigator = TabNavigator(
  {
  Recent: 
    { 
      screen: ProjectScreen,
      // navigationOptions: ({navigation}) => ({
      //   tabBarLabel: '项目',
      // })
     },
  All: 
    { 
      screen: CheckItemScreen,
      // navigationOptions: ({navigation}) => ({
      //   tabBarLabel: '全部',
      // })
     }
 },
 {
    lazy: true,
    tabBarPosition: 'bottom',
    tabBarOptions: {
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
