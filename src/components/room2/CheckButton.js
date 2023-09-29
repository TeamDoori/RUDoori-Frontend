import React, { useState } from "react";
import { TouchableOpacity, Text } from "react-native";
import styled, { ThemeProvider } from "styled-components/native";
import { theme } from "./theme";

const Container = styled.View`
  padding-left: 2px;
  padding-right: 2px;
  padding-top: 8px;
  margin: 2px 2px 2px 2px;
`;

const Button = styled(TouchableOpacity)`
  background-color: ${({ theme, isChecked }) =>
    isChecked ? theme.checkedColor : theme.uncheckedColor};
  width: 100px;
  height: 50px;
  border-radius: 30px;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled(Text)`
  color: black;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
`;

const CheckButton = ({ text, onPress }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handlePress = () => {
    setIsChecked(!isChecked);
    onPress();
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Button isChecked={isChecked} onPress={handlePress}>
          <ButtonText>{text}</ButtonText>
        </Button>
      </Container>
    </ThemeProvider>
  );
};

export default CheckButton;
