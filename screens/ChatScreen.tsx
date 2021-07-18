import React, { useState, useCallback, useEffect } from 'react'
import {ScrollView, Button, StyleSheet,View,Text} from 'react-native';
import {Bubble, GiftedChat, Send} from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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

	console.log("1: ",messages); // mensaje enviado por usuario, enviar a la API

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
		setMessages(messages => GiftedChat.append(messages,openai_response))
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
          <MaterialCommunityIcons
            name="send-circle"
            style={{marginBottom: 5, marginRight: 5}}
            size={32}
            color="#2e64e5"
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
