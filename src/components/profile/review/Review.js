import React from "react";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import { MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
const ItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-left: 10px;
  padding-right: 5px;
  border: 1px;
  border-radius: 20px;
  margin-top: 5px;
  height: 80px;
  flex: 1;
  margin-left: 2px;
  margin-right: 2px;
  background-color: ${({ theme }) => theme.background};
`;

const ItemTextContainer = styled.View`
  flex: 1;
  height: 100%;
  flex-direction: row;
  /* border: 1px; */
`;
const ItemTitle = styled.Text`
  font-size: 20px;
  color: ${({ theme }) => theme.listDescription};
`;
// font-weight: 600;
const ItemDesc = styled.Text`
  font-size: 13px;
  margin-top: 5px;
  color: ${({ theme }) => theme.listDescription};
`;

const ItemCreated = styled.Text`
  position: absolute;
  right: 1px;
  font-size: 11px;
  margin-top: 5px;
  color: ${({ theme }) => theme.listDescription};
`;
const ItemContent = styled.Text`
  font-size: 15px;
  flex-wrap: 1;
`;
const ItemScore = styled.Text`
  margin-top: 5%;
  margin-bottom: 5%;
  font-size: 24px;
  /* width: 50px;
  height: 50px; */
  /* border: 1px; */
  padding: 2px;
`;
const ItemUser = styled.Text`
  font-size: 9px;
`;
const ItemRoom = styled.Text`
  font-size: 12px;
  position: absolute;
  right: 1px;
  margin-top: 20px;
  color: ${({ theme }) => theme.listDescription};
`;

const ScoreContainer = styled.View``;
const UserContainer = styled.View`
  margin-top: 30px;
  position: absolute;
  right: 1px;
`;
const ContentContainer = styled.View`
  contain: content;
  /* border: 1px; */
  /* flex: 1; */
  width: 60%;
  margin-right: 1px;
  padding: 10px;
`;
// mentionUserId
const Review = ({
  review: {
    mentionUserNickname,
    content,
    mentionUserId,
    createdDt,
    roomName,
    score,
  },
}) => {
  const now = moment();
  const date = moment(createdDt);
  const formattedTime = now.isSame(date, "day")
    ? date.format("HH:mm")
    : date.format("YY년 MM월 DD일");
  const userId = mentionUserId.substring(0, 6) + "XX";

  return (
    <ItemContainer>
      <ItemTextContainer>
        <ScoreContainer>
          <ItemScore>{score}점</ItemScore>
        </ScoreContainer>

        <ContentContainer>
          <ItemContent>{content}</ItemContent>
        </ContentContainer>
        <ItemCreated>{formattedTime}</ItemCreated>
        <ItemRoom>모임 : {roomName}</ItemRoom>
        <UserContainer>
          <ItemDesc>{mentionUserNickname}</ItemDesc>
          <ItemUser>{userId}</ItemUser>
        </UserContainer>
      </ItemTextContainer>
    </ItemContainer>
  );
};
// const Review = ({ review: { opponentNickname, content, opponentId } }) => {
//   return (
//     <ItemContainer>
//       <ItemTextContainer>
//         <ItemDesc>{opponentNickname}</ItemDesc>
//         <ItemDesc>(학번: {opponentId})</ItemDesc>
//         <ItemContent>{content}</ItemContent>
//       </ItemTextContainer>
//     </ItemContainer>
//   );
// };
export default Review;
