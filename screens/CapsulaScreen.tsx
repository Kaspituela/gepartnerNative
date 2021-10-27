import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
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

    // obtener nivel de idioma del usuario desde BD!!!
    var nivelIdioma = 2;

    // Definicion de número de capsulas que el usuario gratis puede completar en un solo dia. Por defecto 2.
    var capsuleLimit = 2;
    
    var langFlag = route.params.langFlag;
    var lang = route.params.Lang == 'english' ? 0 : 1;
    const [membership, setMembership] = useState(false);

    // Informacion de display y Modals
    const [capsuleModal, setCapsuleModal] = useState(false);
    const [alertModal, setAlertModal] = useState(false);
    const [activityModal, setActivityModal] = useState(false);

    // Mensaje de alerta para las capsulas inaccesibles
    const [alertMessage, setAlertMessage] = useState("");

    const displayLevel = ["de nivel Basico", "de nivel Intermedio", "de nivel Avanzado", "Favoritas"];
    const [showLevel, setShowLevel] = useState(0);

    // Datos completos de cada una de las capsulas
    const [allCapsules, setAllCapsules] = useState<any>({});

    // Conjuntos de capsulas según nivel del usuario (Basico, Intermedio, Avanzado), o las favoritas
    const [bCapsules, set_bCapsules] = useState<any>([]);
    const [iCapsules, set_iCapsules] = useState<any>([]);
    const [aCapsules, set_aCapsules] = useState<any>([]);
    const [favCapsules, set_favCapsules] = useState<any>([]);

    // Maneja la capsula que se encuentra seleccionada actualmente. Se utiliza para mostrar los detalles de esa capsula
    // se define un vacio para evitar la instanciacion nula.
    const [selectedCapsule, set_SelectedCapsule] = useState({
        id: 0,
        desc: "placeholder",
        name: "No name",
        favorite: false,
        completed: false,
    });
    const [selectedIsFavorite, set_selectedIsFavorite] = useState(false);

    // Guarda el listado de capsulas completadas, similar a los favoritos (Utilizado para funcion PUT)
    const [completed, setCompleted] = useState<any>([]);

    // Guarda el indice de las capsulas que tienen un progreso distinto a 0. El valor se guarda en la informacion de la capsula. (Usado para funcion PUT)
    const [progress, setProgress] = useState<any>([]);


    // El menú de capsulas mostrará renderedCapsules en el menú. De esta forma la funcion solo se necesita ajustar a esta variable, 
    // y las demás solo almacenaran los datos, cargandose cuando sea necesario.
    const [renderedCapsules, setRenderedCapsules] = useState<any>([]);

    /* Contenido de una capsula:
        Object{
            "baseAct",  -> idk
            "desc",     -> string;  descripcion de la capsula
            "id"        -> int;     id de la capsula
            "lang",     -> int;     idioma de la capsula
            "level"     -> int;     nivel de idioma requerido para acceder a la capsula
            "name"      -> string;  nombre de la capsula
            "premium"   -> bool;    si la capsula es solo para usuarios premium
            "prompt"    -> idk 
            "vocab"     -> idk

            "progress"  -> int;     Progreso de la capsula
            "completed" -> bool;    está completada o no               
            "favorite"  -> bool;    está marcada como favorita o no.   
        }
    */

    // Se cargan las capsulas desde la API segun el idioma seleccionado por el usuario.
    useEffect(() => {

        // Fijar el tipo de membresia del usuario
        setMembership(route.params.isPremium);

        // Obtencion de las capsulas disponibles en el idioma seleccionado

        fetch('http://gepartner-app.herokuapp.com/caps?lang=' + lang)
        .then(response => { return response.json(); })
        .then(data => {
            
            // Indices de las capsulas que pertenecen a cada categoria
            var capsulasB:any[] = [];
            var capsulasI:any[] = [];
            var capsulasA:any[] = [];
            
            // Listado de todas las capsulas, con sus datos completos
            var capsuleDict: any = {};

            if (data.capsules.length == 0) {
                setAllCapsules(capsuleDict);
                return;
            }
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

            // Se realizan distintos fetch adicionales para las caracteristicas individuales del usuario

            // Obtener indice de capsulas favoritas del usuario
            fetch('http://gepartner-app.herokuapp.com/user?uid=' + route.params.cUserId + '&data=favorites')
                .then(response => { return response.json(); })
                .then(favInfo => {
            
                    var fav: any[] = [];

                    // Se asignan como favoritas aquellas capsulas marcadas por el usuario
                    favInfo.user.favorites.forEach((item: any) => {
                        capsuleDict[item].favorite = true;
                        fav.push(parseInt(item, 10)); // Guarda el indice de las capsulas marcadas (utilizado para editar el el valor en BD)
                    });
                    // Guarda los indices de las favoritas.
                    set_favCapsules(fav);
                    setAllCapsules(capsuleDict);
                });

                // Obtener el listado de capsulas completadas
            fetch('http://gepartner-app.herokuapp.com/user?uid=' + route.params.cUserId + '&data=completed')
                .then(response => { return response.json(); })
                .then(completionInfo => {
                    //console.log(completionInfo.user.completed); // Es un array similar a las favoritas

                    var complete: any[] = [];

                    completionInfo.user.completed.forEach((item: any) => {
                        capsuleDict[item.toString()].completed = true;
                        complete.push(item); // Guarda el indice de las capsulas terminadas
                        console.log(capsuleDict[item.toString()]);
                    });
                    // Guarda los indices de las completadas.
                    setCompleted(complete);
                    setAllCapsules(capsuleDict);
                });
            
            
            // Listado de progreso de las distintas capsulas
            fetch('http://gepartner-app.herokuapp.com/user?uid=' + route.params.cUserId + '&data=progress')
                .then(response => { return response.json(); })
                .then(progressInfo => {

                    // Toma un string del tipo {id:valor, id:valor} y lo convierte a valores usables por la aplicacion
                    var progressItems = progressInfo.user.progress.slice(1, -1);
                    // Se eliminan los { }, y se verifica si aun queda string.
                    if (progressItems.length != 0) {

                        // Se separa cada elemento
                        progressItems = progressItems.replace(/\s/g, '').split(",");
                        var progressList: any[] = [];

                        progressItems.forEach((element: any) => {
                            element = element.split(":");
                            capsuleDict[element[0]].progress = parseFloat(element[1]);
                            progressList.push(parseInt(element[0], 10));
                        });
                        // Guarda los indices de las capsulas con progreso
                        setProgress(progressList);
                    }
                    setAllCapsules(capsuleDict);
                    console.log(allCapsules);
                })

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
        // No activar las capsulas si la alerta está puesta
        if (alertModal) {
            return;
        }

        var lvlCapsula = parseInt(nivelCapsula, 10);
    
        // El menu de capsulas solo se carga cuando el usuario tiene el nivel de idioma requerido para acceder
        if (nivelIdioma >= lvlCapsula) {
            setShowLevel(lvlCapsula);

            // Copia de los indices de las capsulas que se deben mostrar.
            let renderIndex = [];

            switch (lvlCapsula) {
                case 0:
                    renderIndex = bCapsules;
                    break;
                case 1:
                    renderIndex = iCapsules;
                    break;
                case 2:
                    renderIndex = aCapsules;
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
                setAlertMessage("Primero se deben completar las capsulas" + displayLevel[lvlCapsula-1])
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

        var initialState = item.favorite;

        var capsuleDict = allCapsules;
        capsuleDict[item.id.toString()].favorite = !item.favorite;
        setAllCapsules(capsuleDict);

        if (initialState) {            
            var newFavList = favCapsules;
            var index = newFavList.indexOf(item.id);
            newFavList.splice(index, 1); // Se obtiene la lista luego de eliminar el valor
            set_favCapsules(newFavList);
        } else {
            var favIndex = favCapsules;
            favIndex.splice(orderIndex(favIndex, item.id), 0, item.id); // Se agrega el nuevo indice de forma ordenada
            set_favCapsules(favIndex); // Se guarda el nuevo listado de indices
        }
        var newSelected = allCapsules[item.id];
        set_SelectedCapsule(newSelected);
        set_selectedIsFavorite(newSelected.favorite);

        // En caso de que la capsula haya sido alterada desde la ventana de favoritos, se actualizará la lista.
        if (showLevel == 3) {
            // Se cierra la pestaña de la capsula que se está viendo (Como ya no está en favoritos, no puede ser accedida).
            setActivityModal(false);

            // Si no quedan más favoritos se cerrará el menu de favoritos y se mostrará la alerta de que no quedan capsulas.
            if (favCapsules.length == 0) { // Se re-renderiza la lista de capsulas favoritas, solo si quedan capsulas
                setCapsuleModal(false);
                setAlertMessage("No quedan capsulas en Favoritos.");
                setAlertModal(true);
            } else {
                renderFavCapsules();
            }
        }

        const requestOptions = { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uid: route.params.cUserId,
                data: 'favorites',
                value: favCapsules, 
            })
        }
        try {
            return fetch('http://gepartner-app.herokuapp.com/user/'+route.params.cUi, requestOptions)
            .then(response => { return response.json(); })
            .then(data => { 
                    console.log(data);
            })
        } catch (error) {
            console.log("F");
            console.log("Error");
        }
    }

    const renderFavCapsules = () => {

        // Muestra las capsulas favoritas en caso de que estas existan.
        if (favCapsules.length > 0) {
            setShowLevel(3);

            var renderer:any[] = [];
            favCapsules.forEach((index:any) => {
                renderer.push(allCapsules[index]);
            });
            setRenderedCapsules(renderer);

            setCapsuleModal(true);
        } else {
            if (!activityModal && !alertModal && !capsuleModal) {
                setAlertMessage("No hay capsulas en Favoritos");
                setAlertModal(true);
            }
        }
    }

    // Se abre la capsula seleccionada en el menu de capsulas
    const openCapsule = () => {

        var canDo = false;

        // Revision para verificar que el usuario gratis solo puede completar 2 capsulas por dia
        if (!membership) {
            fetch('http://gepartner-app.herokuapp.com/user?uid=' + route.params.cUserId + '&data=daily_done')
            .then(response => { return response.json(); })
            .then(daily => {
                console.log(daily.user.daily_done);
                if (daily.user.daily_done < capsuleLimit) {
                    // Envia al usuario a la capsula seleccionada
                    navigation.navigate('VocabularyScreen', { idCapsula: selectedCapsule.id });
                    setCapsuleModal(false);
                    setActivityModal(false);
                } else {
                    setAlertMessage("Ya has llegado al límite de capsulas diarias");
                    setAlertModal(true);
                }
            });      
        }else { // Si el usuario es premium, se le premite ingresar de forma inmediata.
            navigation.navigate('VocabularyScreen', { idCapsula: selectedCapsule.id });
            setCapsuleModal(false);
            setActivityModal(false);
        }
    }


    const viewCapsule = (item: any) => {

        // Las condiciones en los 2 IF internos evitan que se pueda abrir varios menus de forma simultanea
        if (item.premium && !membership) {
            setAlertMessage("Esta capsula solo está disponible para usuarios Premium.");
            if (!activityModal && !alertModal) {
                setAlertModal(true);   
            }
        } else {
            if (!alertModal && !activityModal) {
                set_SelectedCapsule(item);
                set_selectedIsFavorite(item.favorite);
                setActivityModal(true);      
            }
        }
    }

    return (
        <Container style={[alertModal ? { opacity: 0.3, backgroundColor: "#f4f4f4" } : { opacity: 1 }]}>
            
            { // Boton de favoritos. Consiste en una estrella amarilla, y un outline un poco mas grande.
            }
            <View style={{position:'absolute', zIndex: 100, top: 20, width:'100%', height: 90}}>
                <View style={{position:'absolute', right: 10.8, width:80, opacity:0.7}}>
                    <Icon
                        // Boton para acceder a las capsulas favoritas
                        size={80}
                        name="star-outline"
                        onPress={() => { renderFavCapsules() }}
                    />
                </View>
                <View style={{position:'absolute', right:10.8, top: 8.4, width:80, opacity:1}}>
                    <Icon
                        // Boton para acceder a las capsulas favoritas
                        size={65}
                        name="star"
                        color="yellow"
                        onPress={() => { renderFavCapsules() }}
                        />
                </View>
            </View>
                        
            
            <Modal // Menu que muestra los detalles de las capsulas.
                transparent={true}
                animationType={"fade"}
                visible={activityModal}
                onRequestClose={() => { setActivityModal(!activityModal) }} >
                
                {/* Diseño del tamaño completo de la pantalla */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                    { /* Vista del cuadro interno del Modal */}
                    <View style={styles.capsuleDetails}>
                        <IconButton style={{ position: 'absolute', right:10}} icon="close" onPress={() => { setActivityModal(!activityModal); }} />
                        <IconButton style={{ position: 'absolute', left: 10 }} icon={selectedIsFavorite ? "heart" : "heart-outline"} color={selectedIsFavorite ? "#FF0000" : "#000000"} onPress={() => { toggleFavorite(selectedCapsule); }} />
                        {/* Vista interna, va desde abajo del boton de cierre hasta casi el piso*/}
                        <View style={styles.capsuleInternal}>
                                
                            <View style={styles.capsuleTitle}>
                                <ScrollView
                                    style={styles.TextStyle}>
                                    <Text style={{fontFamily: 'serif', fontSize: 25, textAlign: 'center',}}>{selectedCapsule.name}</Text>
                                </ScrollView>
                            </View>
{/*

                                <ScrollView style={styles.capsuleDescription}>
                                    <Text style={{fontFamily: 'serif', fontSize: 20, textAlign: 'center'}}>{selectedCapsule.desc}{selectedCapsule.desc}{selectedCapsule.desc}{selectedCapsule.desc}{selectedCapsule.desc}{selectedCapsule.desc}{selectedCapsule.desc}{selectedCapsule.desc}{selectedCapsule.desc}{selectedCapsule.desc}{selectedCapsule.desc}{selectedCapsule.desc}{selectedCapsule.desc}{selectedCapsule.desc}{selectedCapsule.desc}{selectedCapsule.desc}{selectedCapsule.desc}{selectedCapsule.desc}{selectedCapsule.desc}{selectedCapsule.desc}{selectedCapsule.desc}{selectedCapsule.desc}{selectedCapsule.desc}{selectedCapsule.desc}{selectedCapsule.desc}{selectedCapsule.desc}</Text>
                                </ScrollView>
                            
                                <TouchableOpacity style={{paddingTop: 20, bottom: 0}} onPress={()=> {openCapsule()}}>
                                    <Text style={styles.openButton}>Realizar</Text>
                                </TouchableOpacity>
                                */}
                        </View>
                    </View>    
                </View>
            </Modal>

            
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
                        <View style={[styles.ModalInternalView, (activityModal || alertModal) ? { opacity: 0.3} : { opacity: 1 }]}>
                            <Text style={styles.p1}> Capsulas {displayLevel[showLevel]}</Text>
                            {/* Listado de Visualizacion de las capsulas dentro del Modal*/}
                            <FlatList style={styles.flatlist}
                                contentContainerStyle={{ alignItems: 'center'}}
                                data={renderedCapsules}
                                keyExtractor={item=>item.id.toString()}
                                renderItem={({ item }) => (
                                <CapCard onPress={() => { viewCapsule(item) }}>
                                    <CapContainer style={[{ height: 85, width: '100%' }, item.completed ? {backgroundColor: 'rgba(34, 210, 108, 0.7)'} : {} ]}>
                                        <CapImgWrapper>
                                                <View style={[(!membership && item.premium) ? { opacity: 0.6, position:'relative', zIndex: 1 } : {opacity:1}]}>
                                                    <CapImg source={langFlag} />
                                                    <CapImg source={CrownIcon} style={[item.premium ? styles.capsuleCrown : styles.Unlocked]} />
                                                </View>
                                                <CapImg source={LockIcon} style={[(!membership && item.premium) ? styles.LockedCapsule : styles.Unlocked]}/>
                                        </CapImgWrapper>
                                        <CapText>
                                            <CapName>   {item.name}</CapName>
                                            </CapText>
                                    </CapContainer>
                                    <Text style={{height:3}}> </Text>
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
                            <Text style={styles.p1}> { alertMessage } </Text>
                            {/* Listado de Visualizacion de las capsulas dentro del Modal*/}
                        </View>
                    </View>       
                </View>
            </Modal>

            
            <FlatList style={[styles.flatlist, activityModal ? { opacity: 0} : { opacity: 1 }]} // Menu principal de la seccion de capsulas, se muestran los 3 niveles de dificultad (y la seccion de favoritos)
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



    capsuleDetails: {
        alignItems: 'center', // Orientar desde el centro horizontal
        // justifyContent: 'center', // Orientar desde el centro vertical
        backgroundColor: '#fefefe',
        width: "90%",
        maxHeight: '65%',
        borderRadius: 30,
        borderWidth: 3,
        borderColor: '#000000',
    },
    capsuleInternal: {
        alignItems: 'center', // Orientar desde el centro horizontal
        justifyContent: 'center', // Orientar desde el centro vertical
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 40,
        paddingBottom: 20,
    },
    capsuleTitle: {
        justifyContent: 'center', // Orientar desde el centro vertical
        paddingBottom: 20,
        top: 0,
    },
    openButton: {
        backgroundColor: 'rgba(29, 160, 73, 0.6)',
        justifyContent: 'center', // Orientar desde el centro vertical
        fontFamily: 'serif',
        fontSize: 25,
        textAlign: 'center',
        borderRadius: 15,
        borderWidth: 2,
        height: 30,
        width: 100,
        borderColor: '#000000',
    },
    capsuleDescription: {
        //justifyContent: 'center',,
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },


    TextStyle: {
        position: 'relative',
        width: "90%",
        marginLeft: 10,
        marginRight: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth: 1,
        borderRadius:3,
        borderColor: "gray",
        backgroundColor: "#aaaaaa",
        textAlign: 'center',
        overflow: 'hidden',
        maxHeight: 100,
        //minHeight: 150
      },
});
  
            