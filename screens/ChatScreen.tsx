import React, { useState, useCallback, useEffect } from 'react'
import { StyleSheet } from 'react-native';
import {Bubble, GiftedChat, Send} from 'react-native-gifted-chat';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ])
  }, [])

  const onSend = useCallback((messages = []) => {
	
	setMessages(previousMessages => GiftedChat.append(previousMessages, messages)) // añade los mensajes del usuario en el chat

	console.log(messages[0].text); // mensaje enviado por usuario, enviar a la API

	let usr_msj  = messages[0].text
	const requestOptions = { 
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
				msg: usr_msj,
				uid: 1234
		})
	}
	try { // se envia mensaje a la api
		return fetch('http://gepartner-app.herokuapp.com/api/', requestOptions)
		.then(response => {return response.json();})
		.then(data => {
			console.log(data)
			console.log(messages)

		let openai_response = {
			_id: Math.floor(Math.random() * 10000) + 1,
			text: data.msg,
			createdAt: new Date(),
			user: {
				_id: 2,
				name: 'React Native',
				avatar: 'https://placeimg.com/140/140/any',
			},
		} as any
		
		setMessages(messages => GiftedChat.append(openai_response, messages))
		});
	}
	
	catch (error){
		console.error(error);
	}

  }, [])


  return (
        <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  )
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   separator: {
//     marginVertical: 30,
//     height: 1,
//     width: '80%',
//   },
// });
