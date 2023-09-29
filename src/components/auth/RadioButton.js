import React, { useState } from "react";
import styled from "styled-components/native";

const Button = styled.TouchableOpacity`
  flex: 1;
  height: 40px;
  border: 1px solid ${({ theme }) => theme.border};
  justify-content: center;
  align-items: center;
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.button : theme.background};
  margin: 0 1px;
  border-radius: 20px;
`;

// font-weight: bold;
const RadioLabel = styled.Text`
  font-size: 16px;
  color: ${({ theme, isSelected }) =>
    isSelected ? theme.background : theme.text};
`;

const RadioButton = ({ isSelected, onPress, genderLabel }) => {
  return (
    <Button isSelected={isSelected} onPress={onPress}>
      <RadioLabel isSelected={isSelected}>{genderLabel}</RadioLabel>
    </Button>
  );
};

export default RadioButton;
