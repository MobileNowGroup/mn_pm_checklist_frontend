//import liraries
import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

// create a component
class Home extends Component {
    constructor(props){
        super(props);
        // this.newRelease = this.newRelease.bind(this);
    };

    // newRelease = (navigation) => {
    //     navigation.navigate('New')
    // };

    render() {
        // const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Text>Home</Text>
            </View>
        );
    }

    static navigationOptions = ({navigation}) => {
        return{
            title: 'MNReleaseTool',
            headerRight: (
                <Button title=' + ' onPress={() => navigation.navigate('New')}/>
            ),
        }
    };
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
export default Home;
