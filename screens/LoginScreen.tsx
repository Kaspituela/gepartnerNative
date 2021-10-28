import React, { useEffect, useState } from "react"
import { View, Text, TextInput, StyleSheet, Image, SafeAreaView, Pressable, Modal } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome'

export default function LoginScreen ({ navigation }: {navigation : any}) {
    const [mail, onChangeMail] = useState('');
    const [pass, onChangePass] = useState('');
    const [regMail, onChangeRegMail] = useState('');
    const [regName, onChangeRegName] = useState('');
    const [regPass, onChangeRegPass] = useState('');
    const [recMail, onChangeRecMail] = useState('');
    const [recPass, onChangeRecPass] = useState('');
    const [recPass2, onChangeRecPass2] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [init, setInit] = useState('null')
    const [hidePass, setHidePass] = useState(true)
    const [iconEye, setIconEye] = useState('eye-slash')
    const [recUid, setRecUid] = useState('')
    AsyncStorage.getItem('userID').then((value) => {console.log(value)})

    useEffect(() => {
        const aux = () => {
            AsyncStorage.getItem('userID').then((value) => {
                if (value != null) {
                    console.log(value)
                    fetch('http://gepartner-app.herokuapp.com/usd/?uid=' + value)
                    .then(response => {return response.json();})
                    .then(res => {
                        console.log(res.mail)
                        if (res.mail == 'admin@gmail.com') {
                            return navigation.navigate('Admin', {userid: value})    
                        } else {
                            return navigation.navigate('Language', {userid: value})
                        }
                    });
                }
                /*if (value != null){
                    return navigation.navigate('Language', {userid: value})
                }*/
            })
        }
        /*async function aux () {
            try {
                setInit(JSON.stringify(await AsyncStorage.getItem('userID')))
                console.log(init)
                if (init != 'null'){
                    return navigation.navigate('Language', {userid: Number(init.split('"')[1])})
                }
            }
            catch (error) {
                console.log(error)
            }
        }*/
        aux()
    })
    
    const handlerPress = (mail: any, pass: any) => {

        const requestLogin = { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mail: mail,
              pwd: pass
            })
        }

        try { // Llamada a la api para usd -> http://gepartner-app.herokuapp.com/usd/
            return fetch('http://gepartner-app.herokuapp.com/usd/', requestLogin)
            .then(response => {return response.json();})
            .then(data => {
                if (data.ans == 'ok') {
                    onChangeMail('')
                    onChangePass('')
                    console.log(mail)
                    if (mail == 'admin@gmail.com') {
                        console.log(mail)
                        AsyncStorage.setItem('userID', JSON.stringify(data.id))
                        navigation.navigate('Admin', {userid: data.id})
                    }
                    else {
                        console.log('no lo puedo creer')
                        AsyncStorage.setItem('userID', JSON.stringify(data.id))
                        navigation.navigate('Language', {userid: data.id})
                    }
                }
                else if (data.ans == 'wrong password') {
                    alert('La contraseña ingresada es incorrecta')
                }
                else {
                    alert('El mail ingresado no está registrado')
                }
            });
        }
        catch (error){
          console.error(error);
        }
    }

    const handlerRegPress = (regmail: any, regname: any, regpass: any) => {
        if (regMail == '' || regName == '' || regPass == ''){
            alert('Todos los campos son obligatorios')
        }
        else {
            const requestRegistration = { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  mail: regmail,
                  name:  regname,
                  pwd: regpass
                })
            }
            try { // Llamada a la api para user -> http://gepartner-app.herokuapp.com/user/
                return fetch('http://gepartner-app.herokuapp.com/user/', requestRegistration)
                .then(response => {return response.json();})
                .then(data => {
                    if (data.ans == 'ok') {
                        alert('Se ha resgistrado satisfactoriamente!')
                        setModalVisible(!modalVisible)
                    }
                    else {
                        alert('El mail indicado ya tiene una cuenta asociada')
                    }
                });
            }
            catch (error){
              console.error(error);
            }
        }
    }

    const handlerRecPress = (recmail: any, recpass: any, recpass2: any) => {
        let recuserid = ''
        if (recmail == '' || recpass == '' || recpass2 == ''){
            alert('Todos los campos son obligatorios')
        }
        else {
            if (recpass == recpass2){
                try { // Llamada a la api para usd -> http://gepartner-app.herokuapp.com/usd/
                    fetch('http://gepartner-app.herokuapp.com/usd/?mail=' + recmail)
                    .then(response => {return response.json();})
                    .then(res => {
                        recuserid = JSON.stringify(res.uid)
                        console.log(res.uid)
                        const requestRecPass = { 
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              uid: recuserid,
                              data: 'password',
                              value: recpass
                            })
                          }
                        try { // Llamada a la api para user -> http://gepartner-app.herokuapp.com/user/
                          return fetch('http://gepartner-app.herokuapp.com/user/', requestRecPass)
                          .then(response => {return response.json();})
                          .then(() => {
                                alert('La contraseña se ha actualizado')
                                onChangeRecMail('')
                                onChangeRecPass('')
                                onChangeRecPass2('')
                          })
                      }
                      catch (error){
                        console.error(error);
                      }
                    });
                }
                catch (error){
                  console.error(error);
                }
            }
            else {
                alert('Las contraseñas no coinciden.')
                onChangeRecPass('')
                onChangeRecPass2('')
            }
        }
    }

    return (
        <View style={styles.Container}>
            {/*Modal para registro*/}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                alert("Modal has been closed.");
                setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.ViewModal}>
                    <View style={styles.Exit}>
                        <Pressable style={styles.ExitRegPress} onPress={() => {setModalVisible(!modalVisible); onChangeRegMail(''); onChangeRegName(''); onChangeRegPass('')}} >
                            <Text style={{color: '#c7f9cc'}}>X</Text>
                        </Pressable>
                    </View>
                    <View style={styles.Datos}>
                        <Text style={styles.Title}>Regístrate</Text>
                        <View>
                            <Icon name="envelope" size={30} color='#c7f9cc' />
                            <TextInput style={styles.Input}  onChangeText={onChangeRegMail} value={regMail || ''} placeholder="Correo" placeholderTextColor="#c7f9cc"/>
                        </View>
                        <View>
                            <Icon name="user" size={30} color='#c7f9cc' />
                            <TextInput style={styles.Input}  onChangeText={onChangeRegName} value={regName || ''} placeholder="Nombre de usuario" placeholderTextColor="#c7f9cc"/>
                        </View>
                        <View>
                            <Icon name="key" size={30} color='#c7f9cc' />
                            <TextInput style={styles.Input}  onChangeText={onChangeRegPass} secureTextEntry={true} value={regPass || ''} placeholder="Contraseña" placeholderTextColor="#c7f9cc"/>
                        </View>
                        <Pressable style={styles.RegPress} onPress={() => handlerRegPress(regMail, regName, regPass)} >
                            <Text style={{color: '#22577a'}}>Registrarse</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            
            {/*Modal para cambiar contraseña*/}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible2}
                onRequestClose={() => {
                alert("Modal has been closed.");
                setModalVisible2(!modalVisible2);
                }}
            >
                <View style={styles.ViewModal}>
                    <View style={styles.Exit}>
                        <Pressable style={styles.ExitRegPress} onPress={() => {setModalVisible2(!modalVisible2); onChangeRecMail(''); onChangeRecPass(''); onChangeRecPass2('')}} >
                            <Text style={{color: '#c7f9cc'}}>X</Text>
                        </Pressable>
                    </View>
                    <View style={styles.Datos}>
                        <Text style={styles.Title}>Cambiar contraseña</Text>
                        <View>
                            <Icon name="envelope" size={30} color='#c7f9cc' />
                            <TextInput style={styles.Input}  onChangeText={onChangeRecMail} value={recMail || ''} placeholder="Correo" placeholderTextColor="#c7f9cc"/>
                        </View>
                        <View>
                            <Icon name="key" size={30} color='#c7f9cc' />
                            <TextInput style={styles.Input}  onChangeText={onChangeRecPass} secureTextEntry={true} value={recPass || ''} placeholder="Nueva Contraseña" placeholderTextColor="#c7f9cc"/>
                        </View>
                        <View>
                            <Icon name="key" size={30} color='#c7f9cc' />
                            <TextInput style={styles.Input}  onChangeText={onChangeRecPass2} secureTextEntry={true} value={recPass2 || ''} placeholder="Repita Nueva Contraseña" placeholderTextColor="#c7f9cc"/>
                        </View>
                        <Pressable style={styles.RegPress} onPress={() => handlerRecPress(recMail, recPass, recPass2)} >
                            <Text style={{color: '#22577a'}}>Cambiar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/*Vista principal del Login*/}
            <SafeAreaView style={styles.BoxSafe}>
                <View style={styles.Welcome}>
                    <Image style={styles.Image} source={require("../assets/images/LogoGEP.png")} />
                    <Text style={styles.p1}>Bienvenido a GEPartner!</Text>
                </View>
                <Text style={styles.p2}>Iniciar Sesión</Text>
                <View style={styles.ViewName}>
                    <Icon name="envelope" size={30} color='#22577a' />
                    <TextInput style={styles.Name}  onChangeText={onChangeMail} value={mail || ''} placeholder="ejemplo@gmail.com"/>
                </View>
                <View style={styles.ViewPass}>
                    <Icon name="key" size={30} color='#22577a' />
                    <TextInput style={styles.Pass}  onChangeText={onChangePass} secureTextEntry={hidePass} value={pass || ''} placeholder="* * * * * * * * *"/>
                    <Icon onPress={() => {setHidePass(!hidePass); if (iconEye == 'eye-slash') {setIconEye('eye')} else {setIconEye('eye-slash')}}} color='#22577a' name={iconEye} size={25} />
                </View>
                <Pressable style={styles.Pressable} onPress={() => handlerPress(mail, pass)} >
                    <Text style={{color: '#c7f9cc'}}>Ingresar</Text>
                </Pressable>
                <View style={{flexDirection: 'row'}}>
                    <Pressable onPress={() => setModalVisible(true)} >
                        <Text style={{color: '#22577a', marginHorizontal: 25}} >Regístrate</Text>
                    </Pressable>
                    <Pressable onPress={() => setModalVisible2(true)} >
                        <Text style={{color: '#22577a', marginHorizontal: 25}}>¿Olvidaste la contraseña?</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    BoxSafe: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#c7f9cc',
        borderRadius: 30,
        borderColor: '#22577a',
        borderWidth: 2,
        paddingHorizontal: 15,
        paddingVertical: 25,
        marginHorizontal: 5
    },
    Image: {
        width: 120,
        height: 120,
    },
    Welcome: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    p1: {
        textAlign: 'center',
        fontFamily: 'monospace',
        fontSize: 25,
        color: '#22577a',
        marginVertical: 5
    },
    p2: {
        textAlign: 'center',
        fontFamily: 'monospace',
        fontSize: 25,
        color: '#22577a',
        marginTop: 10,
        marginBottom: 30
    },
    ViewName: {
        flexDirection: 'row',
        borderRadius: 10,
        borderColor: '#22577a',
        borderWidth: 1, 
        textAlign: 'center',
        minWidth: 250,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginBottom: 15   
    },
    Name: {
        textAlign: 'center',
        minWidth: 200,
        maxWidth: 200,
        paddingHorizontal: 10
    },
    ViewPass: {
        flexDirection: 'row',
        borderRadius: 10,
        borderColor: '#22577a',
        borderWidth: 1, 
        textAlign: 'center',
        minWidth: 250,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginBottom: 15   
    },
    Pass: {
        textAlign: 'center',
        minWidth: 170,
        maxWidth: 150,
        paddingHorizontal: 10
    },
    Pressable: {
        backgroundColor: '#22577a',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#22577a',
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        paddingVertical: 3,
        marginBottom: 20
    }, 
    ViewModal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(34, 87, 122, 0.98)'
    },
    Exit: {
        alignSelf: 'flex-end'
    },
    ExitRegPress: {
        backgroundColor: '#22577a',
        width: 40,
        height: 40,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#c7f9cc',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 25,
        marginRight: 15
    },
    Datos: {
        flex: 1,
        alignItems: 'center'
    },
    Title: {
        color: '#c7f9cc',
        textAlign: 'center',
        fontSize: 50,
        marginBottom: 50
    },
    Input: {
        backgroundColor: '#22577a',
        textAlign: 'center',
        color: '#c7f9cc',
        borderRadius: 10,
        borderColor: '#c7f9cc',
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
    }
})