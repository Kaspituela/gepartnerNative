import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Clipboard } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ChatScreen({navigation, route}: {navigation: any, route: any}) {
  const [uid,setUid] = useState(1)
  const [inputText,setinputText] = useState("")
  const [messageCorrection, setMessageCorrection] = useState('')
  const [messages, setMessages] = useState([])

  // Parametros para el TTS. De momento están fijos. voy a trabajar en hacerlos customizables  
  var TTS_params = { language: (route.params.Lang == "english") ? "en" : "es", pitch: 1.0, rate: 1 }

  useEffect(() => {
    let lang = route.params.Lang == 'english' ? 0 : 1
    
    const requestOptions = { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
    console.log(requestOptions)
    
    fetch('http://gepartner-app.herokuapp.com/msg?lng=' + lang + '&uid=' + uid + '&bid=5', requestOptions)
		.then(response => {return response.json();})
		.then(data => {
      console.log(data)
      let tam = data.bot.length <= data.user.length ? data.bot.length : data.user.length
      console.log(tam)
      for(let i = 0; i < tam; i++){
        let userMessage = {
          _id: data.user[i].id,
          text: data.user[i].content,
          createdAt: new Date(),
          user: {
            _id: data.user[i].user_id,
          },
        } as any
        console.log(userMessage)
        setMessages(messages => GiftedChat.append(messages, userMessage))
        let botMessage = {
          _id: data.bot[i].id,
          text: data.bot[i].content,
          createdAt: new Date(),
          user: {
            _id: data.bot[i].user_id,
            name: 'React Native',
            avatar: require('../assets/users/robot-babbage.png'),
          },
        } as any
        console.log(botMessage)
        setMessages(messages => GiftedChat.append(messages, botMessage))
      }
      if(tam < data.bot.length){
        for(; tam < data.bot.length; tam++){
          let botMessage = {
            _id: data.bot[tam].id,
            text: data.bot[tam].content,
            createdAt: new Date(),
            user: {
              _id: data.bot[tam].user_id,
              name: 'React Native',
              avatar: require('../assets/users/robot-babbage.png'),
            },
          } as any
          console.log(botMessage)
          setMessages(messages => GiftedChat.append(messages, botMessage))
        }
      } else if (tam < data.user.length){
        for(; tam < data.user.length; tam++){
          let userMessage = {
            _id: data.user[tam].id,
            text: data.user[tam].content,
            createdAt: new Date(),
            user: {
              _id: data.user[tam].user_id,
            },
          } as any
          console.log(userMessage)
          setMessages(messages => GiftedChat.append(messages, userMessage))
        }
      }
    });
  }, [])

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
				user_id: 0,
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
        let openai_response = {
        _id: Math.floor(Math.random() * 10000) + 1,
        text: data.msg,
        createdAt: new Date(),
        user: {
          _id: 5,
          name: 'React Native',
          avatar: require('../assets/users/robot-babbage.png'),
        },
        } as any
        message.push(openai_response)
      }
    message.push(newMessage[0])
    console.log("End: ",message); // mensaje enviado por usuario, enviar a la API
    setMessages(messages => GiftedChat.append(messages, message))
		});

	}
	
	catch (error){
		console.error(error);
	}

  }, [])

  const handlerPress = () => {
    return(
      alert('filtrado listo nos vamos')
    )
  }
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Icon /*style={{marginRight: '20px'}}*/ onPress={() => {handlerPress()}} name="ellipsis-v" size={30}/>
      )
    })
  }, [navigation])

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
  )
};

const styles = StyleSheet.create({
  feedback: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});