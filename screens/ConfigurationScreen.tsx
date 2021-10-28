import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Switch, Modal, SafeAreaView, TextInput} from 'react-native';
import { FlatList} from 'react-native';
import Constants from 'expo-constants';

import { Subscription } from '@unimodules/core';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useRef, useState } from 'react';

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
export default function ConfigurationScreen({navigation,route}: {navigation:any,route:any}) {
    const [text, setText] = useState('');

    function sendNotification(){
        const requestEnergy = { 
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }
        fetch('https://gepartner-app.herokuapp.com/notif?token=' + route.params.ctoken +"&time="+ text +"&uid=" + route.params.cUid  )
    }
    return(
        <View style={styles.container}>
            <Text style={styles.titleText}>Configurar Notificacion</Text>
            <Text style={styles.innerText}>Tiempo</Text>
            <View style={styles.subContainer}>
                <TextInput
                style={styles.textInput}
                placeholder="Escriba la cantidad de tiempo"
                onChangeText={text => setText(text)}
                defaultValue={text}
                />
                <Text styles={styles.innerText}>Dias</Text>
            </View>
                <TouchableOpacity style={styles.button} onPress={() =>(sendNotification())}>
                    <Text style={styles.innerButton}> Configurar </Text>
                </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    titleText: {
        color: '#22577a',
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 50,
        marginTop: 20
    },
    innerText:{
        fontSize: 15,
    },
    subContainer:{
        flexDirection:'row',
        padding: 10,
    },
    textInput:{
        marginHorizontal: 10,
    },
    innerButton:{
        fontSize: 15,
        fontWeight: "bold",
        color: '#fff',
    },
    button: {
        backgroundColor: '#22577a',
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: 5,
        marginHorizontal: 2,
        elevation: 2,
        alignItems: 'center',
    },
    subContainer:{
        alignItems: 'center',
        backgroundColor: '#c7f9cc', //verde pastel
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderColor: '#22577a',
        borderWidth: 2,
        marginHorizontal: 5,
        flexDirection: 'row',
        marginBottom: 10,
    },
});