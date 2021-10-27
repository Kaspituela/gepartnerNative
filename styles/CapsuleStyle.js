import styled from 'styled-components/native';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
// Seccion inicial que muestra los 3 niveles de dificultad de las capsulas. 
///////////////////////////////////////////////////

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
  width: 150px;
  padding-top: 30px;
  padding-bottom: 30px;
`;

export const CardInformation = styled.TouchableOpacity`
  height: 150px;
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
  bottom: 140px;
`;


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
//  Flatlist de capsulas dentro del Modal de Capsulas
///////////////////////////////////////////////////

export const CapCard = styled.TouchableOpacity`
  position: relative;
  width: 100%;
`;

export const CapImgWrapper = styled.View`
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 35px;
  `;

export const CapImg = styled.Image`
  position: relative;
  width:  60px;
  height: 60px;
`;

export const CapName = styled.Text`
  position: relative;
  font-size: 20px;
  font-weight: bold;
  left: -25px;
  top: -5px;
`;

export const CapContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  top:-8px;
`;

export const CapText = styled.View`
  flex-direction: column;
  justify-content: center;
  padding-left: 0;
  margin-left: 0px;
  width: 70%;
`;