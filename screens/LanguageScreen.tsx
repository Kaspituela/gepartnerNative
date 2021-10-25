import React, { useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';

import { Card, Container, FlagImg, FlagImgWrapper, FlagInfo, FlagText, Language, TextSection } from '../styles/FlagStyle';

export default function LanguageScreen({navigation}: {navigation: any}) {
  
  let uid = 1;
  let membership = false;

  const Languages = [
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
  ];//);

  /*const pressHandler = (item) => {
      console.log(item.SetLang)
      navigation.navigate('ChatScreen', {lang:item.SetLang,})
  }*/

  const fijarUid = (num: number) => {
    uid = num;

    fetch('http://gepartner-app.herokuapp.com/user?uid=' + num)
    .then(response => {return response.json();})
      .then(data => {
        membership = data.user.membership;
        let text = membership ? "Premium" : "Gratuito";
        alert("Usuario " + text);
    });
  
  }

  return (
    <Container>
        <View style={styles.Bienvenida}>
            <Text style={styles.p1}>Bienvenido a GEPartner!</Text>
            <Text style={styles.p2}>Para comenzar, elige un idioma que quieras poner en práctica.</Text>
        </View>
        <View style = {styles.premium}>
          <Button title={"Gratuito"}  onPress={() => fijarUid(1)}/>
          <Button title={"Premium"}  onPress={() => fijarUid(2)}/>
        </View>
      <FlatList 
        data={Languages}
        keyExtractor={item=>item.id}
        renderItem={({ item }) => (
          
          <Card onPress={() => navigation.navigate('Root', {lang: item.SetLang, cUserId: uid, langFlag: item.FlagImg, isPremium: membership})}>
              <FlagInfo>

                <FlagImgWrapper >
                  <FlagImg source={item.FlagImg} />
                </FlagImgWrapper>
          
                <TextSection>
                  <FlagText>
                    <Language>{item.Lang}</Language>
                  </FlagText>
                </TextSection>

              </FlagInfo>
          </Card>
        )}
      />
    </Container>
  )
}

const styles = StyleSheet.create({
    Bienvenida: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    p1: {
      fontFamily: 'serif',
      fontSize: 25,
    },
    p2: {
      fontFamily: 'serif',
      fontSize: 15,
    },
    premium: {
      margin: 20,
      flexDirection: 'row',
      justifyContent: 'flex-end'
    }
  });