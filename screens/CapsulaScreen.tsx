import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import {
    Card,
    Container,
    LevelImg,
    LevelInfo,
    LevelName,
    LevelText,
    LevelWrapper,
    TextSection,
} from '../styles/CapsuleStyle';

export default function LanguageScreen({navigation, route}: {navigation: any, route: any}) {
    var userIsPremium = false;
    var lang = route.params.Lang == 'english' ? 0 : 1;

    // obtener nivel de idioma del usuario desde BD
    var nivelIdioma = 0;
    var langFlag = route.params.langFlag;    

    const [bCapsules, set_bCapsules] = useState<any>([]);
    const [iCapsules, set_iCapsules] = useState<any>([]);
    const [aCapsules, set_aCapsules] = useState<any>([]);
    
    const [membership, setMembership] = useState(false);

    // Se cargan las capsulas desde la API segun el idioma seleccionado por el usuario.
    useEffect(() => {

        fetch('http://gepartner-app.herokuapp.com/user?uid=' + route.params.cUserId)
        .then(response => {return response.json();})
        .then(data => {
          setMembership(data.user.membership);
        });

        fetch('http://gepartner-app.herokuapp.com/caps?lang=' + lang)
        .then(response => { return response.json(); })
        .then(data => {
            
            var capsulasB:any[] = [];
            var capsulasI:any[] = [];
            var capsulasA:any[] = [];

            data.capsules.forEach((item: any) => {

                switch (item.level) {
                    case 0:
                        capsulasB.push(item);
                        break;
                    case 1:
                        capsulasI.push(item);
                        break;
                    case 2:
                        capsulasA.push(item);
                        break;
                }            
            }) // Datos del JSON de capsulas del idioma.

            set_bCapsules(capsulasB);
            set_iCapsules(capsulasI);
            set_aCapsules(capsulasA);
            
            //console.log(data.capsules);
            //setCapsulas(data.capsules);
            //console.log(Capsulas);
            
        });
    }, [])


    const [Languages, setLanguages] = useState([
        {
            id: '0',
            levelName: 'Basico',
            FlagImg: require('../assets/capsuleAssets/basico.png'),
            bgColor: 'white',
        },{
            id: '1',
            levelName: 'Intermedio',
            FlagImg: require('../assets/capsuleAssets/intermedio.png'),
            bgColor: 'white',
        },{
            id: '2',
            levelName: 'Avanzado',
            FlagImg: require('../assets/capsuleAssets/avanzado.png'),
            bgColor: 'white',
        }
    ]);

    const renderCapsules = (nivelCapsula:string) => {
        console.log(nivelCapsula);
        switch (parseInt(nivelCapsula, 10)) {
            case 0:
                console.log(bCapsules);
                break;
            case 1:
                console.log(iCapsules);
                break;
            case 2:
                console.log(aCapsules);
                break;
        }  
    }


  /*const pressHandler = (item) => {
      console.log(item.SetLang)
      navigation.navigate('ChatScreen', {lang:item.SetLang,})
  }*/

    return (
        <Container>
            <View style={styles.Bienvenida}>
                <Text style={styles.p1}>DEBUG INFO</Text>
                <Text style={styles.p1}>Tipo de usuario: {membership.toString()}</Text>
                <Text style={styles.p2}>Nivel de idioma: { nivelIdioma }.</Text>
            </View>
            <FlatList style={{height: "100%"}}
            data={Languages}
            keyExtractor={item=>item.id}
                renderItem={({ item }) => (
            
            <Card onPress={() => { renderCapsules(item.id) }}  style={[(nivelIdioma >= parseInt(item.id, 10)) ? styles.bgWhite : styles.bgGray]}>
                <LevelInfo>
                    <LevelWrapper>    
                        
                        <LevelImg source={langFlag} style={{opacity: 0.7}}/>
                        <LevelImg source={item.FlagImg} style={{ top: -80 }} />
                        
                        <TextSection>
                            <LevelText>
                                <LevelName>{item.levelName}</LevelName>
                            </LevelText>
                        </TextSection>

                    </LevelWrapper>
                </LevelInfo>
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
    bgGray: {
      backgroundColor: 'gray',
    },
    bgWhite: {
        backgroundColor: 'white',
    },
  });