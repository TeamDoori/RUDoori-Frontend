import React from "react";
import styled from "styled-components/native";
import PropTypes from "prop-types";

const Container = styled.View`
  /* border: 1px; */
  padding-top: 30px;
  padding-bottom: 30px;
  align-items: center;
  /* flex-direction: row; */
  background: ${({ theme }) => theme.backgroundSkyblue};
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;
const ScoreContainer = styled.View`
  /* width: 140px; */
  height: 140px;
  border: 3px;
  border-radius: 20px;
  align-items: center;
  flex-direction: row;
  background: ${({ theme }) => theme.background};
  padding: 20px;
`;
const ScoreText = styled.Text`
  font-size: 80px;
  font-weight: 600;
`;
const PointText = styled.Text`
  margin-top: 40px;
  font-size: 20px;
`;
const Label = styled.Text`
  position: absolute;
  bottom: 2px;
  left: 8px;
  font-size: 12px;
  margin-top: 30px;
  margin-right: 100px;
  color: ${({ theme }) => theme.whiteText};
`;

const UserScoreText = ({ score, point }) => {
  // console.log(score);
  return (
    <Container>
      <ScoreContainer>
        <ScoreText>{score}</ScoreText>
        <PointText>({point}점)</PointText>
      </ScoreContainer>
      <Label>두리들이 남겨준 의견이에용</Label>
    </Container>
  );
};

UserScoreText.propTypes = {
  score: PropTypes.string,
  point: PropTypes.number,
};
export default UserScoreText;
