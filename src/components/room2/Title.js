import React from "react";
import styled, { ThemeProvider } from "styled-components/native";
import { theme } from "./theme";

const Container = styled.View`
  padding-top: 16px;
  padding-left: 2px;
`;

const Style = styled.Text`
  font-weight: bold;
  color: ${({ theme }) => theme.title_text};
  font-size: 24px;
`;

const Title = ({ title }) => {
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Style>{title}</Style>
      </Container>
    </ThemeProvider>
  );
};

export default Title;
