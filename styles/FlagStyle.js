import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding-top: 10px;
  padding-left: 0px;
  padding-right: 0px;
  background-color: #ffffff;
`;
// align-items: center;
 

export const FlagImgWrapper = styled.View`
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 25px;
  `;

export const FlagImg = styled.Image`
  width: 50px;
  height: 50px;
`;

export const FlagInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const FlagText = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
  align-items: center;
`;

export const Language = styled.Text`
  font-size: 14px;
  font-weight: bold;
`;

export const Card = styled.TouchableOpacity`
  width: 100%;
`;

export const TextSection = styled.View`
  flex-direction: column;
  justify-content: center;
  padding: 15px;
  padding-left: 0;
  margin-left: 10px;
  width: 300px;
  border-bottom-width: 1px;
  border-bottom-color: #cccccc;
`;