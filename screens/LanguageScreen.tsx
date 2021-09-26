import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Card, Container, FlagImg, FlagImgWrapper, FlagInfo, FlagText, Language, TextSection } from '../styles/FlagStyle';

export default function LanguageScreen({navigation}: {navigation: any}) {
  
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

  return (
    <Container>
        <View style={styles.Bienvenida}>
            <Text style={styles.p1}>Bienvenido a GEPartner!</Text>
            <Text style={styles.p2}>Para comenzar, elige un idioma que quieras poner en práctica.</Text>
        </View>
      <FlatList 
        data={Languages}
        keyExtractor={item=>item.id}
        renderItem={({ item }) => (
          
          <Card onPress={() => navigation.navigate('Root', {lang: item.SetLang, })}>
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
    }
  });