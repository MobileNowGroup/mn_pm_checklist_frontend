//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';

// create a component
class HomeRow extends Component {

    constructor(props) {
        super(props);
        HomeRow.propTypes = {
            callbackFunc: React.PropTypes.func,
        };
        this.handlePress = this.handlePress.bind(this);
    }

    componentWillMount() {
        
    }

    handlePress() {
        // this.props.callbackFunc(this.props.ProjectId);
        this.props.callbackFunc(this.props.ReleaseId);
    }

    render() {
        return (
            <TouchableHighlight underlayColor="lightgray" onPress={this.handlePress}>
                <View style={styles.container}>
                    <Text style={styles.text}>{this.props.ReleaseTitle}</Text>
                    <Text style={styles.subText}>{this.props.ReleaseDate}</Text>
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
        height: 40,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    text: {
        marginLeft: 12,
        fontSize: 16,
    },
    subText: {
        fontSize: 14,
        marginLeft: 12,
    }
});

//make this component available to the app
export default HomeRow;
