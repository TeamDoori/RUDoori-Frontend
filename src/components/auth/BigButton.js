import React, { useContext } from "react";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import { TouchableOpacity } from "react-native";

const Container = styled.View`
  background-color: ${({ theme }) => theme.bigbutton};
  width: 100%;
  margin: 10px 0;
  padding: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 4px;

  border-width: 1px;
  border-color: ${({ theme }) => theme.border};
`;

// opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

// font-weight: bold;
const Title = styled.Text`
  font-size: 20px;
  color: ${({ theme }) => theme.white};
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
  // onPress: PropTypes.func.isRequired,
  // containerStyle: PropTypes.object,
  // textStyle: PropTypes.object,
  // //   isFilled: PropTypes.bool,
  // disabled: PropTypes.bool,
};
export default BigButton;
