import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";
import { LOGO } from "@env";
import moment from "moment";

/**
 * {"_id": "13bfc100-6ae1-463f-a87c-0f0a878aa892",
 * "blockedMember": [],
 * "createdAt": "2023-08-04T23:00:17.823",
 * "full": false,
 * "introduce": "test1",
 * "maxParticipants": 2,
 * "participants": ["201415555"],
 * "roomName": "Test1"}
 */
// 목록 불러오기
export const Item = React.memo(
  ({
    item: {
      _id,
      roomName,
      introduce,
      createdAt,
      maxParticipants,
      hostUser,
      full,
      used,
      complete,
      blockedMember,
      participants,
      category,
    },
    onPress,
  }) => {
    const now = moment();
    const date = moment(createdAt);
    const formattedTime = now.isSame(date, "day")
      ? date.format("HH:mm")
      : date.format("YY년 MM월 DD일");
    return (
      <ItemContainer
        onPress={() =>
          onPress({
            _id,
            roomName,
            introduce,
            createdAt,
            maxParticipants,
            full,
            used,
            complete,
            hostUser,
            blockedMember,
            participants,
            category,
          })
        }
      >
        <ItemImage
          source={{
            uri: `${LOGO}`,
          }}
          style={{ resizeMode: "contain" }}
        />

        <ItemTitle>{roomName}</ItemTitle>
        <ItemDesc>{introduce}</ItemDesc>

        <ItemHost>{hostUser.name} 님의 채팅방</ItemHost>
        <ItemCategory>{category}</ItemCategory>
        <ItemTime>{formattedTime}</ItemTime>
      </ItemContainer>
    );
  },
);

const ItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  /* border: 2px; */
  /* border-color: ${({ theme }) => theme.border}; */
  border-radius: 15px;
  padding: 15px 20px;
  /* margin-bottom: 50px; */
  margin-top: 40px;
  background-color: white;
  height: 150px;
`;

const ItemTextContainer = styled.View`
  flex: 1;
  position: absolute;
  /* bottom: 50px; */
  /* border: 1px; */
  /* flex-direction: row; */
  /* border-radius: 10px; */
`;

const ItemTitle = styled.Text`
  position: absolute;
  top: 55px;
  left: 10px;
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

const ItemDesc = styled.Text`
  position: absolute;
  top: 80px;
  left: 10px;
  font-size: 14px;
  margin-top: 5px;
  color: ${({ theme }) => theme.text};
`;

const ItemCategory = styled.Text`
  position: absolute;
  right: 10px;
  bottom: 10px;
  font-size: 15px;
`;

const ItemHost = styled.Text`
  position: absolute;
  top: 15px;
  right: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.text};
  font-weight: bold;
`;
const ItemImage = styled.Image`
  position: absolute;
  /* top: 1px; */
  right: 45%;
  bottom: 100px;
  height: 80px;
  width: 80px;
  border-radius: 40px;
  border: 1px;
`;
const ItemTime = styled.Text`
  position: absolute;
  font-size: 12px;
  right: 8px;
  top: 0.5;
  color: ${({ theme }) => theme.text};
`;
