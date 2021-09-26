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
 import LanguageScreen from '../screens/LanguageScreen';
 import MessageScreen from '../screens/MessageScreen';
 import { LanguageParamList} from '../types';
 


const LanguageTab = createStackNavigator<LanguageParamList>();

export default function LanguageNavigator() {
  return (
    <LanguageTab.Navigator>
      <LanguageTab.Screen
        name="LanguageScreen"
        component={LanguageScreen}
        options={{ headerTitle: 'Idiomas' }}
      />
    </LanguageTab.Navigator>
  );
}
