import React from 'react';
import { StackNavigator } from 'react-navigation';
import Home from '../screens/Home';
import New from '../screens/New';
import Detail from '../screens/Detail';

export const Root = StackNavigator({
    Home: { screen: Home },
    New: { screen: New },
    Detail: { screen: Detail },
});
