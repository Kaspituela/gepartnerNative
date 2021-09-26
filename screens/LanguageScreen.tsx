import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Button } from 'react-native';

import { Card, Container, FlagImg, FlagImgWrapper, FlagInfo, FlagText, Language, TextSection } from '../styles/FlagStyle';

export default function LanguageScreen({navigation}: {navigation: any}) {

  // El estado inicial esta en español por default, pero la idea seria poder guardar los 
  // ajustes del usuario para que se mantenga en memoria persistente
  const [selected, changeSelected] = useState(0);
  
  const [Languages, swapLanguages] = useState([
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
    {
      id: '2',
      Lang: 'Français',
      FlagImg: require('../assets/flags/France-Flag-icon.png'),
      bgColor: 'white',
      SetLang: 'french',
    },
    {
      id: '3',
      Lang: 'Deutsche',
      FlagImg: require('../assets/flags/Germany-Flag-icon.png'),
      bgColor: 'white',
      SetLang: 'german',
    },
    {
      id: '4',
      Lang: 'Suomi',
      FlagImg: require('../assets/flags/Finland-Flag-icon.png'),
      bgColor: 'white',
      SetLang: 'finnish',
    },
    {
      id: '5',
      Lang: 'Pусский',
      FlagImg: require('../assets/flags/Russia-Flag-icon.png'),
      bgColor: 'white',
      SetLang: 'russian',
    },
    {
      id: '6',
      Lang: 'Italiano',
      FlagImg: require('../assets/flags/Italy-Flag-icon.png'),
      bgColor: 'white',
      SetLang: 'italian',
    },
  ]);

  function setLanguage(LangId: string, lang: string, flag: any, setLang: string) {

    var index: number = +LangId;

    var newLanguages = Languages;
    var current = newLanguages[selected];
    
    newLanguages[selected] = { id: current.id, Lang: current.Lang, FlagImg: current.FlagImg, bgColor: 'white' , SetLang: current.SetLang}
    changeSelected(index);
    
    newLanguages[index] = { id: LangId, Lang: lang, FlagImg: flag, bgColor: '#00bf4980', SetLang: setLang }
    
    swapLanguages(newLanguages);

    //var newLanguages = Languages.filter(item => item.id !== LangId);
    //newLanguages.sort((a, b) => (+a.id < +b.id ? -1 : 1));
    //newLanguages.unshift({ id: LangId, Lang: lang, FlagImg: flag });
    //swapLanguages(newLanguages);
    global.language = setLang;
    console.log(setLang)
  }


  return (
    <Container>

      <FlatList 
        data={Languages}
        keyExtractor={item=>item.id}
        renderItem={({ item }) => (
          
          <Card onPress={() => setLanguage(item.id, item.Lang, item.FlagImg, item.SetLang)} style={{backgroundColor: item.bgColor}}>
          
          
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
      <Button
        onPress={() => navigation.navigate('Root')}
        title="Continuar"
      />

    </Container>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },

  selectedItem: {
    marginVertical: 80,
  },
});
