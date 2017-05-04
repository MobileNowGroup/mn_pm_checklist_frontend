//import liraries
import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, Alert, ListView } from 'react-native';
import Row from '../rows/Row';

// create a component
class Home extends Component {
    constructor(props){
        super(props);
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state = {
            items: ['aaa', 'bbb', 'ccc'],
            dataSource: ds.cloneWithRows([]),
        };
        this.setSource = this.setSource.bind(this);
    };

    setSource(items){
        this.setState({
            // items: items, 
            dataSource: this.state.dataSource.cloneWithRows(items),
        })
    }

    componentWillMount(){
        this.setSource([{name: "aaa"}, {name: "bbb"}]);
    }

    render() {
        return (
            <View style={styles.container}>
                <ListView
                style = {styles.list}
                enableEmptySections
                dataSource = {this.state.dataSource}
                renderRow={(data) => <Row {...data}/>}
                /*renderRow = {({key, ...value}) => {
                        return (
                            <Row
                            key = {key}
                            {...value}
                            />
                        )
                    }}*/
                />
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
    list: {

    },
    separator: {

    },
});

//make this component available to the app
export default Home;
