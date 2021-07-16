import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding-top: 10px;
  padding-left: 30px;
  padding-right: 20px;
  align-items: center;
  background-color: #ffffff;
`;

export const FlagImgWrapper = styled.View`
  padding-top: 15px;
  padding-bottom: 15px;
`;

export const FlagImg = styled.Image`
  width: 60px;
  height: 60px;
`;

export const FlagInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const FlagText = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
`;