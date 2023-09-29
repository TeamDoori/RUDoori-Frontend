import React from "react";
import styled from "styled-components/native";
import PropTypes from "prop-types";

const Container = styled.View`
  margin: 30px 0px 10px 0px;
  align-items: center;
`;

const ProfileImage = styled.Image`
  background-color: ${({ theme }) => theme.imageBackground};
  width: 100px;
  height: 100px;
  border-radius: 50px;
`;

const UserImage = ({ url }) => {
  if (!url) {
    return null; // 이미지 URL이 없으면 아무것도 렌더링하지 않음
  }

  return (
    <Container>
      <ProfileImage source={{ uri: url }} />
    </Container>
  );
};

UserImage.propTypes = {
  url: PropTypes.string,
};
export default UserImage;
