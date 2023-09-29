import React from "react";
import styled, { ThemeProvider } from "styled-components/native";
import { theme } from "./theme";

const ButtonContainer = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.button_color};
  padding: 5px 5px;
  border-radius: 5px;
  width: 100px;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: black;
  font-size: 20px;
  font-weight: bold;
`;

const SubmitButton = ({ onPress, title }) => {
  return (
    <ThemeProvider theme={theme}>
      <ButtonContainer onPress={onPress}>
        <ButtonText>{title}</ButtonText>
      </ButtonContainer>
    </ThemeProvider>
  );
};

export default SubmitButton;
