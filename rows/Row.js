//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

// create a component
class Row extends Component {
    componentWillMount(){
        console.log("props are " + this.props.name);
    }

    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.photo} source={{url: "https://randomuser.me/api/portraits/thumb/women/53.jpg"}}/>
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
    photo: {
        height: 40,
        width: 40,
        backgroundColor: "#838833"
    },
});

//make this component available to the app
export default Row;
