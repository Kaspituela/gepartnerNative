import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';

import {
    CapCard,
    CapContainer,
    CapImg,
    CapImgWrapper,
    CapName,
    CapText,
    Card,
    CardInformation,
    Container,
    LevelImg,
    LevelInfo,
    LevelName,
} from '../styles/CapsuleStyle';


export default function LanguageScreen({navigation, route}: {navigation: any, route: any}) {

    // obtener nivel de idioma del usuario desde BD
    var nivelIdioma = 2;
    var langFlag = route.params.langFlag;
    var lang = route.params.Lang == 'english' ? 0 : 1;
    const [membership, setMembership] = useState(false);

    // Informacion de display y Modals
    const [capsuleModal, setCapsuleModal] = useState(false);
    const [alertModal, setAlertModal] = useState(false);
    const displayLevel = ["de nivel Basico", "de nivel Intermedio", "de nivel Avanzado", "Favoritas"];
    const [showLevel, setShowLevel] = useState(0);

    // Se usa para indexar el nivel al que no se puede acceder dentro de la lista de displayLevel, usado en el modal alertModal
    const [errorNumber, setErrorNumber] = useState(0); 

    // Datos completos de cada una de las capsulas
    const [allCapsules, setAllCapsules] = useState<any>({});

    // Conjuntos de capsulas según nivel del usuario (Basico, Intermedio, Avanzado), o las favoritas
    const [bCapsules, set_bCapsules] = useState<any>([]);
    const [iCapsules, set_iCapsules] = useState<any>([]);
    const [aCapsules, set_aCapsules] = useState<any>([]);
    const [favCapsules, set_favCapsules] = useState<any>([]);


    const [completed, setCompleted] = useState<any>([]);
    const [progress, setProgress] = useState<any>([]);


    // El menú de capsulas mostrará renderedCapsules en el menú. De esta forma la funcion solo se necesita ajustar a esta variable, 
    // y las demás solo almacenaran los datos, cargandose cuando sea necesario.
    const [renderedCapsules, setRenderedCapsules] = useState<any>([]);

    /* Contenido de una capsula:
        Object{
            "baseAct"  , -> idk
            "desc",     -> string;  descripcion de la capsula
            "id"        -> int;     id de la capsula
            "lang",     -> int;     idioma de la capsula
            "level"     -> int;     nivel de idioma requerido para acceder a la capsula
            "name"      -> string;  nombre de la capsula
            "premium"   -> bool;    si la capsula es solo para usuarios premium     // Indicar con corona
            "prompt"    -> idk
            "vocab"     -> idk


            "progress"  -> int;     Progreso de la capsula
            "completed" -> bool;    está completada o no               
            "favorite"  -> bool;    está marcada como favorita o no.   
        }
    */


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
            
            // Indices de las capsulas que pertenecen a cada categoria
            var capsulasB:any[] = [];
            var capsulasI:any[] = [];
            var capsulasA:any[] = [];
            
            // Listado de todas las capsulas, con sus datos completos
            var capsuleDict: any = {};

            
            // Datos del JSON de capsulas del idioma.
            data.capsules.forEach((item: any) => {
                
                // Se asignan los valores por defecto para cada capsula
                item.favorite = false;
                item.completed = false;
                item.progress = 0;

                // Se agregan los datos de la capsula a un diccionario con su id como indice.
                capsuleDict[item.id] = item;

                switch (item.level) {
                    case 0:
                        capsulasB.push(item.id);
                        break;
                    case 1:
                        capsulasI.push(item.id);
                        break;
                    case 2:
                        capsulasA.push(item.id);
                        break;
                }
            });

            // Se guardan los indices de las capsulas de cada nivel.
            set_bCapsules(capsulasB);
            set_iCapsules(capsulasI);
            set_aCapsules(capsulasA);    
            setAllCapsules(capsuleDict);
            
            // Obtener indice de capsulas favoritas del usuario
            fetch('http://gepartner-app.herokuapp.com/user?uid='+ route.params.cUserId + '&data=favorites')
            .then(response => {return response.json();})
            .then(favInfo => {
                
                var fav: any[] = [];

                // Se asignan como favoritas aquellas capsulas marcadas por el usuario
                favInfo.user.favorites.forEach((item: any) => {
                    capsuleDict[item].favorite = true;
                    fav.push(item); // Guarda el indice de las capsulas marcadas (utilizado para editar el el valor en BD)
                });
                // Guarda los indices de las favoritas.
                set_favCapsules(fav);
                setAllCapsules(capsuleDict);

                // Obtener el listado de capsulas completadas
                fetch('http://gepartner-app.herokuapp.com/user?uid='+ route.params.cUserId + '&data=completed')
                .then(response => {return response.json();})
                .then(completionInfo => {
                    //console.log(completionInfo.user.completed); // Es un array similar a las favoritas

                    var complete: any[] = [];

                    completionInfo.user.completed.forEach((item: any) => {
                        capsuleDict[item].completed = true;
                        complete.push(item); // Guarda el indice de las capsulas terminadas
                    });
                    // Guarda los indices de las completadas.
                    setCompleted(complete);
                    setAllCapsules(capsuleDict);

                    // Listado de progreso de las distintas capsulas
                    fetch('http://gepartner-app.herokuapp.com/user?uid='+ route.params.cUserId + '&data=progress')
                    .then(response => {return response.json();})
                    .then(progressInfo => {
                        //console.log(progressInfo.user);
                        //let prog = progressInfo.user.progress;
                        //console.log(prog); // Es un diccionario

                        //setProgress(prog); // Se guarda de la misma forma en que viene.

                        //console.log(prog.length);
                        //for (var key in prog) {
                        //    capsuleDict[key].progress = prog[key];                            
                        //}

                        setAllCapsules(capsuleDict);
                        console.log("AAAAAAAAAAAAA");
                        console.log(allCapsules);
                    });
                });
            });
        });
    }, [])


    const capsuleLevels = [{
            id: '0',
            levelName: 'Basico',
            levelStars: require('../assets/capsuleAssets/basico.png'),
            bgColor: 'white',
        },{
            id: '1',
            levelName: 'Intermedio',
            levelStars: require('../assets/capsuleAssets/intermedio.png'),
            bgColor: 'white',
        },{
            id: '2',
            levelName: 'Avanzado',
            levelStars: require('../assets/capsuleAssets/avanzado.png'),
            bgColor: 'white',
        }];
    const LockIcon = require('../assets/capsuleAssets/lock.png')
    const CrownIcon = require('../assets/capsuleAssets/crown.png')
    

    // Cambia el renderer para mostrar las capsulas seleccionadas en el visor de capsulas.
    const renderCapsules = (nivelCapsula: string) => {
        
        var lvlCapsula = parseInt(nivelCapsula, 10);
        
        //var RendererDebug:any[] = [];
        //RendererDebug = RendererDebug.concat(bCapsules);
        //RendererDebug = RendererDebug.concat(iCapsules);
        //RendererDebug = RendererDebug.concat(aCapsules);
    
        // El menu de capsulas solo se carga cuando el usuario tiene el nivel de idioma requerido para acceder
        if (nivelIdioma >= lvlCapsula) {
            setShowLevel(lvlCapsula);

            // Copia de los indices de las capsulas que se deben mostrar.
            let renderIndex = [];

            switch (lvlCapsula) {
                case 0:
                    //setRenderedCapsules(RendererDebug);
                    renderIndex = bCapsules;
                    //setRenderedCapsules(bCapsules);
                    break;
                case 1:
                    renderIndex = iCapsules;
                    //setRenderedCapsules(iCapsules);
                    break;
                case 2:
                    renderIndex = aCapsules;
                    //setRenderedCapsules(aCapsules);
                    break;
            }

            // Se cargan las capsulas que se van a renderizar utilizando sus indices dentro del diccionario de todas las capsulas
            var renderer:any[] = [];
            renderIndex.forEach((index:any) => {
                renderer.push(allCapsules[index]);
            });
            setRenderedCapsules(renderer);

            setAlertModal(false);
            setCapsuleModal(true);
        } else { // Se mostrará una alerta cuando el usuario no pueda acceder a ellas.
            if (!capsuleModal && !alertModal) { // Condiciones para evitar que la alerta aperzca si se apretan botones rapido
                setErrorNumber(lvlCapsula-1);
                setAlertModal(true);   
            }
        }
    }

    // Funcion para obtener el indice para agregar un item a un arreglo ordenado
    const orderIndex = (array: any[], value: any) => {
        var low = 0,
		high = array.length;
        while (low < high) {
            var mid = low + high >>> 1;
            if (array[mid] < value) low = mid + 1;
            else high = mid;
        }
        return low;
    }

    // Se altera el valor de favoritos de una capsula
    const toggleFavorite = (item: any) => {
        if (item.favorite) {
            var capsuleDict = allCapsules;
            capsuleDict[item.id].favorite = false;
            setAllCapsules(capsuleDict);
            var newFavList = favCapsules;
            var index = newFavList.indexOf(item.id);
            newFavList.splice(index, 1); // Se obtiene la lista luego de eliminar el valor
            set_favCapsules(newFavList);
        } else {
            var capsuleDict = allCapsules; // Copia de todas las capsulas
            capsuleDict[item.id].favorite = true; // Se marca como favorita en el diccionario general
            setAllCapsules(capsuleDict); // Se actualiza el valor del estado.

            var favIndex = favCapsules;
            favIndex.splice(orderIndex(favIndex, item.id), 0, item.id); // Se agrega el nuevo indice de forma ordenada
            set_favCapsules(favIndex); // Se guarda el nuevo listado de indices
            // Falta agregar la capsula a la lista para mostrar
        }

        var PUTjson = {
            uid: route.params.cUserId,
            data: 'favorite',
            value: favCapsules, 
        }
        var favJSON = JSON.stringify(PUTjson);
        console.log(favJSON);
    }

    // Enviar la PUT request a la base de datos para actualizar los valores de la tabla
    const updateFavBD = () => {
        
    }

    const renderFavCapsules = () => {
        setShowLevel(3);
        setRenderedCapsules(favCapsules);
        setCapsuleModal(true);
    }

    // Se abre la capsula seleccionada en el menu de capsulas
    const openCapsule = (item: any) => {
        toggleFavorite(item);
        navigation.navigate('VocabularyScreen',{ idCapsula: item.id})
        console.log(item);
    }

    return (
        <Container style={[alertModal ? { opacity: 0.3, backgroundColor: "#f4f4f4"} : {opacity:1}]}>

            
            <Modal // Render del menu de capsulas. Muestra las capsulas disponibles para el nivel seleccionado por el usuario
                transparent={true}
                animationType={"slide"}
                visible={capsuleModal}
                onRequestClose={() => { setCapsuleModal(!capsuleModal) }} >
                
                {/* Diseño del tamaño completo de la pantalla */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                    { /* Vista del cuadro interno del Modal */}
                    <View style={styles.capsuleModal}>
                        <IconButton style={{position:'absolute', right:10}} icon="close" onPress={() => { setCapsuleModal(!capsuleModal); }} />

                        {/* Vista interna, va desde abajo del boton de cierre hasta casi el piso*/}
                        <View style={styles.ModalInternalView}>
                            
                            <Text style={styles.p1}> Capsulas {displayLevel[showLevel]}</Text>

                            {/* Listado de Visualizacion de las capsulas dentro del Modal*/}
                            <FlatList style={styles.flatlist}
                                contentContainerStyle={{ alignItems: 'center'}}
                                data={renderedCapsules}
                                keyExtractor={item=>item.id.toString()}
                                renderItem={({ item }) => (
                                <CapCard onPress={() => { openCapsule(item) }}>
                                    <CapContainer style={{height: 100} }>
                                        <CapImgWrapper>
                                                <View style={[(!membership && item.premium) ? { opacity: 0.6, position:'relative', zIndex: 1 } : {opacity:1}]}>
                                                    <CapImg source={langFlag} />
                                                    <CapImg source={CrownIcon} style={[item.premium ? styles.capsuleCrown : styles.Unlocked]} />
                                                </View>
                                                <CapImg source={LockIcon} style={[(!membership && item.premium) ? styles.LockedCapsule : styles.Unlocked]}/>
                                        </CapImgWrapper>
                                        <CapText>
                                            <CapName>{item.id + ")     " + item.name}</CapName>
                                        </CapText>
                                    </CapContainer>
                                </CapCard>
                                )}
                            />
                        </View>
                    </View>       
                </View>
            </Modal>




            
            <Modal // Alerta para cuando no se puede acceder a ciertas capsulas por falta de nivel del usuario.
                transparent={true}
                animationType={"fade"}
                visible={alertModal}
                onRequestClose={() => { setAlertModal(!alertModal) }} >
                
                {/* Diseño del tamaño completo de la pantalla */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                    { /* Vista del cuadro interno del Modal */}
                    <View style={styles.alertWindow}>
                        <IconButton style={{position:'absolute', right:10}} icon="close" onPress={() => { setAlertModal(!alertModal); }} />
                        {/* Vista interna, va desde abajo del boton de cierre hasta casi el piso*/}
                        <View style={styles.alertInternal}>
                            <Text style={styles.p1}> Primero se deben completar las capsulas { displayLevel[errorNumber]}</Text>
                            {/* Listado de Visualizacion de las capsulas dentro del Modal*/}
                        </View>
                    </View>       
                </View>
            </Modal>

            
            <FlatList style={styles.flatlist} // Menu principal de la seccion de capsulas, se muestran los 3 niveles de dificultad (y la seccion de favoritos)
                contentContainerStyle={{ alignItems: 'center'}}
                data={capsuleLevels}
                keyExtractor={item=>item.id}
                renderItem={({ item }) => (
                
                <Card onPress={() => { renderCapsules(item.id) }}>
                    <LevelInfo>   
                            <CardInformation>
                                <LevelImg source={langFlag}         style={[(nivelIdioma >= parseInt(item.id, 10)) ? styles.UnlockedLanguage : styles.LockedLanguage]}/>
                                <LevelImg source={item.levelStars}  style={[(nivelIdioma >= parseInt(item.id, 10)) ? styles.UnlockedLanguage : styles.LockedLanguage]} />
                                <LevelImg source={LockIcon}         style={[(nivelIdioma >= parseInt(item.id, 10)) ? styles.Unlocked : styles.Locked]}/>
                                
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
        justifyContent: 'center', // Orientar desde el centro vertical
        fontFamily: 'serif',
        fontSize: 20,
        textAlign: 'center',
    },
    p2: {
        fontFamily: 'serif',
        fontSize: 15,
    },
    capsuleModal: {
        //justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#f8f8f8",
        //height: "40%",
        //minHeight: 250,
        width: "100%",
        height: "100%",
    },
    flatlist: {
        paddingTop: 20,
        width: '100%',
    },
    Locked: {
        opacity: 1,
        width: 80,
        height: 80,
    },
    Unlocked: {
        opacity: 0,
    },
    LockedLanguage: {
        opacity: 0.5,
    },
    UnlockedLanguage: {
        opacity: 1,
    },
    ModalInternalView: {
        alignItems: 'center', // Orientar desde el centro horizontal
        // justifyContent: 'center', // Orientar desde el centro vertical
        backgroundColor: '#f8f8f8',
        width: "100%",
        height: "90%",
        paddingTop: 0,
        top: 50,
    },

    capsuleCrown: {
        opacity: 1,
        height: 40,
        width: 40,
        top: -80,
        left: 35,
        transform:[{rotateZ: "30deg"}]
    },
    LockedCapsule: {
        position: 'relative',
        zIndex: 10,
        top: -100,
    },
    alertWindow: {
        alignItems: 'center', // Orientar desde el centro horizontal
        // justifyContent: 'center', // Orientar desde el centro vertical
        backgroundColor: '#fefefe',
        width: "80%",
        borderRadius: 30,
        borderWidth: 3,
        borderColor: '#000000',
    },
    alertInternal: {
        alignItems: 'center', // Orientar desde el centro horizontal
        justifyContent: 'center', // Orientar desde el centro vertical
        height: 140,
        padding: 30,
        paddingTop: 30,
    },
});
  
            