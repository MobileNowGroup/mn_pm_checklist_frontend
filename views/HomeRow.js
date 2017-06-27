import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableHighlight,Image } from "react-native";
import { convertTimeStampToDate } from '../tool/timeTool';

class HomeRow extends Component {
  constructor(props) {
    super(props);
    HomeRow.propTypes = {
      callbackFunc: React.PropTypes.func
    };
    this.handlePress = this.handlePress.bind(this);
  }

  componentWillMount() {}

  handlePress() {
    this.props.callbackFunc(this.props.ReleaseId, this.props.ReleaseTitle);
  }

  render() {
    return (
      <TouchableHighlight underlayColor="lightgray" onPress={this.handlePress}>
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.text}>{this.props.ReleaseTitle}</Text>
            <Text style={styles.subText}>{convertTimeStampToDate(this.props.ReleaseDate)}</Text>
          </View>
          <View style={styles.arrowContainer} >
            <Image source={require('../img/arrow_icon.png')} />
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   flexDirection: 'row',
  },
  arrowContainer: {
    justifyContent: 'center',
    marginRight: 15,
    
  },
  content: {
    flex: 1,
    padding: 0,
    height: 60,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start"
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
    marginTop: 10,
    color: '#404040'
   // fontWeight: "bold"
  },
  subText: {
    fontSize: 14,
    marginLeft: 12,
    marginTop: 5,
    color: '#828282',
  }
});

export default HomeRow;
