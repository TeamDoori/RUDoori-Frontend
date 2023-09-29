import React, { useState, useRef, useEffect, useContext } from "react";

import {
  View,
  StyleSheet,
  Text,
  Button,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { UserContext } from "../../contexts";
import { API_URL } from "@env";

//redux
import { useDispatch, useSelector } from "react-redux";
import { updatePost } from "../../redux/slice/BoardSlice";

const EditmyBoardDetail = ({ navigation, route }) => {
  const [post, setPost] = useState(route.params.post ? route.params.post : {});
  const pageInfo = route.params.pageInfo;

  const [selectedImage, setSelectedImage] = useState(null);
  const [userInput, setUserInput] = useState({
    title: "",
    content: "",
  });
  const accessToken = useSelector((state) => state.user.security.accessToken);

  useEffect(() => {
    // console.log(userInfo);

    setUserInput(() => ({
      title: post.title || "",
      content: post.content || "",
    }));
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.uri);
      }
    } catch (error) {
      console.log("Error while picking an image:", error);
    }
  };

  const dispatch = useDispatch();

  const _handleEditBoardButtonPress = () => {
    const updatePostInput = {
      accessToken,
      userInput,
      postId: post.postId,
      pageInfo,
    };
    dispatch(updatePost({ updatePostInput }));
    navigation.goBack();
    // navigation.navigate("MyboardDetail", {  pageInfo });
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
        {/* <TouchableOpacity onPress={() => navigation.navigate("MainGet")}>
          <Image
            source={{
              uri: "https://img.freepik.com/free-vector/letter-x-dry-brush-stroke-typography-vector_53876-177859.jpg?size=626&ext=jpg",
            }}
            style={styles.image}
          />
        </TouchableOpacity> */}
        <View style={styles.textContainer}>
          <TouchableOpacity onPress={_handleEditBoardButtonPress}>
            <Text style={styles.finButton}>완료</Text>
          </TouchableOpacity>
          <Text style={styles.text}>수정</Text>
        </View>
      </View>
      <TextInput
        placeholder="제목"
        value={userInput.title}
        onChangeText={(value) => _handleUserInputChange("title", value)}
        style={styles.input}
      />

      <TextInput
        placeholder="내용을 입력해주세요."
        value={userInput.content}
        onChangeText={(value) => _handleUserInputChange("content", value)}
        style={styles.input}
      />
      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.image} />
      )}
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>사진</Text>
      </TouchableOpacity>
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

export default EditmyBoardDetail;
