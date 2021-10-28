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
 import ConfigurationScreen from '../screens/ConfigurationScreen'
 import { ConfigurationParamList} from '../types';
 


const ConfigurationTab = createStackNavigator<ConfigurationParamList>();

export default function ConfigurationNavigator({route}: {route: any}) {
  let token = route.params.ctoken
  let uid = route.params.cUid
  return (
    <ConfigurationTab.Navigator>
      <ConfigurationTab.Screen
        name="ConfigurationScreen"
        component={ConfigurationScreen}
        options={{ headerTitle: 'Configuración' }}
        initialParams={{ctoken: token, cUid: uid}}
      />
    </ConfigurationTab.Navigator>
  );
}