//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

// create a component
class HomeRow extends Component {
    componentWillMount(){
        console.log("props are " + this.props.name);
    }

    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.photo} source={{url: "https://randomuser.me/api/portraits/thumb/women/53.jpg"}}/>
                <Text style={styles.text}>{this.props.name}</Text>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    photo: {
        height: 40,
        width: 40,
        backgroundColor: "#838833",
        borderRadius: 20,
    },
    text: {
        marginLeft: 12,
        fontSize: 16,
    },
});

//make this component available to the app
export default HomeRow;
