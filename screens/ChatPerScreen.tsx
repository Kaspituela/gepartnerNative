import { FontAwesome, Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Clipboard, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat';
import { Colors, IconButton, ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navigation from '../navigation';

export default function ChatPerScreen({navigation,route}: {navigation:any,route:any}) {
    const [messages, setMessages] = useState([])

    const onSend = useCallback((newMessage = []) => {
        setMessages(messages => GiftedChat.append(messages, newMessage))    
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
            _id: route.params.cuserId,
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