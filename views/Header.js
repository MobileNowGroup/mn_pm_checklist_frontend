import React, {Component} from 'react';
import { View, ListView, Text, StyleSheet } from 'react-native';

class Header extends Component{
    constructor(props){
        super(props);
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state = {
            projects: ['aaa', 'bbb', 'ccc'],
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
        this.setSource([{name: "ccc"}, {name: "ddd"}]);
    }

    render() {
        return (
            <View style={styles.container}>
                <ListView
                style = {styles.list}
                enableEmptySections
                dataSource = {this.state.dataSource}
                renderRow={(data) => <Text>{data.name}</Text>}
                renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator}/>}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    list: {
        
    },
});

export default Header;