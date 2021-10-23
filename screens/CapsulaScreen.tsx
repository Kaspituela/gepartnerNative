import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';

import { Card, CardInformation, Container, LevelImg, LevelInfo, LevelName } from '../styles/CapsuleStyle';

export default function LanguageScreen({navigation, route}: {navigation: any, route: any}) {
    var userIsPremium = false;
    var lang = route.params.Lang == 'english' ? 0 : 1;

    // obtener nivel de idioma del usuario desde BD
    var nivelIdioma = 0;
    var langFlag = route.params.langFlag;    

    const [modalVisibility, setModalVisibility] = useState(false);

    // Conjuntos de capsulas según nivel del usuario (Basico, Intermedio, Avanzado)
    const [bCapsules, set_bCapsules] = useState<any>([]);
    const [iCapsules, set_iCapsules] = useState<any>([]);
    const [aCapsules, set_aCapsules] = useState<any>([]);

    // Capsulas marcadas como favoritas por el usuario.
    const [favCapsules, set_favCapsules] = useState<any>([]);

    /* Contenido de una capsula:
        Object{
            "desc",     -> string;  descripcion de la capsula
            "id"        -> int;     id de la capsula
            "level"     -> int;     nivel de idioma requerido para acceder a la capsula
            "name"      -> string;  nombre de la capsula
            "premium"   -> bool;    si la capsula es solo para usuarios premium     // Indicar con corona
            "resource"  -> IDK ¿?

            // posible contenido futuro

            "nota"          -> int?; nota de completitud de la capsula
            "completada"    -> bool; está completada o no               // Señalar con alguna coloracion
            "favorita"      -> bool; está marcada como favorita o no.   // Renderizar un icono de "estrella vacia" para las no favoritas, reemplazar al marcar.
        }
    */

    // El menú de capsulas mostrará renderedCapsules en el menú. De esta forma la funcion solo se necesita ajustar a esta variable, 
    // y las demás solo almacenaran los datos, cargandose cuando sea necesario.
    
    const [renderedCapsules, setRenderedCapsules] = useState<any>([]);
    
    const [membership, setMembership] = useState(false);

    // Se cargan las capsulas desde la API segun el idioma seleccionado por el usuario.
    useEffect(() => {

        // Obtener si el usuario tiene una membresia premium.
        fetch('http://gepartner-app.herokuapp.com/user?uid=' + route.params.cUserId)
        .then(response => {return response.json();})
        .then(data => {
          setMembership(data.user.membership);
        });

        // Capsulas disponibles en el idioma seleccionado
        fetch('http://gepartner-app.herokuapp.com/caps?lang=' + lang)
        .then(response => { return response.json(); })
        .then(data => {
            
            var capsulasB:any[] = [];
            var capsulasI:any[] = [];
            var capsulasA:any[] = [];

            // Datos del JSON de capsulas del idioma.
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
            }) 
            set_bCapsules(capsulasB);
            set_iCapsules(capsulasI);
            set_aCapsules(capsulasA);            
        });

        // Obtener indice de capsulas favoritas
        
        //fetch('http://gepartner-app.herokuapp.com/)
        //.then(response => {return response.json();})
        //.then(data => {
        //  set_favCapsules();
        //});
    }, [])


    const capsuleLevels = [{
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
        }];

    
    // Cambia el renderer para mostrar las capsulas seleccionadas en el visor de capsulas.
    const renderCapsules = (nivelCapsula:string) => {
        console.log(modalVisibility);
        switch (parseInt(nivelCapsula, 10)) {
            case 0:
                setRenderedCapsules(bCapsules);
                break;
            case 1:
                setRenderedCapsules(iCapsules);
                break;
            case 2:
                setRenderedCapsules(aCapsules);
                break;
        }  
        setModalVisibility(true);
    }

    const renderFavCapsules = () => {
        
    }


  /*const pressHandler = (item) => {
      console.log(item.SetLang)
      navigation.navigate('ChatScreen', {lang:item.SetLang,})
  }*/

    return (
        <Container>

            {/* Renderer del menú de capsulas*/}
            <Modal
                transparent={true}
                animationType={"slide"}
                visible={modalVisibility}
                onRequestClose={() => { setModalVisibility(!modalVisibility) }} >
                {/* Diseño del tamaño completo de la pantalla */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                    { /* Vista del cuadro interno del Modal */}
                    <View style={styles.capsuleModal}>
                        <IconButton style={{position:'absolute', right:10}} icon="close" onPress={() => { setModalVisibility(!modalVisibility); }} />
                    </View>

                    
                </View>
            </Modal>




            <View style={styles.Bienvenida}>
                <Text style={styles.p1}>DEBUG INFO</Text>
                <Text style={styles.p1}>Tipo de usuario: {membership.toString()}</Text>
                <Text style={styles.p2}>Nivel de idioma: { nivelIdioma }.</Text>
            </View>
            <FlatList style={styles.flatlist}
                contentContainerStyle={{ alignItems: 'center'}}
                data={capsuleLevels}
                keyExtractor={item=>item.id}
                renderItem={({ item }) => (
                
                <Card onPress={() => { renderCapsules(item.id) }}  style={[(nivelIdioma >= parseInt(item.id, 10)) ? styles.bgWhite : styles.bgGray]}>
                    <LevelInfo>   
                            <CardInformation>
                                <LevelImg source={langFlag} style={{opacity: 1}}/>
                                <LevelImg source={item.FlagImg} style={{ position:'absolute'}} />
                                
                                <LevelName>{item.levelName}</LevelName>
                            </CardInformation>
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
        backgroundColor: '#afafaf',
    },
    bgWhite: {
        backgroundColor: 'white',
    },
    capsuleModal: {
        //justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#f2f2f2",
        //height: "40%",
        //minHeight: 250,
        width: "90%",
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#000000',
        maxHeight: "90%",
        minHeight: 100,
    },
    flatlist: {
        paddingTop: 20,
        width: '100%',
    }
});
  
            