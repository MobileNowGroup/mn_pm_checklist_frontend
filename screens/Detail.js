import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

class Detail extends Component {

    static navigationOptions = (props) => ({
        // this.getReleaseDetail(props.navigation.state.params.id),
        // this.state.releaseId: props.navigation.state.params.id,
        title: 'MNReleaseTool',
        headerRight: (
            <Button title='保存' onPress={() => console.log(props.navigation.state.params.id)} />
        ),
    })

    constructor(props) {
        super(props);
        this.state = {
            releaseId: 10000
        };
    }

    componentWillMount() {
        console.log('release id is ' + this.state.releaseId);
        // this.getReleaseDetail();
    }

    getReleaseDetail(releaseId) {

    }

    render() {
        return (
            <View style={styles.container}>
                <Text>{this.props.navigation.navigate.releaseIdKey}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

export default Detail;
