import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Card, Container, FlagImg, FlagImgWrapper, FlagInfo, FlagText, Language } from '../styles/FlagStyle';

export default function LanguageScreen({navigation, route}: {navigation: any, route: any}) {
  let uid = route.params.userId
  console.log(uid)
  const [nameUser, setNameUser] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [membership, setMembership] = useState(false)
  const [premium, setPremium] = useState('')
  
  const requestInfoUser = { 
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }
  fetch('http://gepartner-app.herokuapp.com/user?uid=' + uid , requestInfoUser)
  .then(response => {return response.json();})
  .then(data => {
    setNameUser(data.user.name)
    setMembership(data.user.membership)
    if (!data.user.membership) {
      setPremium('Contratar Premium')
    } else {
      setPremium('Renunciar a Premium')
    }
    console.log(nameUser)
  });

  const [Languages, setLanguages] = useState([
    {
      id: '0',
      Lang: 'Español',
      FlagImg: require('../assets/flags/Spain-Flag-icon.png'),
      bgColor: '00bf4980',
      SetLang: 'spanish',
    },
    {
      id: '1',
      Lang: 'English',
      FlagImg: require('../assets/flags/United-Kingdom-Flag-icon.png'),
      bgColor: 'white',
      SetLang: 'english',
    },
  ]);

  /*const pressHandler = (item) => {
      console.log(item.SetLang)
      navigation.navigate('ChatScreen', {lang:item.SetLang,})
  }*/

  /*const fijarUid = (num: number) => {
    uid = num;

    fetch('http://gepartner-app.herokuapp.com/user?uid=' + num)
    .then(response => {return response.json();})
      .then(data => {
        membership = data.user.membership;
        let text = membership ? "Premium" : "Gratuito";
        alert("Usuario " + text);
    });
  
  }*/

  const handlerPressMembership = () => {
    if (!membership) {
      const requestMembership = { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: uid,
          data: 'membership',
          value: true
        })
      }

      try { // Llamada a la api para user -> http://gepartner-app.herokuapp.com/user/
          return fetch('http://gepartner-app.herokuapp.com/user/', requestMembership)
          .then(response => {return response.json();})
          .then(data => {
              console.log(data.membership)
              if (data.membership == true) {
                alert('Te has vuelto Premium satisfactoriamente!')
                setMembership(true)
                setPremium('Renunciar a Premium')
              }
              else {
                  alert('Ha ocurrido un error')
              }
          });
      }
      catch (error){
        console.error(error);
      }
    }
    else {
      const requestMembership = { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: uid,
          data: 'membership',
          value: false
        })
      }
      try { // Llamada a la api para user -> http://gepartner-app.herokuapp.com/user/
        return fetch('http://gepartner-app.herokuapp.com/user/', requestMembership)
        .then(response => {return response.json();})
        .then(data => {
            console.log(data.membership)
            if (data.membership == false) {
              alert('Has renunciado al plan Premium')
              setPremium('Contratar Premium')
              setMembership(false)
            }
            else {
                alert('Ha ocurrido un error')
            }
        });
    }
    catch (error){
      console.error(error);
    }
    }
  }

  const handlerPressConfig = () => {
    setModalVisible(!modalVisible);
    return navigation.navigate('Configuration')
  }

  const handlerPress = () => {
    AsyncStorage.removeItem('userID').then((res) => console.log(res))
    /*AsyncStorage.getItem('userID').then((value) => {console.log(value)})*/
    return navigation.navigate('Login')
  }

  return (
    <Container style={styles.Container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.ViewModal}>
          <View style={styles.Exit}>
            <Icon style={{marginTop:80, marginRight:10}} onPress={() => { setModalVisible(!modalVisible) }} name="bars" size={30} />
          </View>
          <Pressable style={styles.Membership} onPress={() => handlerPressMembership()} >
            <Text style={{color: '#c7f9cc'}}>{premium}</Text>
          </Pressable>
          <Pressable style={styles.Notifications} onPress={() => handlerPressConfig()} >
            <Text style={{color: '#c7f9cc'}}>Configuración</Text>
          </Pressable>
          <Pressable style={styles.CloseSession} onPress={() => handlerPress()} >
            <Text style={{color: '#c7f9cc'}}>Cerrar Sesión</Text>
          </Pressable>
        </View>
      </Modal>


      <View style={{alignItems: 'flex-end'}}>
          <Icon style={{marginRight: 10, marginBottom: 10}} onPress={() => { setModalVisible(true) }} name="bars" size={30} />
      </View>


      <View style={styles.Welcome}>
        <Text style={styles.p1}>Bienvenido a GEPartner, {nameUser}!</Text>
        <Text style={styles.p2}>Para comenzar, elige un idioma que quieras poner en práctica.</Text>
      </View>
        {/*<View style = {styles.premium}>
          <Button title={"Gratuito"}  onPress={() => fijarUid(1)}/>
          <Button title={"Premium"}  onPress={() => fijarUid(1)}/>
        </View>*/}
      <FlatList 
        data={Languages}
        keyExtractor={item=>item.id}
        renderItem={({ item }) => (
          
          <Card style={styles.Card} onPress={() => navigation.navigate('Root', {lang: item.SetLang, cUserId: uid, langFlag: item.FlagImg, isPremium: membership })}>
              <FlagInfo>

                <FlagImgWrapper style={styles.FlagImg} >
                  <FlagImg source={item.FlagImg} />
                </FlagImgWrapper>

                <FlagText style={styles.FlagText} >
                  <Language style={{fontFamily: 'monospace', fontSize: 17, color: '#22577a'}}>{item.Lang}</Language>
                </FlagText>

              </FlagInfo>
          </Card>
        )}
      />
    </Container>
  )
}

const styles = StyleSheet.create({
    Container: {
      flex: 1,
      backgroundColor: '#fff'
    },
    Welcome: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 50,
      marginHorizontal: 5,
      backgroundColor: '#c7f9cc',
      borderRadius: 20,
      borderColor: '#22577a',
      borderWidth: 2
    },
    p1: {
      textAlign: 'center',
      fontFamily: 'monospace',
      fontSize: 25,
      marginHorizontal: 20,
      marginVertical:10
    },
    p2: {
      textAlign: 'center',
      fontFamily: 'monospace',
      fontSize: 17,
      marginHorizontal: 20,
      marginVertical: 7
    },
    Card: {
      margin: 5,
      borderWidth: 0.5,
      borderColor: '#22577a'
    },
    FlagText: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    FlagImg: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    premium: {
      margin: 20,
      flexDirection: 'row',
      justifyContent: 'flex-end'
    },
    ViewModal: {
      flex: 0.2,
      alignItems: 'flex-end',
      justifyContent: 'center',
      marginHorizontal: 0
      /*backgroundColor: 'rgba(34, 87, 122, 0.95)'*/
    },
    Membership:{
      backgroundColor: '#000',
      alignItems: 'center',
      justifyContent: 'center',
      width: 200,
      height: 40,
      marginRight: 10,
      borderTopLeftRadius: 10, 
    },
    Notifications:{
      backgroundColor: '#000',
      alignItems: 'center',
      justifyContent: 'center',
      width: 200,
      height: 40,
      marginRight: 10,
    },
    CloseSession: {
      backgroundColor: '#000',
      alignItems: 'center',
      justifyContent: 'center',
      width: 200,
      height: 40,
      marginRight: 10,
      borderBottomLeftRadius: 10
    },
    ExitRegPress: {
      backgroundColor: '#38a3a5',
      width: 50,
      height: 25,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#22577a',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 0
    },
    Exit: {
        alignSelf: 'flex-end'
    }
  });