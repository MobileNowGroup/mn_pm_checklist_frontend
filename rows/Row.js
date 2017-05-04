//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// create a component
class Row extends Component {
    componentWillMount(){
        console.log("props are " + this.props.name);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>{this.props.name}</Text>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default Row;
