import { FontAwesome, Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Clipboard, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat';
import { Colors, IconButton, ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navigation from '../navigation';

export default function ChatPerScreen({navigation,route}: {navigation:any,route:any}) {
    const [messages, setMessages] = useState([])
    const [isBusy, setBusy] = useState([])
    const [old, setOld] = useState()
    useEffect(()=>{
      fetch('https://gepartner-app.herokuapp.com/caps?data=prompt&gid=' + route.params.idCapsula)
      .then(response => {return response.json();})
      .then(data => {
          setMessages([])
          let content = data.data.prompt.split("Teacher:")
          let sentences = []
          for(let i = 1; i < content.length; i++){
            sentences.push(content[i])
          }
          addMessages(sentences)
      });
    },[old])

    const addMessages = (newdata: any) =>{
      let bot_id = 5 + route.params.cUserId
      console.log(newdata)
      let newMessages:any = []
      for(let i = 0; i < newdata.length; i++){
          let newMessage = {
            _id: i,
            text: newdata[i],
            createdAt: new Date(),
            user: {
              _id: bot_id,
              name: 'React Native',
              avatar: require('../assets/users/robot-babbage.png'),
            },
          } as any
          newMessages.push(newMessage)
        }
        console.log(newMessages)
        setMessages(messages => GiftedChat.append(messages, newMessages))
    }

    const onSend = useCallback((newMessage = []) => {
      // setMessages(messages => GiftedChat.append(messages, newMessage)) // añade los mensajes del usuario en el chat
      console.log("NewMessage: ",newMessage) // mensaje enviado por usuario, enviar a la API
      console.log("Inicio: ",messages) // mensaje enviado por usuario, enviar a la API
      let usr_msj  = newMessage[0].text
      setMessages(messages => GiftedChat.append(messages, newMessage))    
      const requestOptions = { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            msg: usr_msj,
            user_id: parseInt(route.params.cUserId),
            lng: route.params.Lang,
            cid: route.params.idCapsula,
        })
      }
      console.log("request",requestOptions)
      return fetch('http://gepartner-app.herokuapp.com/api/', requestOptions)
      .then(response => {return response.json();})
      .then(data => {
      console.log("Inter: ",messages) // mensaje enviado por usuario, enviar a la API
      console.log("data: ",data) // mensaje enviado por usuario, enviar a la API
      let openai_response:any = {}
      if (data.correction != ""){  // si existe una corrección, la ia responde con lo corregido
        console.log("correction",data.correction)
      } else if (data.correction == "" && data.msg != ""){
          let bot_id = 5 + route.params.cUserId
          let bid = data.bid === undefined ? Math.floor(Math.random() * 10000) + 1 : data.bid
          openai_response = {
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
        }
        setMessages(messages => GiftedChat.append(messages, openai_response))    
        console.log("End: ",messages); // mensaje enviado por usuario, enviar a la API
      });
    }, [])
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
    
    const renderSend = (props:any) => {
        return (
          <Send {...props}>
            <View>
              <Ionicons
                name="paper-plane-outline"
                style={{marginBottom: 10, marginRight: 90}}
                size={24}
                color="#616161"
              />
            <TouchableOpacity
            style={styles.container}
            onPress={() => navigation.navigate("ActivityScreen",{idCapsula: route.params.idCapsula})}
          >
            <Text>Finalizar</Text>
          </TouchableOpacity>
            </View>
          </Send>
        );
    };
    
    const scrollToBottomComponent = () => {
        return(
          <FontAwesome name='angle-double-down' size={22} color='#333' />
        );
    };

    return (
        <View style={{ flex: 1}}>
          <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
            _id: route.params.cUserId,
            }}
            renderBubble={renderBubble}
            alwaysShowSend
            renderSend={renderSend}
            scrollToBottom
            scrollToBottomComponent={scrollToBottomComponent}
            />
        </View>
      );
}

const styles = StyleSheet.create({
 
    row: {
      flex: 1,
      flexDirection: "row",
      alignSelf: "flex-start",
      width: "100%",
      justifyContent: 'center'
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
    }
  
  });