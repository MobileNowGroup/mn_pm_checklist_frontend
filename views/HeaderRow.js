//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';

// create a component
class HeaderRow extends Component {
    constructor(props) {
        super(props);
        HeaderRow.propTypes = {
            callbackFunc: React.PropTypes.func,
        };
        this.handlePress = this.handlePress.bind(this);
    }
    componentWillMount(){
        // console.log("props are " + this.props.name);
        
    }

    handlePress() {
        this.props.callbackFunc();
    }

    render() {
        return (
            <TouchableOpacity underlayColor="lightgray" onPress={this.handlePress}>
                <View style={styles.container}>
                    <Text style={styles.text}>{this.props.name}</Text>
                </View>
            </TouchableOpacity>
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
    text: {
        fontSize: 16,
    },
});

//make this component available to the app
export default HeaderRow;
