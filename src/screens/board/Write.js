import React, { useState, useRef, useEffect, useContext } from "react";

import {
  View,
  StyleSheet,
  Text,
  Button,
  TextInput,
  // Image,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "../../components/auth";
import styled from "styled-components/native";
import { API_URL } from "@env";

//redux
import { useDispatch, useSelector } from "react-redux";
import { writePost } from "../../redux/slice/BoardSlice";

const CenteredView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  margin: 50px;
`;
const DEFAULT_PHOTO =
  "https://firebasestorage.googleapis.com/v0/b/rn-chat-15e2f.appspot.com/o/img.png?alt=media&token=7677bf2d-0a84-4a2f-835b-eacfbca64e4a";

const Write = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [userInput, setUserInput] = useState({
    title: "",
    content: "",
  });
  const accessToken = useSelector((state) => state.user.security.accessToken);
  const userId = useSelector((state) => state.user.userId);

  const [photo, setPhoto] = useState(DEFAULT_PHOTO);

  const dispatch = useDispatch();

  const _handleWritePostButtonPress = () => {
    const formData = new FormData();
    if (photo !== "") {
      formData.append("multipartFile", {
        uri: photo, // 이미지 파일의 경로
        // type: "image/jpeg", // 이미지 타입에 맞게 설정
        name: "image.jpg", // 이미지 파일의 이름
      });
    }
    formData.append("content", userInput.content);
    formData.append("title", userInput.title);

    const writePostInput = {
      accessToken,
      formData,
    };
    dispatch(writePost({ writePostInput }));
    navigation.navigate("MainGet");
  };

  const _handleUserInputChange = (fieldName, value) => {
    // console.log(fieldName + ": " + value);
    setUserInput({
      ...userInput,
      [fieldName]: value,
    });
  };

  return (
    <View>
      <View style={styles.row}>
        <View style={styles.textContainer}>
          <TouchableOpacity onPress={_handleWritePostButtonPress}>
            <Text style={styles.finButton}>완료</Text>
          </TouchableOpacity>
          <Text style={styles.text}>글쓰기</Text>
        </View>
      </View>
      <TextInput
        placeholder="제목"
        onChangeText={(value) => _handleUserInputChange("title", value)}
        style={styles.input}
      />

      <TextInput
        placeholder="내용을 입력해주세요."
        onChangeText={(value) => _handleUserInputChange("content", value)}
        style={styles.input}
      />

      <CenteredView>
        <Image showButton={true} url={photo} onChangePhoto={setPhoto} />
      </CenteredView>
    </View>
  );
};
const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 20,
  },
  finButton: {
    marginLeft: 300,
    fontSize: 16,
    fontWeight: "bold",
    padding: 20,
    backgroundColor: "skyblue",
  },
  container: {
    flex: 1,
  },
  input: {
    margin: 10,
    padding: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginRight: 10,
  },
  textContainer: {
    flexDirection: "column",
  },
  button: {},
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Write;
