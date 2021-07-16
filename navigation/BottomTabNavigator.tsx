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
import { BottomTabParamList, ChatTabParamList, LanguageTabParamList} from '../types';


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
const ChatTab = createStackNavigator<ChatTabParamList>();

function MessageNavigator() {
  return (
    <ChatTab.Navigator>
      <ChatTab.Screen
        name="MessageScreen"
        component={MessageScreen}
        options={{ headerTitle: 'Mensajes' }}
      />
      <ChatTab.Screen
      name="Chat"
      component={ChatScreen}
      options={({route}) => ({
        title: route.params.userName,
        headerBackTitleVisible: false,
      })}
    />
    </ChatTab.Navigator>
  );
}

const LanguageTab = createStackNavigator<LanguageTabParamList>();

function LanguageNavigator() {
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
