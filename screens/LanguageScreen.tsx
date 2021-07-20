import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { Card, Container, FlagImg, FlagImgWrapper, FlagInfo, FlagText, Language, TextSection } from '../styles/FlagStyle';

export default function LanguageScreen() {

  // El estado inicial esta en español por default, pero la idea seria poder guardar los 
  // ajustes del usuario para que se mantenga en memoria persistente
  const [selected, changeSelected] = useState(0);
  
  const [Languages, swapLanguages] = useState([
    {
      id: '0',
      Lang: 'Español',
      FlagImg: require('../assets/flags/Spain-Flag-icon.png'),
      bgColor: '00bf4980',
    },
    {
      id: '1',
      Lang: 'English',
      FlagImg: require('../assets/flags/United-Kingdom-Flag-icon.png'),
      bgColor: 'white',
    },
    {
      id: '2',
      Lang: 'Français',
      FlagImg: require('../assets/flags/France-Flag-icon.png'),
      bgColor: 'white',
    },
    {
      id: '3',
      Lang: 'Deutsche',
      FlagImg: require('../assets/flags/Germany-Flag-icon.png'),
      bgColor: 'white',
    },
    {
      id: '4',
      Lang: 'Suomi',
      FlagImg: require('../assets/flags/Finland-Flag-icon.png'),
      bgColor: 'white',
    },
    {
      id: '5',
      Lang: 'Pусский',
      FlagImg: require('../assets/flags/Russia-Flag-icon.png'),
      bgColor: 'white',
    },
    {
      id: '6',
      Lang: 'Italiano',
      FlagImg: require('../assets/flags/Italy-Flag-icon.png'),
      bgColor: 'white',
    },
  ]);

  function setLanguage(LangId: string, lang: string, flag: any) {

    var index: number = +LangId;

    var newLanguages = Languages;
    var current = newLanguages[selected];
    
    newLanguages[selected] = { id: current.id, Lang: current.Lang, FlagImg: current.FlagImg, bgColor: 'white' }
    changeSelected(index);
    
    newLanguages[index] = { id: LangId, Lang: lang, FlagImg: flag, bgColor: '#00bf4980' }
    
    swapLanguages(newLanguages);

    //var newLanguages = Languages.filter(item => item.id !== LangId);
    //newLanguages.sort((a, b) => (+a.id < +b.id ? -1 : 1));
    //newLanguages.unshift({ id: LangId, Lang: lang, FlagImg: flag });
    //swapLanguages(newLanguages);
  }


  return (
    <Container>

      <FlatList 
        data={Languages}
        keyExtractor={item=>item.id}
        renderItem={({ item }) => (
          
          <Card onPress={() => setLanguage(item.id, item.Lang, item.FlagImg)} style={{backgroundColor: item.bgColor}}>
          
          
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
