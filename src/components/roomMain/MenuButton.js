import React from "react";
import styled, { ThemeProvider } from "styled-components/native";
import { theme } from "./theme";

const ButtonContainer = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.menu_button_color};
  padding: 5px 5px;
  margin: 10px 10px 10px 10px;
  border-radius: 10px;
  width: 70px;
  height: 90px;
  justify-content: center;
  align-items: center;
  border-width: 2px;
  border-color: black;
`;

const ButtonText = styled.Text`
  color: ${({ theme }) => theme.menu_text_color};
  font-size: 20px;
  font-weight: bold;
`;

const MenuButton = ({ onPress, title }) => {
  return (
    <ThemeProvider theme={theme}>
      <ButtonContainer onPress={onPress}>
        <ButtonText>{title}</ButtonText>
      </ButtonContainer>
    </ThemeProvider>
  );
};

export default MenuButton;
