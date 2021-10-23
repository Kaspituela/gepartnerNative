import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding-top: 10px;
  padding-left: 0px;
  padding-right: 0px;
  background-color: #ffffff;
`;
// align-items: center;
 

export const LevelWrapper = styled.View`
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 25px;
  `;

export const LevelImg = styled.Image`
    position: relative;
    width: 80px;
    height: 80px;
`;

export const LevelInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const LevelText = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
  align-items: center;
`;

export const LevelName = styled.Text`
  font-size: 14px;
  font-weight: bold;
`;

export const Card = styled.TouchableOpacity`
  width: 100%;
  height: 150px;
`;

export const TextSection = styled.View`
  position: relative;
  flex-direction: column;
  justify-content: center;
  padding: 15px;
  padding-left: 0;
  top: -120px;
  margin-left: 110px;
  width: 300px;
  border-bottom-width: 1px;
  border-bottom-color: #cccccc;
`;