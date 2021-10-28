import React, { useEffect, useState } from "react"
import { View, Text, TextInput, StyleSheet, Image, SafeAreaView, Pressable, Modal, ScrollView, FlatList, Switch} from "react-native"
import { Card, Container, FlagImg, FlagImgWrapper, FlagInfo, FlagText, Language, TextSection } from '../styles/FlagStyle'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome'
import { parse } from "@babel/core"

export default function AdminScreen ({navigation, route}: {navigation: any, route: any}) {
    const [modalMenu, setModalMenu] = useState(false)
    const [modalAddCap, setModalAddCap] = useState(false)
    const [modalEditCap, setModalEditCap] = useState(false)
    const [modalDesCap, setModalDesCap] = useState(false)
    const [editCap, setEditCap] = useState(false)
    const [name, onChangeName] = useState('')
    const [desc, onChangeDesc] = useState('')
    const [lang, onChangeLang] = useState('')
    const [level, onChangeLevel] = useState('')
    const [membership, onChangeMembership] = useState('')
    const [vocab, onChangeVocab] = useState('')
    const [prompt, onChangePrompt] = useState('')
    const [baseAct, onChangeBaseAct] = useState('')
    const [contTitle, onChangeContTitle] = useState('')
    const [contDesc, onChangeContDesc] = useState('')
    const [contWords, onChangeContWords] = useState('')
    const [contExample, onChangeContExample] = useState('')
    const [allCap, setAllCap] = useState<any>({})
    const [renderedCapsules, setRenderedCapsules] = useState<any>([])
    const toggleSwitch = (index:any) => {
        let aux = renderedCapsules
        aux[index].visible = aux[index].visible === true ? false: true
        setRenderedCapsules(aux)
    }
    const [flag, setFlag] = useState(0)
    const [position, setPosition] = useState(0)
    const [toggle, setToggle] = useState(false)
    const [objeto, setObjeto] = useState({
                                            id: '',
                                            name: '', 
                                            visible: false,
                                            baseAct: '',
                                            desc: '',
                                            lang: 0,
                                            level: 0,
                                            premium: false,
                                            prompt: '',
                                            vocab: '',
                                            content: ''
                                        })
 
    let uid = route.params.userId
    console.log(uid)
    // Se cargan las capsulas desde la API segun el idioma seleccionado por el usuario.
    useEffect(() => {
        var capsules: any = [];
        let pos = 0
            
        // Capsulas disponibles en español
        fetch('http://gepartner-app.herokuapp.com/caps?lang=' + 0)
        .then(response => { return response.json(); })
        .then(data => {
            let aux = ''
            data.capsules.forEach((item:any) => {
                console.log(item.visible)
                console.log(item.premium)
                if (item.visible){
                    aux = 'toggle-on'
                }
                else {
                    aux = 'toggle-off'
                }
                capsules.push({
                    id: item.id,
                    pos: pos,
                    name: item.name, 
                    visible: item.visible,
                    toggle: aux,
                    baseAct: item.baseAct,
                    desc: item.desc,
                    lang: item.lang,
                    level: item.level,
                    premium: item.premium,
                    prompt: item.prompt,
                    vocab: item.vocab,
                    content: item.content
                })
                pos = pos + 1
            });
            setPosition(pos)
        });

        // Capsulas disponibles en ingles
        fetch('http://gepartner-app.herokuapp.com/caps?lang=' + 1)
        .then(response => { return response.json(); })
        .then(data => {
            let aux = ''
            data.capsules.forEach((item:any) => {
                if (item.visible){
                    aux = 'toggle-on'
                }
                else {
                    aux = 'toggle-off'
                }
                capsules.push({
                    id: item.id,
                    pos: pos,
                    name: item.name, 
                    visible: item.visible,
                    toggle: aux,
                    baseAct: item.baseAct,
                    desc: item.desc,
                    lang: item.lang,
                    level: item.level,
                    premium: item.premium,
                    prompt: item.prompt,
                    vocab: item.vocab,
                    content: item.content
                })
                pos = pos + 1
            });
        });

        setRenderedCapsules(capsules)
        setPosition(pos)
    }, [flag])

    const handlerPress = () => {
        AsyncStorage.removeItem('userID').then((res) => console.log(res))
        return navigation.navigate('Login')
    }

    const handlerPressAdd = (name:any, desc:any, lang:any, level:any, membership:any, vocab:any, prompt:any, baseAct:any, contTitle:any, contDesc:any, contWords:any, contExample:any) => {
        if (name == '' || desc == '' || lang == '' || level == '' || membership == '' || vocab == '' || prompt == '' || baseAct == '' || contTitle == '' || contDesc == '' || contWords == '' || contExample == ''){
            alert('Todos los campos son obligatorios')
        }
        else {
            let lang2 = 0
            let level2 = 0
            let membership2 = false
            const listBaseAct = baseAct.split(' ')
            const aux = contWords.split(',')
            const listContWords:any = []
            aux.map((element:any) => listContWords.push(element.split(' ')))
            const aux2 = contExample.split(',')
            console.log(aux2)
            const aux3:any = []
            aux2.map((element:any) => aux3.push(element.split(' ')))
            console.log(aux3)
            const aux4:any = []
            aux3.map((element1:any) => aux4.push(element1.map((element2:any) => element2.split('-'))))
            console.log(aux4)
            const listContExample:any = []
            aux4.map((element1:any) => listContExample.push(element1.map((element2:any) => element2.join(' '))))
            console.log(listContExample)
            if (lang == '0'){
                lang2 = 0
            }
            else {
                lang2 = 1
            }
            if (level == '0'){
                level2 = 0
            }
            else if (level == '1'){
                level2 = 1
            }
            else {
                level2 = 2
            }
            if (membership == 'true') {
                membership2 = true
            }
            else {
                membership2 = false
            }
            const requestNewCap = { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: name,
                  desc: desc,
                  lang: lang2,
                  level: level2,
                  premium: membership2,
                  vocab: vocab,
                  prompt: prompt,
                  baseAct: listBaseAct,
                  content_title: contTitle,
                  content_desc: contDesc,
                  content_words: listContWords,
                  content_exp: listContExample,
                })
            }
            try { // Llamada a la api para user -> http://gepartner-app.herokuapp.com/user/
                return fetch('http://gepartner-app.herokuapp.com/acaps/', requestNewCap)
                .then(response => {return response.json();})
                .then(data => {
                    if (data.ans == 'ok') {
                        alert('Se ha agregado satisfactoriamente!')
                        setModalAddCap(!modalAddCap)
                    }
                    else {
                        alert('Ha ocurrido un error')
                    }
                });
            }
            catch (error){
              console.error(error);
            }
        }
    }

    const handlerPressToggle = (index:any, idCap:any) => {
        let aux = renderedCapsules
        let vis = false
        console.log(aux[index].toggle)
        if (aux[index].toggle == 'toggle-on' ) {
            aux[index].toggle = 'toggle-off'
            vis = false
        }
        else {
            aux[index].toggle = 'toggle-on'
            vis = true
        }
        setRenderedCapsules(aux)
        setToggle(!toggle)

        const requestVisible = { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cid: idCap,
              data: 'visible',
              value: vis
            })
        }
        try { // Llamada a la api para caps -> http://gepartner-app.herokuapp.com/caps/
          return fetch('http://gepartner-app.herokuapp.com/acaps/', requestVisible)
          .then(response => {return response.json();})
          .then(data => console.log(data))
        }
        catch (error){
            console.error(error);
        }
    }
    
    const handlerPressEdit = (item:any) => {
        setObjeto(item)
        onChangeName(item.name)
        onChangeDesc(item.desc)
        onChangeLang(item.lang.toString())
        onChangeLevel(item.level.toString())
        onChangeMembership(item.premium.toString())
        onChangeVocab(item.vocab)
        onChangePrompt(item.prompt)
        onChangeBaseAct(item.baseAct)
        onChangeContTitle(item.content)
        setEditCap(true)
    }

    const handlerPressEditCap = (name:any, desc:any, lang:any, level:any, membership:any, vocab:any, prompt:any, baseAct:any, contTitle:any) => {
        const requestName = { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cid: objeto.id,
              data: 'name',
              value: name
            })
        }
        const requestDesc = { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cid: objeto.id,
              data: 'desc',
              value: desc
            })
        }
        const requestLang = { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cid: objeto.id,
              data: 'lang',
              value: parseInt(lang, 10)
            })
        }
        const requestLevel = { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cid: objeto.id,
              data: 'level',
              value: parseInt(level, 10)
            })
        }
        const requestPremium = { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cid: objeto.id,
              data: 'premium',
              value: membership == 'true'? true:false
            })
        }
        const requestVocab = { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cid: objeto.id,
              data: 'vocab',
              value: vocab
            })
        }
        const requestPrompt = { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cid: objeto.id,
              data: 'prompt',
              value: prompt
            })
        }
        const requestBaseAct = { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cid: objeto.id,
              data: 'baseAct',
              value: baseAct
            })
        }
        const requestContent = { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cid: objeto.id,
              data: 'content',
              value: contTitle
            })
        }
        try { // Llamada a la api para caps -> http://gepartner-app.herokuapp.com/caps/
          fetch('http://gepartner-app.herokuapp.com/acaps/', requestName)
          .then(response => {return response.json();})
          .then(data => console.log(data))

          fetch('http://gepartner-app.herokuapp.com/acaps/', requestDesc)
          .then(response => {return response.json();})
          .then(data => console.log(data))

          fetch('http://gepartner-app.herokuapp.com/acaps/', requestLang)
          .then(response => {return response.json();})
          .then(data => console.log(data))

          fetch('http://gepartner-app.herokuapp.com/acaps/', requestLevel)
          .then(response => {return response.json();})
          .then(data => console.log(data))

          fetch('http://gepartner-app.herokuapp.com/acaps/', requestPremium)
          .then(response => {return response.json();})
          .then(data => console.log(data))

          fetch('http://gepartner-app.herokuapp.com/acaps/', requestVocab)
          .then(response => {return response.json();})
          .then(data => console.log(data))

          fetch('http://gepartner-app.herokuapp.com/acaps/', requestPrompt)
          .then(response => {return response.json();})
          .then(data => console.log(data))

          fetch('http://gepartner-app.herokuapp.com/acaps/', requestBaseAct)
          .then(response => {return response.json();})
          .then(data => console.log(data))

          fetch('http://gepartner-app.herokuapp.com/acaps/', requestContent)
          .then(response => {return response.json();})
          .then(data => console.log(data))
        }
        catch (error){
            console.error(error);
        }
        onChangeName('')
        onChangeDesc('')
        onChangeLang('')
        onChangeLevel('')
        onChangeMembership('')
        onChangeVocab('')
        onChangePrompt('')
        onChangeBaseAct('')
        onChangeContTitle('')
        setEditCap(false)
    }

    return (
        <View style={styles.Container}>
            {/*Modal para cerrar sesión*/}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalMenu}
                onRequestClose={() => {
                setModalMenu(!modalMenu);
                }}
            >
                <View style={styles.ViewModal}>
                    <View style={styles.Exit}>
                        <Icon style={{marginTop:20, marginRight:10}} onPress={() => { setModalMenu(!modalMenu) }} name="power-off" size={30} />
                    </View>
                    <Pressable style={styles.CloseSession} onPress={() => handlerPress()} >
                        <Text style={{color: '#c7f9cc'}}>Cerrar Sesión</Text>
                    </Pressable>
                </View>
            </Modal>
            
            {/*Modal para agregar capsula*/}
            <Modal
                animationType="fade"
                transparent={false}
                visible={modalAddCap}
                onRequestClose={() => {
                setModalAddCap(!modalAddCap);
                }}
            >
                <ScrollView>
                    <View style={styles.Exit2}>
                        <Icon style={{marginTop:20, marginLeft:10}} onPress={() => { setModalAddCap(!modalAddCap) }} name="arrow-left" size={30} />
                    </View>
                    <View style={styles.Datos}>
                        <Text style={styles.Title}>Nueva Cápsula</Text>
                        <View>
                            <Text style={{color: '#22577a', fontSize: 15}}>Nombre de la cápsula</Text>
                            <TextInput style={styles.Input}  onChangeText={onChangeName} value={name || ''} placeholder="" placeholderTextColor="#c7f9cc"/>
                        </View>
                        <View>
                            <Text style={{color: '#22577a', fontSize: 15}}>Descripción de la cápsula</Text>
                            <TextInput multiline style={styles.Input}  onChangeText={onChangeDesc} value={desc || ''} placeholder="" placeholderTextColor="#c7f9cc"/>
                        </View>
                        <View>
                            <Text style={{color: '#22577a', fontSize: 15}}>Lenguaje de la cápsula</Text>
                            <TextInput multiline style={styles.Input}  onChangeText={onChangeLang} value={lang || ''} placeholder="" placeholderTextColor="#c7f9cc"/>
                        </View>
                        <View>
                            <Text style={{color: '#22577a', fontSize: 15}}>Nivel de la cápsula</Text>
                            <TextInput multiline style={styles.Input}  onChangeText={onChangeLevel} value={level || ''} placeholder="" placeholderTextColor="#c7f9cc"/>
                        </View>
                        <View>
                            <Text style={{color: '#22577a', fontSize: 15}}>Membresía de la cápsula</Text>
                            <TextInput multiline style={styles.Input}  onChangeText={onChangeMembership} value={membership || ''} placeholder="" placeholderTextColor="#c7f9cc"/>
                        </View>
                        <View>
                            <Text style={{color: '#22577a', fontSize: 15}}>Vocabulario de la cápsula</Text>
                            <TextInput multiline style={styles.Input}  onChangeText={onChangeVocab} value={vocab || ''} placeholder="Escriba las palabras separadas por coma" placeholderTextColor="#22577a"/>
                        </View>
                        <View>
                            <Text style={{color: '#22577a', fontSize: 15}}>Prompt de la cápsula</Text>
                            <TextInput multiline style={styles.Input}  onChangeText={onChangePrompt} value={prompt || ''} placeholder="" placeholderTextColor="#c7f9cc"/>
                        </View>
                        <View>
                            <Text style={{color: '#22577a', fontSize: 15}}>Actividades base de la cápsula</Text>
                            <TextInput multiline style={styles.Input}  onChangeText={onChangeBaseAct} value={baseAct || ''} placeholder="Escriba las palabras separadas por coma" placeholderTextColor="#22577a"/>
                        </View>
                        <View>
                            <Text style={{color: '#22577a', fontSize: 15}}>Título de contenido de la cápsula</Text>
                            <TextInput multiline style={styles.Input}  onChangeText={onChangeContTitle} value={contTitle || ''} placeholder="" placeholderTextColor="#c7f9cc"/>
                        </View>
                        <View>
                            <Text style={{color: '#22577a', fontSize: 15}}>Descripción de contenido de la cápsula</Text>
                            <TextInput multiline style={styles.Input}  onChangeText={onChangeContDesc} value={contDesc || ''} placeholder="" placeholderTextColor="#c7f9cc"/>
                        </View>
                        <View>
                            <Text style={{color: '#22577a', fontSize: 15}}>Palabras de contenido de la cápsula</Text>
                            <TextInput multiline style={styles.Input}  onChangeText={onChangeContWords} value={contWords || ''} placeholder="Escriba las palabras separadas por un espacio y luego por una coma. Ejemplo: I yo,you tu" placeholderTextColor="#22577a"/>
                        </View>
                        <View>
                            <Text style={{color: '#22577a', fontSize: 15}}>Ejemplos de contenidos de la cápsula</Text>
                            <TextInput multiline style={styles.Input}  onChangeText={onChangeContExample} value={contExample || ''} placeholder="Escriba las palabras separadas por un guión, las frases separadas por un espacio y luego por una coma. Ejemplo: I-am-tired Estoy-aburrido,I-am-happy Estoy-feliz" placeholderTextColor="#22577a"/>
                        </View>
                        <Pressable style={styles.RegPress} onPress={() => {handlerPressAdd(name, desc, lang, level, membership, vocab, prompt, baseAct, contTitle, contDesc, contWords, contExample)}} >
                            <Text style={{color: '#22577a'}}>Agregar</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </Modal>
            
            {/*Modal para editar capsula*/}
            <Modal
                animationType="fade"
                transparent={false}
                visible={editCap}
                onRequestClose={() => {
                    onChangeName('')
                    onChangeDesc('')
                    onChangeLang('')
                    onChangeLevel('')
                    onChangeMembership('')
                    onChangeVocab('')
                    onChangePrompt('')
                    onChangeBaseAct('')
                    onChangeContTitle('')
                    setEditCap(!editCap)
                }}
            >
                <View>
                    <View style={styles.Exit2}>
                        <Icon style={{marginTop:20, marginLeft:10}} onPress={() => {
                            onChangeName('')
                            onChangeDesc('')
                            onChangeLang('')
                            onChangeLevel('')
                            onChangeMembership('')
                            onChangeVocab('')
                            onChangePrompt('')
                            onChangeBaseAct('')
                            onChangeContTitle('')
                            setEditCap(!editCap) }}
                            name="arrow-left" size={30} />
                    </View>
                    <Text style={styles.Title}>Editar</Text>
                    <ScrollView style={{height: '70%', alignSelf: 'center'}}>

                        <View>
                            <Text style={{color: '#22577a', fontSize: 15}}>Nombre de la cápsula</Text>
                            <TextInput style={styles.Input}  onChangeText={onChangeName} value={name} placeholder="" placeholderTextColor="#c7f9cc"/>
                        </View>
                        <View>
                            <Text style={{color: '#22577a', fontSize: 15}}>Descripción de la cápsula</Text>
                            <TextInput multiline style={styles.Input}  onChangeText={onChangeDesc} value={desc} placeholder="" placeholderTextColor="#c7f9cc"/>
                        </View>
                        <View>
                            <Text style={{color: '#22577a', fontSize: 15}}>Lenguaje de la cápsula</Text>
                            <TextInput multiline style={styles.Input}  onChangeText={onChangeLang} value={lang} placeholder="" placeholderTextColor="#c7f9cc"/>
                        </View>
                        <View>
                            <Text style={{color: '#22577a', fontSize: 15}}>Nivel de la cápsula</Text>
                            <TextInput multiline style={styles.Input}  onChangeText={onChangeLevel} value={level} placeholder="" placeholderTextColor="#c7f9cc"/>
                        </View>
                        <View>
                            <Text style={{color: '#22577a', fontSize: 15}}>Membresía de la cápsula</Text>
                            <TextInput multiline style={styles.Input}  onChangeText={onChangeMembership} value={membership} placeholder="" placeholderTextColor="#c7f9cc"/>
                        </View>
                        <View>
                            <Text style={{color: '#22577a', fontSize: 15}}>Vocabulario de la cápsula</Text>
                            <TextInput multiline style={styles.Input}  onChangeText={onChangeVocab} value={vocab} placeholder="Escriba las palabras separadas por coma" placeholderTextColor="#22577a"/>
                        </View>
                        <View>
                            <Text style={{color: '#22577a', fontSize: 15}}>Prompt de la cápsula</Text>
                            <TextInput multiline style={styles.Input}  onChangeText={onChangePrompt} value={prompt} placeholder="" placeholderTextColor="#c7f9cc"/>
                        </View>
                        <View>
                            <Text style={{color: '#22577a', fontSize: 15}}>Actividades base de la cápsula</Text>
                            <TextInput multiline style={styles.Input}  onChangeText={onChangeBaseAct} value={baseAct} placeholder="Escriba las palabras separadas por coma" placeholderTextColor="#22577a"/>
                        </View>
                        <View>
                            <Text style={{color: '#22577a', fontSize: 15}}>Contenido de la cápsula</Text>
                            <TextInput multiline style={styles.Input}  onChangeText={onChangeContTitle} value={contTitle} placeholder="" placeholderTextColor="#c7f9cc"/>
                        </View>
                        <Pressable style={styles.RegPress} onPress={() => {handlerPressEditCap(name, desc, lang, level, membership, vocab, prompt, baseAct, contTitle)}} >
                            <Text style={{color: '#22577a'}}>Editar</Text>
                        </Pressable>
                    </ScrollView>
                </View>
            </Modal>

            {/*Modal para editar capsula*/}
            <Modal
                animationType="fade"
                transparent={false}
                visible={modalEditCap}
                onRequestClose={() => {
                setModalEditCap(!modalEditCap);
                }}
            >
                <View>
                    <View style={styles.Exit2}>
                        <Icon style={{marginTop:20, marginLeft:10}} onPress={() => { setModalEditCap(!modalEditCap) }} name="arrow-left" size={30} />
                    </View>
                    <Text style={styles.Title}>Editar Cápsula</Text>
                    <SafeAreaView style={{height: '70%'}}>
                        <FlatList
                                contentContainerStyle={{ alignItems: 'flex-start'}}
                                data={renderedCapsules}
                                extraData={toggle}
                                keyExtractor={item=>item.pos.toString()}
                                renderItem={({ item }) => (
                                <Card style={styles.Card} onPress={() => {handlerPressEdit(item)}}>
                                    <FlagText >
                                        <Language style={{fontFamily: 'monospace', fontSize: 17, color: '#22577a'}}>{item.name}</Language>
                                    </FlagText>
                                </Card>
                        )}/>
                    </SafeAreaView>
                </View>
            </Modal>

            {/*Modal para desactivar capsula*/}
            <Modal
                animationType="fade"
                transparent={false}
                visible={modalDesCap}
                onRequestClose={() => {
                setModalDesCap(!modalDesCap);
                }}
            >
                <View>
                    <View style={styles.Exit2}>
                        <Icon style={{marginTop:20, marginLeft:10}} onPress={() => { setModalDesCap(!modalDesCap) }} name="arrow-left" size={30} />
                    </View>
                    <Text style={styles.Title}>Deshabilitar Cápsula(s)</Text>
                    <SafeAreaView style={{height: '70%'}}>
                        <FlatList
                                contentContainerStyle={{ alignItems: 'flex-start'}}
                                data={renderedCapsules}
                                extraData={toggle}
                                keyExtractor={item=>item.pos.toString()}
                                renderItem={({ item }) => (
                                <Card style={styles.Card}>
                                    <FlagText >
                                        <Language style={{fontFamily: 'monospace', fontSize: 17, color: '#22577a'}}>{item.name}</Language>
                                    </FlagText>
                                    <Icon onPress={() => {handlerPressToggle(item.pos, item.id)}} name={item.toggle} size={30} />
                                </Card>
                        )}/>
                    </SafeAreaView>
                </View>
            </Modal>

            <View style={{alignItems: 'flex-end'}}>
                <Icon style={{marginRight: 10, marginBottom: 10}} onPress={() => { setModalMenu(true) }} name="power-off" size={30} />
            </View>

            <View>
                <Pressable style={styles.PressAdd} onPress={() => {setModalAddCap(true)}}>
                    <Text style={{color:'#c7f9cc', fontSize: 20}}>Agregar Cápsula</Text>
                </Pressable>
                <Pressable style={styles.PressEdit} onPress={() => {setModalEditCap(true)}}>
                    <Text style={{color:'#c7f9cc', fontSize: 20}}>Editar Cápsula(s)</Text>
                </Pressable>
                <Pressable style={styles.PressDes} onPress={() => {setModalDesCap(true)}}>
                    <Text style={{color:'#c7f9cc', fontSize: 20}}>Deshabilitar Cápsula(s)</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    ViewModal: {
        flex: 0.2,
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginHorizontal: 0
    },
    CloseSession: {
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
        height: 40,
        marginRight: 10,
        borderBottomLeftRadius: 10
    },
    Exit: {
        alignSelf: 'flex-end'
    },
    Exit2: {
        alignSelf: 'flex-start'
    },
    PressAdd: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#22577a', 
        paddingVertical: 30, 
        marginTop: 150
    },
    PressEdit: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#22577a', 
        paddingVertical: 30,
        marginVertical: 30
    },
    PressDes: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#22577a', 
        paddingVertical: 30
    },
    Datos: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 25
    },
    Title: {
        color: '#22577a',
        textAlign: 'center',
        fontSize: 50,
        marginBottom: 50,
        marginTop: 20
    },
    Input: {
        backgroundColor: '#c7f9cc',
        textAlign: 'center',
        color: '#22577a',
        borderRadius: 10,
        borderColor: '#22577a',
        borderWidth: 1,
        minWidth: 250,
        maxWidth: 300,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginBottom: 25
    },
    RegPress: {
        backgroundColor: '#c7f9cc',
        width: 100,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#22577a',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 3,
        marginBottom: 10
    },
    flatlist: {
        paddingTop: 20,
        width: '100%'
    },
    Card: {
        flexDirection: 'row',
        margin: 5,
        width: '100%'
    }
})