import { FontAwesome, Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Speech from 'expo-speech';
import React, { useCallback, useEffect, useState } from 'react';
import { Component } from 'react';
import { Button, Clipboard, Modal, Platform, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat';
import { Colors, IconButton, ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

const FLASK_BACKEND_AUDIO = "http://gepartner-app.herokuapp.com/audio/";

export default function ChatScreen({navigation, route}: {navigation: any, route: any}) {
  let uid = route.params.cUserId;
  
  // Hooks para funcionamiento del Speech-To-Text
  const [recording, setRecording] = React.useState();
  const [text, setText] = React.useState("");
  const [modalAudioVisibility, setModalAudioVisibility] = useState(false);
  // ---------------------------------------------------------------------

  const [inputText,setinputText] = useState("")
  const [messageCorrection, setMessageCorrection] = useState('')
  const [messages, setMessages] = useState([])
  const [energyLocal, setEnergyLocal] = useState(0);


  const [modalVisibility, setModalVisibility] = useState(false);
  const [TTS_Text, setTTS_Text] = useState("");
  const [isPaused, setIsPaused] = useState(true);
  const [playIcon, setPlayIcon] = useState("play");
  const [hasPlayed, setHasPlayed] = useState(false);
  const [TTS_Rate, setTTS_Rate] = useState(1);
  const [varNull,setVarNull] = useState()

  var TTS_params = { language: (route.params.Lang == "english") ? "en" : "es", pitch: 1.0, rate: TTS_Rate }

  var membership = route.params.isPremium;
  const [energyTotal, setEnergyTotal] = useState(900);

  useEffect(() => {
    let lang = route.params.Lang == 'english' ? 0 : 1
    
    const requestOptions = { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
    //console.log(requestOptions)
    let bot_id = 5000 + parseInt(uid)
    fetch('http://gepartner-app.herokuapp.com/msg?lng=' + lang + '&uid=' + uid + '&bid='+bot_id, requestOptions)
		.then(response => {return response.json();})
		.then(data => {
      let newdata = data.user.concat(data.bot);
      addMessages(newdata)
    });

    fetch('http://gepartner-app.herokuapp.com/user?uid=' + uid , requestOptions)
    .then(response => {return response.json();})
    .then(data => {
      let en = data.user.energy;
      //console.log(en);
      setEnergyLocal(en);
      if (membership) {
        setEnergyTotal(2700);
      }
    });
  }, [varNull])

  const addMessages = (newdata: any) =>{
    newdata = sortMessages(newdata,"id")
    let bot_id = 5000 + parseInt(uid)
    console.log("newdata",newdata)
    for(let i = 0; i < newdata.length; i++){
        let newMessage = {
          _id: newdata[i].id,
          text: newdata[i].content,
          createdAt: 0,
          user: {
            _id: newdata[i].user_id,
          },
          tags: newdata[i].tags,
        } as any
        
        if(newdata[i].user_id === bot_id){
          newMessage.user = {
            _id: newdata[i].user_id,
            name: 'React Native',
            avatar: require('../assets/users/robot-babbage.png'),
          }
        }
        console.log(newMessage)
        setMessages(messages => GiftedChat.append(messages, newMessage))
  }
  }

  const sortMessages = (array:any,key:any) =>{
    return array.sort(function(a:any, b:any) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  const onSend = useCallback((newMessage = []) => {
    let message:any = []
    newMessage[0].correction = 0
    newMessage[0].tags = []
    newMessage[0].createdAt = 0
    // setMessages(messages => GiftedChat.append(messages, newMessage)) // a??ade los mensajes del usuario en el chat
    console.log("NewMessage: ",newMessage) // mensaje enviado por usuario, enviar a la API
    console.log("Inicio: ",messages) // mensaje enviado por usuario, enviar a la API
    let usr_msj  = newMessage[0].text
    const requestOptions = { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          msg: usr_msj,
          user_id: parseInt(uid),
          lng: route.params.Lang,
      })
    }
    try { // se envia mensaje a la api
      return fetch('http://gepartner-app.herokuapp.com/api/', requestOptions)
      .then(response => {return response.json();})
      .then(data => {
      console.log("Inter: ",messages) // mensaje enviado por usuario, enviar a la API
      if (data.correction != ""){  // si existe una correcci??n, la ia responde con lo corregido
        newMessage[0].correction = 1;
        setMessageCorrection(data.correction)
        } else if (data.correction == "" && data.msg != ""){
          let bot_id = 5000 + parseInt(uid)
          let bid = data.bid === undefined ? Math.floor(Math.random() * 10000) + 1 : data.bid
          let openai_response = {
            _id: bid,
            text: data.msg,
            createdAt: 0,
            user: {
              _id: bot_id,
              name: 'React Native',
              avatar: require('../assets/users/robot-babbage.png'),
            },
            tags: [],
          } as any
          message.push(openai_response)
        }
      let mid = data.mid === undefined ? Math.floor(Math.random() * 10000) + 1 : data.mid
      newMessage[0]._id = mid
      message.push(newMessage[0])
      console.log("End: ",message); // mensaje enviado por usuario, enviar a la API
      setMessages(messages => GiftedChat.append(messages, message))
      energyFunction()
      });
  
    }

	catch (error){
		console.error(error);
	}

  }, [])

  const energyFunction = () => {
    const requestEnergy = { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
    fetch('http://gepartner-app.herokuapp.com/user?uid=' + uid , requestEnergy)
    .then(response => {return response.json();})
    .then(data => {
      let en = data.user.energy;
      console.log(en);
      setEnergyLocal(en);
    });
  }

  const handlerPress = () => {
    navigation.navigate('FilterTag')
  }
  // React.useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <Icon /*style={{marginRight: '20px'}}*/ onPress={() => {handlerPress()}} name="ellipsis-v" size={30}/>
  //     )
  //   })
  // }, [navigation])


  const renderSend = (props:any) => {
    return (
      <Send {...props}>
        <View style={{ flexDirection:"row" }}> 
          <Ionicons
            name="paper-plane-outline"
            style={{marginBottom: 10, marginRight: 60}}
            size={24}
            color="#616161"
          />
        <TouchableOpacity
        style={styles.containerTranslate}
        onPress={() => translateFunction(props.text)}
      >
        <Text>Traducir</Text>
      </TouchableOpacity>
      { membership && <TouchableOpacity 
      style={styles.containerMic}
      onPress={()=>{setModalAudioVisibility(!modalAudioVisibility)}}>
       <Ionicons
          name="mic"
          size={24}
          color="#616161"
       />
      </TouchableOpacity>}
        </View>
      </Send>
    );
  };
  const corregirMessage = (currentMessage:any) => {
    console.log(currentMessage)
    setinputText(currentMessage.text)
  };

  const feedbackMessage = () => {
    console.log("feedback")
    let newMessage = [{
      	_id: Math.floor(Math.random() * 10000) + 1,
      	text: messageCorrection,
      	createdAt: 0,
      	user: {
      		_id: parseInt(uid),
      	},
        correction: 0,
        tags: [],
    } as any]
    console.log(newMessage)
    onSend(newMessage)
  };

  // Lee el mensaje en la burbuja de texto (onLongPress)


  const renderBubble = (props:any) => {
    // console.log(props)
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#2e64e5',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
      />
    );
  };

  const translateFunction = (message:any) => {
    if(!membership){
      alert("Funcion Premium")
    } else{
      let source;
      let destiny;
      if (route.params.Lang == "english"){
        source = 'en'
        destiny = 'es'
      }
      else{
        source = 'es'
        destiny = 'en'
      }
      const requestTranslate = { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          msg: message,
          src:  source,
          dest: destiny
        })
        }
        try { // Llamada a la api para translate -> http://gepartner-app.herokuapp.com/translation/
        return fetch('http://gepartner-app.herokuapp.com/translation/', requestTranslate)
        .then(response => {return response.json();})
        .then(data => {
          console.log(data)
          //alert("La traducci??n de: \n" + message + "\n\n" + " es: \n" + data.msg)
          alert("La traducci??n de: \n" + message + "\n" + " es: \n" + data.msg)
          });
        }
        catch (error){
          console.error(error);
        }
    }
  }
  

  const onLongPress = (context:any, message:any) => { 
    console.log(message);
    const options = ['Traducir mensaje','Escuchar mensaje', 'A??adir tag','Copiar mensaje', 'Cancelar'];
    const cancelButtonIndex = options.length - 1;
    context.actionSheet().showActionSheetWithOptions({
        options,
        cancelButtonIndex
    }, (buttonIndex:any) => {
        switch (buttonIndex) {
          case 0:
            if(membership == false){
              alert("Funcion Premium")
            } else if(membership == true){
              translateFunction(message.text)
            }
            break;
          case 1:
            if(membership == false){
              alert("Funcion Premium")
            } else if(membership == true){
              setTTS_Text(message.text);
              setModalVisibility(true);
            }
            break;
          case 2:
            navigation.navigate('CreateTag', {currMessage: message})
            break;
          case 3:
            Clipboard.setString(message.text);

        }
    });
  }


  const PlayTTS = () => {
    if (!(Platform.OS === "android")) {
      if (isPaused) {
        setIsPaused(false);
        setPlayIcon("pause");
  
        if (!hasPlayed) {
          Speech.speak(TTS_Text, TTS_params);
        } else {
          Speech.resume();
        }
  
      } else {
        setIsPaused(true);
        setPlayIcon("play");
        Speech.pause();
      }
    } else {
      Speech.stop();
      Speech.speak(TTS_Text, TTS_params);
    }

  }

  const StopTTS = () => {
    Speech.stop();
    setHasPlayed(false);
  }

  const CloseTTS = () => {
    StopTTS();
    setModalVisibility(!modalVisibility);
  }

  const scrollToBottomComponent = () => {
    return(
      <FontAwesome name='angle-double-down' size={22} color='#333' />
    );
  };

  const renderCustomView = (props:any) => {
    console.log(props.currentMessage)
    if(props.currentMessage.correction === 1){
      return (
        <View style={styles.feedback}>
          <Button title={"Corregir"}  onPress={() => corregirMessage(props.currentMessage)}/>
          <Button title={"Feedback"}  onPress={feedbackMessage}/>
        </View>
      )
    }
  };

  // Funciones para el Speech-To-Text

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      }); 
      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }


 async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI(); 
    console.log('Recording stopped and stored at', uri);
    try {
      const response = await FileSystem.uploadAsync(
        FLASK_BACKEND_AUDIO,
        uri
      );
      const body = JSON.parse(response.body);
      console.log(body); //body.ans contiene la respuesta el audio transcrito
      
      if (body.ans == "Could not recognize speech"){
        Alert.alert("Error", "No pudimos escuchar bien tu mensaje de voz! Int??ntalo de nuevo", [
          {text: "Entendido", onPress: () => console.log('alert closed')}
        ]);
      }

      else{
        setinputText(body.ans);
      }
      
      setModalAudioVisibility(!modalAudioVisibility);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No pudimos escuchar bien tu mensaje de voz! Int??ntalo de nuevo", [
        {text: "Entendido", onPress: () => console.log('alert closed')}
      ]);
      setModalAudioVisibility(!modalAudioVisibility);
    } 
    console.log(recording);
  }
   


  const CloseSTT = () => {
    setModalAudioVisibility(!modalAudioVisibility);
  }




  return (
    <View style={{ flex: 1 }}>

      <View style={[styles.row, styles.rowEnergy]}>
        <View style={{marginTop: 15, marginRight: 30, marginLeft: 40, flexGrow:1}}>
          <Text style={{width: "95%", textAlign: "center"}}>Energia restante: {energyLocal}</Text>
          <ProgressBar style={styles.progressBar} progress={energyLocal/energyTotal} color={Colors.red800} />
        </View>
        <Icon style={{marginRight: 30, marginTop: 18}} onPress={() => { handlerPress() }} name="ellipsis-v" size={30} />
      </View>

      {/* Modal utiliza la pantalla entera, por lo que se divide en varias vistas, donde la parte externa es transparente */}
      <Modal
        transparent={true}
        animationType={"slide"}
        visible={modalVisibility}
        onRequestClose={() => { setModalVisibility(!modalVisibility) }} >
        {/* Dise??o del tama??o completo de la pantalla */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          { /* Vista del cuadro interno del Modal */}
          <View style={styles.MenuTTS}>
            
            <IconButton style={{position:'absolute', right:10}} icon="close" onPress={() => { CloseTTS() }} />
          
            <ScrollView style={styles.TextStyle}> 
              <Text style={{fontSize: 18, paddingBottom:5, paddingTop:5, textAlign: 'center',}}> "{TTS_Text}" </Text>
            </ScrollView>

            {/* Rows para colocar botones. */ }
            <View style={[styles.row, styles.rowTTS]}>
              <IconButton style={styles.MenuTTS_button} icon={playIcon} size={ 25 } onPress={() => { PlayTTS() }} />
              <IconButton style={[styles.MenuTTS_button, {marginLeft: 50, marginRight: 20}]} size={ 25 } icon="stop" onPress={() => { StopTTS() }} />
              {/*<IconButton style={styles.MenuTTS_button} icon="umbrella-closed" onPress={() => { setModalVisibility(!modalVisibility) }} />*/}
            </View>           
            { /* Slider de velocidad de lectura TTS*/}
            <View style={styles.SliderContainter}>
              <View style={styles.row}>
                <Text>Velocidad: x{ TTS_Rate }</Text>
                <Slider style={styles.Slider}
                  value={TTS_Rate}
                  onValueChange={setTTS_Rate}
                  maximumValue={2.5}
                  minimumValue={0.5}
                  step={0.25}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>  
  

      {/* Modal del Speech To Text la pantalla entera, por lo que se divide en varias vistas, donde la parte externa es transparente */}
      <Modal
          transparent={true}
          animationType={"slide"}
          visible={modalAudioVisibility}
          onRequestClose={() => { setModalAudioVisibility(!modalAudioVisibility) }} >
          {/* Dise??o del tama??o completo de la pantalla */}
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            { /* Vista del cuadro interno del Modal */}
            <View style={[styles.MenuTTS, {height: 120}]}>
              
              <IconButton style={{position:'absolute', right:10}} icon="close" onPress={() => { CloseSTT() }} />

              {/* Rows para colocar botones. */}
              <View style={{ position:'relative', maxWidth: '80%', top: 40}}>
                  <View>
                    <Button
                      title={recording ? "Deja de grabar" : "Comienza a grabar tu audio"}
                      onPress={recording ? stopRecording : startRecording}
                    />
                  </View> 
                </View>  
            </View>
          </View>
        </Modal>

            
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: parseInt(uid),
        }}
        text = {inputText}
        onInputTextChanged={text => setinputText(text)}
        renderBubble={renderBubble}
        alwaysShowSend
        onLongPress={onLongPress}
        renderSend={renderSend}
        renderCustomView = {renderCustomView}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  feedback: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  progressBar: {
    width: "95%",
    height: 7,
    borderRadius: 5,
    borderColor: "#000000",
    marginTop: 4,
  },

  row: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-start",
    width: "100%",
    justifyContent: 'center'
  },
  rowEnergy:{
    backgroundColor: "#e9e9e9",
    maxHeight: 60
  },
  rowTTS: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: "#f2f2f2",
  },

  MenuTTS:{
    //justifyContent: 'center',
    alignItems: 'center', 
    backgroundColor : "#f2f2f2", 
    //height: "40%",
    //minHeight: 250,
    width: "90%",
    borderRadius:10,
    borderWidth: 2,
    borderColor: '#000000',
    maxHeight: "65%"
  },
  TextStyle: {
    position: 'relative',
    width: "90%",
    marginBottom: 85,
    marginTop: 40,
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderRadius:3,
    borderColor: "gray",
    color: "#000000",
    textAlign: 'center',
    overflow: 'scroll',
    //height: "60%",
    //minHeight: 150
  },
  MenuTTS_button: {
    height: 30,
    width: 30
  },
  SliderContainter: {
    //height: 25,
    position:'absolute',
    bottom: 5,
    width: "100%",
    alignItems: 'center',
    paddingBottom: 10,
    overflow: 'visible'
  },
  Slider: {
    width: "75%",
    maxWidth: 400,
    height: 20,
    alignItems: 'center',
    overflow:'visible'
  },
  container: {
    position: 'absolute',
    right: 10,
    height: 20,
    width: 70,
    flex: 1,  
    backgroundColor: "#DDDDDD",
    alignItems: 'center'
  },
  containerTranslate: {
    position: 'absolute',
    right: 45,
    top: -25,
    height: 20,
    width: 70,
    flex: 1,  
    backgroundColor: "#DDDDDD",
    alignItems: 'center'
  },
  containerMic: {
    position: 'absolute',
    right: -10,
    height: 20,
    width: 70,
    flex: 1,  
    alignItems: 'center'
  }

});