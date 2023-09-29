import React, { useContext } from "react";
import styled from "styled-components/native";
import Button from "./Button";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemeContext } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";

const Float = styled.View`
  width: 70px;
  height: 70px;
  position: absolute;
  background-color: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.button};
  border-radius: 50px;
  bottom: 20px;
  right: 20px;
  align-items: center;
  justify-content: center;
  align-items: center;
`;
const IconWrapper = styled.View`
  position: absolute;
`;
const FloatButton = ({ route }) => {
  const theme = useContext(ThemeContext);
  const navigator = useNavigation();
  return (
    <Float>
      <IconWrapper>
        <MaterialCommunityIcons
          name="plus" // 원하는 아이콘의 이름을 지정합니다 (MaterialCommunityIcons 라이브러리 사용)
          size={45} // 아이콘 크기를 조정합니다
          color={theme.button} // 아이콘의 색상을 지정합니다
        />
      </IconWrapper>
      <Button
        onPress={() => {
          navigator.navigate(route);
        }}
        containerStyle={{ border: "1px" }}
        hitSlop={{ top: 70, bottom: 70, left: 70, right: 70 }}
      />
    </Float>
  );
};

export default FloatButton;
