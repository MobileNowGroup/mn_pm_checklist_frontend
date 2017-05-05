import React, {Component} from 'react';
import { View, ListView, Text, StyleSheet, Alert } from 'react-native';
import HeaderRow from '../views/HeaderRow';

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
        Header.propTypes = {
            callbackFunc: React.PropTypes.func,
        };
        this.setSource = this.setSource.bind(this);
        this.handleCallback = this.handleCallback.bind(this);
    };

    setSource(items){
        this.setState({
            // items: items, 
            dataSource: this.state.dataSource.cloneWithRows(items),
        })
    }

    componentWillMount(){
        this.setSource([{name: "ccc"}, {name: "ddd"}, {name: "eee"}, {name: 'fff'}, {name: "ggg"}]);
    }

    render() {
        return (
            <View style={styles.container}>
                <ListView
                horizontal={true}
                style = {styles.list}
                enableEmptySections
                dataSource = {this.state.dataSource}
                renderRow={(data) => <HeaderRow {...data} callbackFunc={this.handleCallback}/>}
                renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator}/>}
                />
            </View>
        );
    }

    handleCallback() {
        // Alert.alert("handle callback entered");
        this.props.callbackFunc();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    list: {
        flex: 1,
        padding: 12,
        flexDirection: 'column',
    },
    row: {
        height: 40,
        width: 80,
        padding: 10,
    },
});

export default Header;