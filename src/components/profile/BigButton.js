import React from "react";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import { TouchableOpacity } from "react-native";

const Container = styled.View`
  margin: 10px 10px 20px 10px;
  background-color: ${({ theme }) => theme.white};
  padding: 5px 10px 5px 10px;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  border: 1px;
`;

// opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

const Title = styled.Text`
  font-size: 15px;
  border-color: ${({ theme }) => theme.border};
`;

const BigButton = ({ title, onPress }) => {
  return (
    <Container>
      <TouchableOpacity onPress={onPress}>
        <Title>{title}</Title>
      </TouchableOpacity>
    </Container>
  );
};

BigButton.propTypes = {
  title: PropTypes.string.isRequired,
};
export default BigButton;
