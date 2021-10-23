import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding-top: 10px;
  padding-left: 0px;
  padding-right: 0px;
  background-color: #ffffff;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const Card = styled.TouchableOpacity`
  position: relative;
  width: 800px;
  padding-top: 30px;
  padding-bottom: 30px;
`;

export const CardInformation = styled.TouchableOpacity`
  height: 130px;
  align-items: center;
  justify-content: center;
`;

export const LevelInfo = styled.View`
  position: relative;
  align-items: center;
  justify-content: center;
`;


export const LevelImg = styled.Image`
  position: absolute;
  width: 130px;
  height: 130px;
`;


export const LevelName = styled.Text`
  position: absolute;
  font-size: 35px;
  font-weight: bold;
  bottom: 125px;
`;

/*


export const Card = styled.TouchableOpacity`
  width: 100%;
  height: 150px;
`;

export const LevelInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

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

export const LevelText = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: -10px;
  align-items: center;
`;

export const LevelName = styled.Text`
  font-size: 25px;
  font-weight: bold;
  bottom: 20px;
`;



*/