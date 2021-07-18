import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { Container, FlagImg, FlagImgWrapper, FlagInfo, FlagText } from '../styles/FlagStyle';
import { Card, TextSection, UserName } from '../styles/MessageStyle';

const Languages = [
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
  ];

var id = 0;
var lang = "";

function setLanguage(LangId: string) {
  id = +LangId;
  lang = Languages[+id].Lang
  alert("id: " + id + ", lang: " + lang);
}

/*
function getLanguage() {
  alert("id: " + id + ", lang: " + lang);
}
*/

export default function LanguageScreen() {
  return (
    <Container>
      <FlatList 
        data={Languages}
        keyExtractor={item=>item.id}
        renderItem={({item}) => (
          <Card onPress={() => setLanguage(item.id)}>
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
