/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ChatScreen from '../screens/ChatScreen';
import LanguageScreen from '../screens/LanguageScreen';
import MessageScreen from '../screens/MessageScreen';
import { BottomTabParamList, TabOneParamList, TabThreeParamList, TabTwoParamList } from '../types';


const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Mensajes"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name="Mensajes"
        component={MessageNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="chatbox-ellipses-outline" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Chat"
        component={ChatNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="chatbubbles-outline" color={color} />,
        }}
      />

      <BottomTab.Screen
        name="Idiomas"
        component={LanguageNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="build-outline" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<TabOneParamList>();

function MessageNavigator() {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="MessageScreen"
        component={MessageScreen}
        options={{ headerTitle: 'Mensajes' }}
      />
    </TabOneStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function ChatNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ headerTitle: 'Chat' }}
      />
    </TabTwoStack.Navigator>
  );
}

const TabThreeStack = createStackNavigator<TabThreeParamList>();

function LanguageNavigator() {
  return (
    <TabThreeStack.Navigator>
      <TabThreeStack.Screen
        name="LanguageScreen"
        component={LanguageScreen}
        options={{ headerTitle: 'Idiomas' }}
      />
    </TabThreeStack.Navigator>
  );
}
