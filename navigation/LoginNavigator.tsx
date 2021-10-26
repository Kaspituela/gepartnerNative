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
 import LoginScreen from '../screens/LoginScreen';
 import MessageScreen from '../screens/MessageScreen';
 import { LoginParamList} from '../types';
 


const LoginTab = createStackNavigator<LoginParamList>();

export default function LoginNavigator() {
  return (
    <LoginTab.Navigator>
      <LoginTab.Screen
        name="LoginScreen"
        component={LoginScreen}
      />
    </LoginTab.Navigator>
  );
}