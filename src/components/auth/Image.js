import React from "react";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import logo from "../../../assets/images/logo.jpg";

const Container = styled.View`
  margin-bottom: 30px;
`;

const ButtonContainer = styled.TouchableOpacity`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  justify-content: center;
  align-items: center;
`;

const PhotoButton = ({ onPress }) => {
  return (
    <ButtonContainer onPress={onPress}>
      <ButtonIcon />
    </ButtonContainer>
  );
};

const ButtonIcon = styled(MaterialIcons).attrs(({ theme }) => ({
  name: "photo-camera",
  size: 22,
  color: theme.imageButtonIcon,
}))``;

const ProfileImage = styled.Image`
  background-color: ${({ theme }) => theme.imageBackground};
  width: 100px;
  height: 100px;
  border-radius: 50px;
`;

const Image = ({ url, showButton, onChangePhoto }) => {
  const _handlePhotoBtnPress = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      onChangePhoto(result.assets[0].uri);
    }
  };
  return (
    <Container>
      <ProfileImage source={{ uri: url }} />
      {/* <ProfileImage source={require(url)} /> */}
      {showButton && <PhotoButton onPress={_handlePhotoBtnPress} />}
    </Container>
  );
};
// Image.defaultProps = {
//   url: logo,
// };

Image.propTypes = {
  url: PropTypes.string,
  showButton: PropTypes.bool,
  onChangePhoto: PropTypes.func,
};
export default Image;
