import React from "react";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import { MaterialIcons } from "@expo/vector-icons";

const ItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 15px 20px;
`;

const ItemTextContainer = styled.View`
  flex: 1;
  flex-direction: column;
`;
const ItemTitle = styled.Text`
  font-size: 20px;
  color: ${({ theme }) => theme.listDescription};
`;
// font-weight: 600;
const ItemDesc = styled.Text`
  font-size: 16px;
  margin-top: 5px;
  color: ${({ theme }) => theme.listDescription};
`;
const ItemContent = styled.Text`
  font-size: 12px;
`;

const Scrap = ({ content, createdDt, postId, title, writer }) => {
  return (
    <ItemContainer>
      <ItemTextContainer>
        <ItemTitle>{title}</ItemTitle>
        <ItemDesc>{writer}</ItemDesc>
        <ItemDesc>게시일: {createdDt}</ItemDesc>
        <ItemContent>{content}</ItemContent>
      </ItemTextContainer>
    </ItemContainer>
  );
};

Scrap.propTypes = {
  content: PropTypes.string.isRequired,
  createdDt: PropTypes.string.isRequired,
  postId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  writer: PropTypes.string.isRequired,
};

export default Scrap;
