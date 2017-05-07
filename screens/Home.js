//import liraries
import React, { Component } from 'react';
import { View, Button, StyleSheet, Alert, ListView } from 'react-native';
import HomeRow from '../views/HomeRow';
import Header from '../views/Header';

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
            items: ['aaa', 'bbb', 'ccc'],
            dataSource: ds.cloneWithRows([]),
        };
        this.setSource = this.setSource.bind(this);
    }

    componentWillMount() {
        this.setSource([{ name: 'aaa' }, { name: 'bbb' }]);
    }

    setSource(items) {
        this.setState({
            // items: items, 
            dataSource: this.state.dataSource.cloneWithRows(items),
        });
    }

    handleCallback() {
        Alert.alert('call back');
    }

    render() {
        return (
            <View style={styles.container}>
                <ListView
                style={styles.list}
                enableEmptySections
                dataSource={this.state.dataSource}
                renderRow={(data) => <HomeRow {...data} />}
                renderSeparator={(sectionId, rowId) => <View 
                    key={rowId} 
                    style={styles.seperator} 
                />}
                renderHeader={() => <Header callbackFunc={this.handleCallback.bind(this)} />}
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
