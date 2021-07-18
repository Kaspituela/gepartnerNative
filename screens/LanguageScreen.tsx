import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { Container, FlagImg, FlagImgWrapper, FlagInfo, FlagText } from '../styles/FlagStyle';
import { Card, TextSection, UserName } from '../styles/MessageStyle';


export default function LanguageScreen() {

  const [Languages, swapLanguages] = useState([
    {
      id: '0',
      Lang: 'Español',
      FlagImg: require('../assets/flags/Spain-Flag-icon.png'),
    },
    {
      id: '1',
      Lang: 'English',
      FlagImg: require('../assets/flags/United-Kingdom-Flag-icon.png'),
    },
    {
      id: '2',
      Lang: 'Français',
      FlagImg: require('../assets/flags/France-Flag-icon.png'),
    },
    {
      id: '3',
      Lang: 'Deutsche',
      FlagImg: require('../assets/flags/Germany-Flag-icon.png'),
    },
    {
      id: '4',
      Lang: 'Suomi',
      FlagImg: require('../assets/flags/Finland-Flag-icon.png'),
    },
    {
      id: '5',
      Lang: 'Pусский',
      FlagImg: require('../assets/flags/Russia-Flag-icon.png'),
    },
    {
      id: '6',
      Lang: 'Italiano',
      FlagImg: require('../assets/flags/Italy-Flag-icon.png'),
    },
  ]);

  function setLanguage(LangId: string, lang: string, flag: any) {

    var newLanguages = Languages.filter(item => item.id !== LangId);
    newLanguages.unshift({ id: LangId, Lang: lang, FlagImg: flag });
    swapLanguages(newLanguages);
  }


  return (
    <Container>
      <FlatList 
        data={Languages}
        keyExtractor={item=>item.id}
        renderItem={({item}) => (
          <Card onPress={() => setLanguage(item.id, item.Lang, item.FlagImg)}>
            <FlagInfo>
              <FlagImgWrapper>
                <FlagImg source={item.FlagImg} />
              </FlagImgWrapper>
              <TextSection>
                <FlagText>
                  <UserName>{item.Lang}</UserName>
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
});
