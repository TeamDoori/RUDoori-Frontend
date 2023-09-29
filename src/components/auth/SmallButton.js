import React from "react";
import styled from "styled-components/native";
import PropTypes from "prop-types";
// import { TouchableOpacity } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";

const Container = styled.View`
  background-color: ${({ theme }) => theme.smallbutton};
  justify-content: center;
  border-radius: 4px;
`;

// opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

const Title = styled.Text`
  font-size: 16px;
`;

const SmallButton = ({ title, onPress }) => {
  return (
    <Container>
      <TouchableOpacity onPress={onPress}>
        <Title>{title}</Title>
      </TouchableOpacity>
    </Container>
  );
};

SmallButton.propTypes = {
  title: PropTypes.string.isRequired,
  // onPress: PropTypes.func.isRequired,
  // containerStyle: PropTypes.object,
  // textStyle: PropTypes.object,
  // //   isFilled: PropTypes.bool,
  // disabled: PropTypes.bool,
};
export default SmallButton;
