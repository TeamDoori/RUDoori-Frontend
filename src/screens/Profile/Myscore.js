import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components/native";
// import score1 from "./data/score1.json";
import { SafeAreaView, FlatList, Platform } from "react-native";
import { Review, UserScoreText } from "../../components/profile/review";
// import { UserContext } from "../../contexts";
import { API_URL } from "@env";
import { useSelector } from "react-redux";

const Container = styled.View`
  flex: 1;
`;

const Myscore = () => {
  const [reviewList, setReviewList] = useState([]);

  const [score, setScore] = useState("");
  const [point, setPoint] = useState(0.0);
  const userId = useSelector((state) => state.user.userId);
  const accessToken = useSelector((state) => state.user.security.accessToken);

  useEffect(() => {
    // fetch(`http://172.20.10.7:8020/user/info/score?userId=${userId}`, {
    fetch(`${API_URL}/user/info/score?userId=${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(
          "\n\n==================score=====================\n\n",
          res.data,
        );
        setReviewList(res.data.mentions);
        setScore(res.data.score);
        setPoint(res.data.point);
      });
  }, [accessToken, userId]);

  return (
    // <SafeAreaView>
    <Container>
      <UserScoreText score={score} point={point} />

      <FlatList
        data={reviewList}
        renderItem={({ item }) => <Review review={item} />}
        keyExtractor={(item) => item["mentionId"].toString()}
        windowSize={5}
      />
    </Container>
    // </SafeAreaView>
  );
};

export default Myscore;
