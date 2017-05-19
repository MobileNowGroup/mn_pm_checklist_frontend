import { TabNavigator } from "react-navigation";
import ProjectScreen from "./ProjectScreen";
import CheckItemScreen from "./CheckItemScreen";

const ManagerTabNavigator = TabNavigator({
  Recent: { screen: ProjectScreen },
  All: { screen: CheckItemScreen }
});

export default ManagerTabNavigator;
