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
import CapsulasScreen from '../screens/CapsulaScreen';
import EstadisticaScreen from '../screens/EstadisticaScreen';
import { BottomTabParamList, ChatParamList, CapsulasParamList, EstadisticaParamList} from '../types';
import { Language } from '../styles/FlagStyle';
import CreateTag from '../components/CreateTag';


const BottomTab = createBottomTabNavigator<BottomTabParamList>();

const getTabBarVisibility = (route:any) => {
  const routeName = getFocusedRouteNameFromRoute(route);
    const hideOnScreens = ['Chat'];
    if(hideOnScreens.indexOf(routeName as string) > -1) return false;
    return true;
};


export default function BottomTabNavigator({route}: {route: any}) {
  const colorScheme = useColorScheme();
  let language:string = 'null';
  if(route.params === undefined){
    language = 'spanish';
  } else{
    language = route.params.lang;
  }
  let currentUserId:any = 0;
  if(route.params === undefined){
    currentUserId = 0;
  } else{
    currentUserId = route.params.cUserId;
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
        initialParams={{Lang: language, cUserId: currentUserId}}
      />
      <BottomTab.Screen
        name="Capsulas"
        component={CapsulasNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="build-outline" color={color} />,
        }}
        initialParams={{Lang: language, cUserId: currentUserId}}
      />
      <BottomTab.Screen
        name="Estadistica"
        component={EstadisticaNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="build-outline" color={color} />,
        }}
        initialParams={{Lang: language, cUserId: currentUserId}}
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
  let textPremium = currentUserId === 0 ? "Gratuito" : "Premium"
  return (
    <ChatTab.Navigator>
      <ChatTab.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ headerTitle: 'Chat - '+language+' - '+textPremium}}
        initialParams={{Lang: language, cUserId: currentUserId}}
      />
      <ChatTab.Screen
        name="CreateTag"
        component={CreateTag}
        options={{ headerTitle: 'Crear Tag(s) - '+language}}
      />
    </ChatTab.Navigator>
  );
}

const CapsulasTab = createStackNavigator<CapsulasParamList>();

function CapsulasNavigator({route}: {route: any}) {
  let language = route.params.Lang;
  let currentUserId = route.params.cUserId;
  let textPremium = currentUserId === 0 ? "Gratuito" : "Premium"
  return (
    <CapsulasTab.Navigator>
      <CapsulasTab.Screen
        name="CapsulasScreen"
        component={CapsulasScreen}
        options={{ headerTitle: 'Capsulas - '+language+' - '+textPremium}}
        initialParams={{Lang: language}}
      />
    </CapsulasTab.Navigator>
  );
}

const EstadisticaTab = createStackNavigator<EstadisticaParamList>();

function EstadisticaNavigator({route}: {route: any}) {
  let language = route.params.Lang;
  let currentUserId = route.params.cUserId;
  return (
    <EstadisticaTab.Navigator>
      <EstadisticaTab.Screen
        name="EstadisticaScreen"
        component={EstadisticaScreen}
        options={{ headerTitle: 'Estadistica - '+language+' - '+textPremium}}
        initialParams={{Lang: language}}
      />
    </EstadisticaTab.Navigator>
  );
}
