/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
 import { Ionicons } from '@expo/vector-icons';
 import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
 import { createStackNavigator } from '@react-navigation/stack';
 import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
 import * as React from 'react';
 
 import Colors from '../constants/Colors';
 import useColorScheme from '../hooks/useColorScheme';
 import ChatScreen from '../screens/ChatScreen';
 import AdminScreen from '../screens/AdminScreen';
 import MessageScreen from '../screens/MessageScreen';
 import { AdminParamList } from '../types';
 


const AdminTab = createStackNavigator<AdminParamList>();

export default function AdminNavigator({route}: {route: any}) {
  let uid = route.params.userid
  console.log('hjacsbdgchabs chjajxbsjnzd')
  return (
    <AdminTab.Navigator>
      <AdminTab.Screen
        name="AdminScreen"
        component={AdminScreen}
        options={{ headerTitle: 'Admin' }}
        initialParams={{userId: uid}}
      />
    </AdminTab.Navigator>
  );
}
