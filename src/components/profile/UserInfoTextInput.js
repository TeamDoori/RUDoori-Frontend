import React, { forwardRef } from "react";
import styled from "styled-components/native";
import PropTypes from "prop-types";

const Container = styled.View`
  flex-direction: column;
  width: 100%;
  margin: 10px 0;
`;

const StyledInput = styled.TextInput`
  padding: 20px 10px;
  font-size: 16px;
  border: none;
  border-width: 0 0 1px;
  border-color: ${({ theme }) => theme.labelGrey};
`;

const Label = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.label};
`;
// font-weight: 60;
const UserInfoTextInput = forwardRef(
  (
    {
      onSubmitEditing,
      returnKeyType,
      placeholder,
      label,
      numericOnly,
      maxLength,
      value,
      onChangeText,
    },
    ref,
  ) => {
    return (
      <Container>
        <Label>{label}</Label>
        <StyledInput
          onSubmitEditing={onSubmitEditing}
          ref={ref}
          placeholder={placeholder}
          returnKeyType={returnKeyType}
          maxLength={maxLength}
          keyboardType={numericOnly ? "numeric" : "default"}
          onChangeText={onChangeText}
        >
          {value}
        </StyledInput>
      </Container>
    );
  },
);

UserInfoTextInput.propTypes = {
  onSubmitEditing: PropTypes.func,
  returnKeyType: PropTypes.oneOf(["done", "next"]),
  numericOnly: PropTypes.bool,
};

export default UserInfoTextInput;
