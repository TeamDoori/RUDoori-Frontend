import React from "react";
import styled from "styled-components/native";
import { theme } from "./theme";

const StyledText = styled.Text`
  font-size: 20px;
  color: black;
  font-weight: bold;
  padding-top: 10px;
`;

const OptionName = ({ text }) => {
  return <StyledText>{text}</StyledText>;
};

export default OptionName;
