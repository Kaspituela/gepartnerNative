import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([])
  }, [])

  const onSend = useCallback((messages = []) => {
	
	setMessages(previousMessages => GiftedChat.append(previousMessages, messages)) // añade los mensajes del usuario en el chat

	console.log("1: ",messages); // mensaje enviado por usuario, enviar a la API

	let usr_msj  = messages[0].text
	const requestOptions = { 
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
				msg: usr_msj,
				uid: 1234,
        lng: global.language
		})
	}
	try { // se envia mensaje a la api
		return fetch('http://gepartner-app.herokuapp.com/api/', requestOptions)
		.then(response => {return response.json();})
		.then(data => {
			console.log(data)
			console.log(messages)
      console.log(global.language)
		let openai_response = {
			_id: Math.floor(Math.random() * 10000) + 1,
			text: data.msg,
			createdAt: new Date(),
			user: {
				_id: 2,
				name: 'React Native',
				avatar: require('../assets/users/robot-babbage.png'),
			},
		} as any
		setMessages(messages => GiftedChat.append(messages,openai_response))

    if (data.correction != ""){ // si existe una corrección, la ia responde con lo corregido
      const string = "La corrección de tu mensaje es: ";
      let correction_openai = string.concat(data.correction);
      let openai_correction = { // acá mensaje con corrección si es necesario
        _id: Math.floor(Math.random() * 10000) + 1,
        text: correction_openai,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: require('../assets/users/robot-babbage.png'),
        },
      } as any
      setMessages(messages => GiftedChat.append(messages,openai_correction))
    }
		});
	}
	
	catch (error){
		console.error(error);
	}

  }, [])

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

  const renderBubble = (props:any) => {
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

  const scrollToBottomComponent = () => {
    return(
      <FontAwesome name='angle-double-down' size={22} color='#333' />
    );
  }


  return (
        <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1,
      }}
      renderBubble={renderBubble}
      alwaysShowSend
      renderSend={renderSend}
      scrollToBottom
      scrollToBottomComponent={scrollToBottomComponent}
    />
  )
}
