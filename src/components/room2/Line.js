import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";

const Straight = styled.View`
  width: 100%;
  height: 1px;
  background-color: black;
  /* margin-vertical: 2px; */
`;

const Line = () => {
  return (
    <View>
      <Straight />
    </View>
  );
};

export default Line;
