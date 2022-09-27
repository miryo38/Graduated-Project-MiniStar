import { View, Text } from 'react-native'
import React from 'react'
import {createStackNavigator} from '@react-navigation/stack';
import Miniroom from './Miniroom';
import CheckItem from './CheckItem';
import Ionicons from 'react-native-vector-icons/Ionicons';
const Stack = createStackNavigator();
const MiniroomStack = () => {
  return (
    <Stack.Navigator>
    <Stack.Screen
        name="Miniroom"
        component={Miniroom}
        options={{
          headerShown: true,
          title: '미니룸',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Jalnan',
            color: '#696969',
          },
          headerStyle: {
            backgroundColor: '#fff',
            shadowColor: '#fff',
            elevation: 0,
          },
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <View style={{marginLeft: 15}}>
              <Ionicons name="arrow-back" size={25} color="#2e64e5" />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="CheckItem"
        component={CheckItem}
        options={{
          title: 'CheckItem',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Jalnan',
            color: '#696969',
          },
          headerStyle: {
            backgroundColor: '#fff',
            shadowColor: '#fff',
            elevation: 0,
          },
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <View style={{marginLeft: 15}}>
              <Ionicons name="arrow-back" size={25} color="#2e64e5" />
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  )
}

export default MiniroomStack