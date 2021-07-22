import * as React from 'react';
import { FlatList, StyleSheet } from 'react-native';

import {
  Card,
  Container,
  MessageText,
  PostTime,
  TextSection,
  UserImg,
  UserImgWrapper,
  UserInfo,
  UserInfoText,
  UserName,
} from '../styles/MessageStyle';

const Messages = [
    {
      id: '1',
      userName: 'Babbage',
      userImg: require('../assets/users/robot-babbage.png'),
      messageTime: '4 mins ago',
      messageText:
        'Chatea con Babbage!.',
    },
  ];

export default function MessageScreen({navigation}: {navigation: any}) {
  return (
    <Container>
      <FlatList 
        data={Messages}
        keyExtractor={item=>item.id}
        renderItem={({item}) => (
          <Card onPress={() => navigation.navigate('Chat', {userName: item.userName})}>
            <UserInfo>
              <UserImgWrapper>
                <UserImg source={item.userImg} />
              </UserImgWrapper>
              <TextSection>
                <UserInfoText>
                  <UserName>{item.userName}</UserName>
                  <PostTime>{item.messageTime}</PostTime>
                </UserInfoText>
                <MessageText>{item.messageText}</MessageText>
              </TextSection>
            </UserInfo>
          </Card>
        )}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
