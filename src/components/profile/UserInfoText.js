import React from "react";
import styled from "styled-components/native";
import PropTypes from "prop-types";

const Container = styled.View`
  flex-direction: column;
  width: 100%;
  border-color: ${({ theme }) => theme.background};
  padding-right: 20px;
  padding-left: 20px;
`;

const LabelValueContainer = styled.View`
  padding-top: 10px;
  border: none;
  border-width: 0 0 1px;
  border-color: ${({ theme }) => theme.labelGrey};
`;

const InfoText = styled.Text`
  padding: 20px 10px;
  font-size: 16px;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.labelGrey};
  padding-top: 20px;
`;

const NicknameText = styled.Text`
  font-size: 20px;
  text-align: center;
  color: ${({ theme }) => theme.label};
`;
// font-weight: bold;
const UsernameText = styled.Text`
  font-size: 16px;
  text-align: center;
  color: ${({ theme }) => theme.labelLight};
`;

const Label = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.label};
  padding-top: 20px;
`;
// font-weight: 60;
const UserInfoText = ({ label, value, isNickname, isUsername }) => {
  return (
    <Container>
      {isNickname ? (
        <NicknameText>{value}</NicknameText>
      ) : isUsername ? (
        <UsernameText>{value}</UsernameText>
      ) : (
        <LabelValueContainer>
          <Label>{label}</Label>
          <InfoText>{value}</InfoText>
        </LabelValueContainer>
      )}
    </Container>
  );
};

UserInfoText.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  isNickname: PropTypes.bool,
  isUsername: PropTypes.bool,
};
export default UserInfoText;
