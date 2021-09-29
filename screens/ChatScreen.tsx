import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Clipboard } from 'react-native'
import { ProgressBar, Colors } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ChatScreen({navigation, route}: {navigation: any, route: any}) {
  let uid = route.params.cUserId
  const [inputText,setinputText] = useState("")
  const [messageCorrection, setMessageCorrection] = useState('')
  const [messages, setMessages] = useState([])
  const [energyLocal, setEnergyLocal] = useState(2700)

  let energyTotal = 2700
  // Parametros para el TTS. De momento están fijos. voy a trabajar en hacerlos customizables  
  var TTS_params = { language: (route.params.Lang == "english") ? "en" : "es", pitch: 1.0, rate: 1 }

  useEffect(() => {
    energyFunction()
    let lang = route.params.Lang == 'english' ? 0 : 1
    
    const requestOptions = { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
    console.log(requestOptions)
    let bot_id = 5 + uid
    fetch('http://gepartner-app.herokuapp.com/msg?lng=' + lang + '&uid=' + uid + '&bid='+bot_id, requestOptions)
		.then(response => {return response.json();})
		.then(data => {
      let newdata = data.user.concat(data.bot);
      addMessages(newdata)
    });
  }, [])

  const addMessages = (newdata: any) =>{
    newdata = sortMessages(newdata,"id")
    let bot_id = 5 + uid
    console.log(newdata)
    for(let i = 0; i < newdata.length; i++){
        let newMessage = {
          _id: newdata[i].id,
          text: newdata[i].content,
          createdAt: new Date(),
          user: {
            _id: newdata[i].user_id,
          },
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
  // setMessages(messages => GiftedChat.append(messages, newMessage)) // añade los mensajes del usuario en el chat
	console.log("NewMessage: ",newMessage) // mensaje enviado por usuario, enviar a la API
  console.log("Inicio: ",messages) // mensaje enviado por usuario, enviar a la API
  let usr_msj  = newMessage[0].text
	const requestOptions = { 
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
				msg: usr_msj,
				user_id: uid,
        lng: route.params.Lang
		})
	}
	try { // se envia mensaje a la api
		return fetch('http://gepartner-app.herokuapp.com/api/', requestOptions)
		.then(response => {return response.json();})
		.then(data => {
    console.log("Inter: ",messages) // mensaje enviado por usuario, enviar a la API
    if (data.correction != ""){  // si existe una corrección, la ia responde con lo corregido
      newMessage[0].correction = 1;
      setMessageCorrection(data.correction)
      } else if (data.correction == "" && data.msg != ""){
        let bot_id = 5 + uid
        let openai_response = {
        _id: Math.floor(Math.random() * 10000) + 1,
        text: data.msg,
        createdAt: new Date(),
        user: {
          _id: bot_id,
          name: 'React Native',
          avatar: require('../assets/users/robot-babbage.png'),
        },
        } as any
        message.push(openai_response)
      }
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
      let en = data.user.energy
      console.log(en)
      setEnergyLocal(en)

    });
  }

  const handlerPress = () => {
    return(
      alert('filtrado listo nos vamos')
    )
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
        <View>
          <Ionicons
            name="paper-plane-outline"
            style={{marginBottom: 10, marginRight: 10}}
            size={24}
            color="#616161"
          />
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
      	createdAt: new Date(),
      	user: {
      		_id: uid,
      	},
        correction: 0,
    } as any]
    console.log(newMessage)
    onSend(newMessage)
  };

  // Lee el mensaje en la burbuja de texto (onLongPress)
  const TTS_message = (messageToRead: any) => {

    //console.log(messageToRead)
    console.log(TTS_params)
    Speech.speak(messageToRead, TTS_params);
  };

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
    const requestTranslate = { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        msg: message,
        src: 'en',
        dest: 'es'
      })
      }
      try { // Llamada a la api para translate -> http://gepartner-app.herokuapp.com/translation/
      return fetch('http://gepartner-app.herokuapp.com/translation/', requestTranslate)
      .then(response => {return response.json();})
      .then(data => {
        console.log(data)
        alert("La traducción de: " + message + " es " + data.msg)
        });
      }
      catch (error){
        console.error(error);
      }
    }
  

  const onLongPress = (context:any, message:any) => { 
    console.log(message);
    const options = ['Traducir mensaje','Escuchar mensaje', 'Añadir tag','Copiar mensaje', 'Cancelar'];
    const cancelButtonIndex = options.length - 1;
    context.actionSheet().showActionSheetWithOptions({
        options,
        cancelButtonIndex
    }, (buttonIndex:any) => {
        switch (buttonIndex) {
            case 0:
				        translateFunction(message.text)
              	break;
            case 1:
                TTS_message(message.text)
                break;
            case 2:
                navigation.navigate('CreateTag')
                break;
            case 3:
                Clipboard.setString(message.text);

        }
    });
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


  return (
    <View style={{flex: 1, paddingRight: 20}}>
      <View style={{paddingRight: 10, width: "150px"}}>
        <Text style={{textAlign: "center"}}>Energia {energyLocal.toString()}</Text>
        <ProgressBar progress={energyLocal/energyTotal} color={Colors.red800} />
      </View>
      <Icon /*style={{marginRight: '20px'}}*/ onPress={() => {handlerPress()}} name="ellipsis-v" size={30}/>
        <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: uid,
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
  }
});