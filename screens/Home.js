//import liraries
import React, { Component } from 'react';
import { View, Button, StyleSheet, Alert, ListView } from 'react-native';
import HomeRow from '../views/HomeRow';
import Header from '../views/Header';
import axios from 'axios';

// create a component
class Home extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'MNReleaseTool',
        headerRight: (
            <Button title=' + ' onPress={() => navigation.navigate('New')} />
        ),
    })

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state = {
            items: [],
            projects: [],
            dataSource: ds.cloneWithRows([]),
        };
        this.setSource = this.setSource.bind(this);
        this.getReleases = this.getReleases.bind(this);
        this.handleHeaderCallback = this.handleHeaderCallback.bind(this);
        this.handleRowCallback = this.handleRowCallback.bind(this);
    }

    componentWillMount() {
        // this.getProjects();
    }

    getReleases(projectId) {
        axios.get('http://192.168.31.206:3000/project/' + projectId + '/releases')
            .then(response => this.setSource(response.data));
    }

    setSource(items) {
        this.setState({
            // items: items, 
            dataSource: this.state.dataSource.cloneWithRows(items),
        });
    }

    handleHeaderCallback(projectId) {
        console.log(projectId);
        this.getReleases(projectId);
    }

    handleRowCallback(releaseId) {
        this.props.navigation.navigate('Detail');
    }

    render() {
        return (
            <View style={styles.container}>
                <ListView
                style={styles.list}
                enableEmptySections
                dataSource={this.state.dataSource}
                renderRow={(data) => <HomeRow {...data} callbackFunc={this.handleRowCallback} />}
                renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator} />}
                renderHeader={() => <Header callbackFunc={this.handleHeaderCallback} projects />}
                />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    list: {

    },
    seperator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#8E8E8E',
    }
});

//make this component available to the app
export default Home;
