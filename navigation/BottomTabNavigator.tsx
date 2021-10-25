/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import CreateTag from '../components/CreateTag';
import FilterTag from '../components/FilterTag';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import CapsulasScreen from '../screens/CapsulaScreen';
import ChatScreen from '../screens/ChatScreen';
import VocabularyScreen from '../screens/VocabularyScreen';
import ChatPerScreen from '../screens/ChatPerScreen';
import ActivityScreen from '../screens/ActivityScreen';
import EstadisticaScreen from '../screens/EstadisticaScreen';
import { BottomTabParamList, CapsulasParamList, ChatParamList, EstadisticaParamList } from '../types';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

const getTabBarVisibility = (route:any) => {
  const routeName = getFocusedRouteNameFromRoute(route);
    const hideOnScreens = ['Chat'];
    if(hideOnScreens.indexOf(routeName as string) > -1) return false;
    return true;
};

const capitalize = (langName: string) => {
  return langName.charAt(0).toUpperCase() + langName.slice(1);
};


export default function BottomTabNavigator({route}: {route: any}) {
  const colorScheme = useColorScheme();

  let language: string = 'null';
  let currentUserId: any = 0;
  let flag: any = 'null';
  let membership = false;
  
  if (route.params === undefined) {
    language = 'spanish';
    currentUserId = 0;
    flag = require('../assets/flags/Spain-Flag-icon.png')
  } else {
    language = route.params.lang;
    currentUserId = route.params.cUserId;
    flag = route.params.langFlag;
    membership = route.params.isPremium;
  }

  return (
    <BottomTab.Navigator
      initialRouteName="Chat"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name="Chat"
        component={ChatNavigator}
        options={({route}) => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarIcon: ({ color }) => <TabBarIcon name="chatbox-ellipses-outline" color={color} />,
        })}
        initialParams={{Lang: language, cUserId: currentUserId, isPremium: membership}}
      />
      <BottomTab.Screen
        name="Capsulas"
        component={CapsulasNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="build-outline" color={color} />,
        }}
        initialParams={{Lang: language, cUserId: currentUserId, langFlag: flag, isPremium: membership}}
      />
      <BottomTab.Screen
        name="Estadistica"
        component={EstadisticaNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="build-outline" color={color} />,
        }}
        initialParams={{Lang: language, cUserId: currentUserId, isPremium: membership}}
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
const ChatTab = createStackNavigator<ChatParamList>();

function ChatNavigator({route}: {route: any}) {
  let language = route.params.Lang;
  let currentUserId = route.params.cUserId;
  let membership = route.params.isPremium;
  let textPremium = membership ? "Premium" : "Gratuito";
  
  return (
    <ChatTab.Navigator>
      <ChatTab.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ headerTitle: 'Chat - '+ capitalize(language) +' - '+textPremium}}
        initialParams={{Lang: language, cUserId: currentUserId, isPremium: membership}}
      />
      <ChatTab.Screen
        name="CreateTag"
        component={CreateTag}
        options={{ headerTitle: 'Crear Tag(s) - '+ capitalize(language)}}
      />
      <ChatTab.Screen
        name="FilterTag"
        component={FilterTag}
        options={{ headerTitle: 'Filtrar Tag(s)'}}
        initialParams={{Lang: language, cUserId: currentUserId}}
      />
    </ChatTab.Navigator>
  );
}

const CapsulasTab = createStackNavigator<CapsulasParamList>();



function CapsulasNavigator({route}: {route: any}) {
  let language = route.params.Lang;
  let currentUserId = route.params.cUserId;
  let membership = route.params.isPremium;
  let textPremium = membership ? "Premium" : "Gratuito";
  let flag = route.params.langFlag;

  return (
    <CapsulasTab.Navigator>
      <CapsulasTab.Screen
        name="CapsulasScreen"
        component={CapsulasScreen}
        options={{ headerTitle: 'Capsulas - '+ capitalize(language)+' - '+textPremium}}
        initialParams={{Lang: language, cUserId: currentUserId, langFlag: flag, isPremium: membership}}
      />
      <CapsulasTab.Screen
        name="VocabularyScreen"
        component={VocabularyScreen}
        options={{ headerTitle: 'Vocabulario - '+ capitalize(language)+' - '+textPremium}}
        initialParams={{Lang: language, cUserId: currentUserId, langFlag: flag, isPremium: membership}}
      />
      <CapsulasTab.Screen
        name="ChatPerScreen"
        component={ChatPerScreen}
        options={{ headerTitle: 'Chat Personalizado - '+ capitalize(language)+' - '+textPremium}}
        initialParams={{Lang: language, cUserId: currentUserId, langFlag: flag, isPremium: membership}}
      />
      <CapsulasTab.Screen
        name="ActivityScreen"
        component={ActivityScreen}
        options={{ headerTitle: 'Actividad - '+ capitalize(language)+' - '+textPremium}}
        initialParams={{Lang: language, cUserId: currentUserId, langFlag: flag, isPremium: membership}}
      />
    </CapsulasTab.Navigator>
  );
}

const EstadisticaTab = createStackNavigator<EstadisticaParamList>();

function EstadisticaNavigator({route}: {route: any}) {
  let language = route.params.Lang;
  let currentUserId = route.params.cUserId;
  let membership = route.params.isPremium;
  let textPremium = membership ? "Premium" : "Gratuito";
  
  return (
    <EstadisticaTab.Navigator>
      <EstadisticaTab.Screen
        name="EstadisticaScreen"
        component={EstadisticaScreen}
        options={{ headerTitle: 'Estadistica - '+ capitalize(language) +' - '+ textPremium}}
        initialParams={{Lang: language, isPremium: membership, cUserId: currentUserId}}
      />
    </EstadisticaTab.Navigator>
  );
}
