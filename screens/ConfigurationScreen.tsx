import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import {useState} from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Switch, Modal, SafeAreaView, Pressable} from 'react-native';
import { FlatList} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome'

import { ConfigurationParamList } from '../types';

const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'Notificaciones',
      text: 'Al ser activado, comenzarás a recibir notificaciones periodicamente, las cuales sirven de recordatorio para continuar con tu progreso.'
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
    },
  ];
  
export default function ConfigurationScreen({navigation,}: StackScreenProps<ConfigurationParamList, 'ConfigurationScreen'>) {


    return (
        <View style={styles.Container}>
            <View>
                <Pressable style={styles.PressAdd} onPress={() => {setNotification(true)}}>
                    <Text style={{color:'#c7f9cc', fontSize: 20}}>Notificaciones</Text>
                </Pressable>
                <Pressable style={styles.PressEdit} onPress={() => {setNotifFrecuency(true)}}>
                    <Text style={{color:'#c7f9cc', fontSize: 20}}>Frecuencia de notificaciones</Text>
                </Pressable>
                <Pressable style={styles.PressDes} onPress={() => {setNotifEnergia(true)}}>
                    <Text style={{color:'#c7f9cc', fontSize: 20}}>Notificación por recarga</Text>
                </Pressable>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    Title: {
        color: '#22577a',
        textAlign: 'center',
        fontSize: 50,
        marginBottom: 50,
        marginTop: 20
    },
    PressAdd: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#22577a', 
        paddingVertical: 30, 
        marginTop: 150
    },
    PressEdit: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#22577a', 
        paddingVertical: 30,
        marginVertical: 30
    },
    PressDes: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#22577a', 
        paddingVertical: 30
    },
    Card: {
        flexDirection: 'row',
        margin: 5,
        width: '100%'
    },
    Exit2: {
        alignSelf: 'flex-start'
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    linkText: {
        fontSize: 14,
        color: '#2e78b7',
    },
    item: {
        backgroundColor: '#fff',
        paddingHorizontal: 130,
        paddingVertical: 10,
        marginVertical: 8,
        marginHorizontal: 1,
    },
});