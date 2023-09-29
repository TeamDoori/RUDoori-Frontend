import React from "react";
import styled, { ThemeProvider } from "styled-components/native";
import { theme } from "./theme";

const ButtonContainer = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.category_button_color};
  padding: 5px 5px;
  margin: 10px 10px 10px 10px;
  border-radius: 50px;
  width: 120px;
  height: 100px;
  justify-content: center;
  align-items: center;
  border-width: 2px;
  border-color: black;
`;

const ButtonText = styled.Text`
  color: ${({ theme }) => theme.category_text_color};
  font-size: 23px;
  font-weight: bold;
`;

const CategoryButton = ({ onPress, title }) => {
  return (
    <ThemeProvider theme={theme}>
      <ButtonContainer onPress={onPress}>
        <ButtonText>{title}</ButtonText>
      </ButtonContainer>
    </ThemeProvider>
  );
};

export default CategoryButton;
