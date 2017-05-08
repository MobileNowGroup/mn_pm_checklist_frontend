//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableHighlight, Alert } from 'react-native';

// create a component
class HeaderRow extends Component {
    constructor(props) {
        super(props);
        HeaderRow.propTypes = {
            callbackFunc: React.PropTypes.func,
        };
        this.handlePress = this.handlePress.bind(this);
    }

    componentWillMount() {
        // console.log("props are " + this.props.name);
        
    }

    handlePress() {
        this.props.callbackFunc(this.props.ProjectId);
    }

    render() {
        return (
            <TouchableHighlight underlayColor="lightgray" onPress={this.handlePress}>
                <View style={styles.container}>
                    <Text style={styles.text}>{this.props.ProjectName}</Text>
                </View>
            </TouchableHighlight>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        width: 100,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    text: {
        fontSize: 16,
    },
});

//make this component available to the app
export default HeaderRow;
