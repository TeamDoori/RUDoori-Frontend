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
      : date.format("YYYY년 MM월 DD일");
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
            hostUser,
            blockedMember,
            participants,
            category,
          })
        }
      >
        <ItemTextContainer>
          <ItemTitle>{roomName}</ItemTitle>
          <ItemDesc>{introduce}</ItemDesc>
        </ItemTextContainer>

        <ItemHostContainer>
          <ItemImage
            source={{
              uri: `${LOGO}`,
            }}
            style={{ resizeMode: "contain" }}
          />
          <ItemHost>{hostUser.name} 님의 채팅방</ItemHost>
          <ItemCategory>{category}</ItemCategory>
          <ItemTime>{formattedTime}</ItemTime>
        </ItemHostContainer>
      </ItemContainer>
    );
  },
);

const ItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  border: 2px;
  border-color: ${({ theme }) => theme.border};
  border-radius: 15px;
  padding: 15px 20px;
  /* margin-bottom: 50px; */
  margin-top: 10px;
  background-color: white;
  height: 150px;
`;

const ItemTextContainer = styled.View`
  flex: 1;
  /* border: 2px; */
  flex-direction: column;
  /* border-radius: 10px; */
`;

const ItemTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const ItemDesc = styled.Text`
  font-size: 16px;
  margin-top: 5px;
  color: ${({ theme }) => theme.text};
`;

const ItemCategory = styled.Text`
  position: absolute;
  right: 10px;
  bottom: 10px;
  font-size: 15px;
`;
const ItemHostContainer = styled.View`
  position: absolute;
  border: 1px;
  /* background-color: black; */
  width: 45%;
  height: 100%;
  right: 5px;
`;
const ItemHost = styled.Text`
  position: absolute;
  top: 15px;
  right: 5px;
  font-size: 15px;
  color: ${({ theme }) => theme.text};
  font-weight: bold;
`;
const ItemImage = styled.Image`
  /* position: absolute; */
  /* top: 1px; */
  right: 5px;
  height: 40px;
  width: 40px;
  border-radius: 40px;
  border: 1px;
`;
const ItemTime = styled.Text`
  position: absolute;
  font-size: 12px;
  right: 5px;
  top: 0.5;
  color: ${({ theme }) => theme.text};
`;
