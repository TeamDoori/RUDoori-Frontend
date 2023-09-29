import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import { GiftedChat, Send } from "react-native-gifted-chat";
import { MaterialIcons } from "@expo/vector-icons";
import { LOGO, SOCKET_URL, API_URL } from "@env";
import styled, { ThemeContext } from "styled-components/native";
import { Alert, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "../../components/common";
import { PanGestureHandler } from "react-native-gesture-handler";
import {
  getMessages,
  increasePage,
  addMessage,
  setEnter,
  setBlockUsers,
  setExit,
  removeParticipants,
  updateParticipants,
  fixMemeber,
} from "../../redux/slice/chatSlice";

import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import BouncyCheckbox from "react-native-bouncy-checkbox";

const ENTER = "EN";
const SYSTEM = "SY";
const TALK = "TA";
const IMAGE = "IM";
const BLOCK = "BL";
const END = "FI";

//사용자 정보 불러오기?

const Chat = ({ navigation }) => {
  const dispatch = useDispatch();
  const theme = useContext(ThemeContext);

  const page = useSelector((state) => state.chat.totalPage);
  const currentPage = useSelector((state) => state.chat.currentPage);
  const roomInfo = useSelector((state) => state.chat.roomInfo);
  const user = useSelector((state) => state.user);
  const messages = useSelector((state) => state.chat.messages);
  const userId = useSelector((state) => state.user.userId);
  const token = useSelector((state) => state.user.security.accessToken);
  const name = useSelector((state) => state.user.profile.nickname);
  const roomId = roomInfo._id;
  const status = useSelector((state) => state.chat.status);
  const blockedUsers = useSelector(
    (state) => state.chat.roomInfo.blockedMember,
  );

  const isDrawerOpen = useSharedValue(false); // useSharedValue로 상태 관리
  const drawerAnimation = useSharedValue(1);
  const [blockState, setBlockState] = useState(true);
  const [blockList, setBlockList] = useState([]);
  const photo = { LOGO };
  const webSocketURL = `${SOCKET_URL}`;
  const buttonStyle = { fontSize: 14 };
  const ws = new WebSocket(webSocketURL, null, {
    headers: {
      room: roomId,
      user: userId,
    },
  });

  const blockUserHandler = () => {
    dispatch(setBlockUsers(blockList));

    ws.send(
      JSON.stringify({
        type: BLOCK,
        roomId: roomId,
        message: blockList, // 블록된 사용자 정보 전달
      }),
    );
  };
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = drawerAnimation.value;
    },
    onActive: (event, ctx) => {
      const newValue = ctx.startX + event.translationX / 250;
      drawerAnimation.value = newValue < 0 ? 0 : newValue > 1 ? 1 : newValue;
    },
    onEnd: (event) => {
      if (event.translationX < -10) {
        drawerAnimation.value = withTiming(0, { duration: 300 });
        isDrawerOpen.value = false;
      } else if (event.translationX > 10) {
        drawerAnimation.value = withTiming(1, { duration: 300 });
        isDrawerOpen.value = true;
      }
    },
  });

  const drawerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drawerAnimation.value * 250 }], // Drawer가 닫혀있는 상태(0)에서 열린 상태(1)로 이동하면서 오른쪽으로 이동
    };
  });

  console.log(
    "\n\n==================roomInfo====================\n\n",

    user.userId,
    roomInfo,
  );

  const handleCheckboxToggle = (item, isChecked) => {
    if (isChecked) {
      setBlockList([...blockList, item]);
      setBlockState(false);
    } else {
      console.log(blockList);
      setBlockList(
        blockList.filter((i) => {
          return i !== item;
        }),
      );
    }
  };

  useEffect(() => {
    console.log(
      "================blocked USER==========================",
      blockedUsers,
    );
    console.log(
      "================blocked USER==========================",
      blockedUsers.length,
    );
    const list = JSON.stringify(blockedUsers);
    if (blockedUsers.length !== 0) {
      createSystemMessage(ws, BLOCK, list);
    }
  }, [blockedUsers]);

  useEffect(() => {}, [roomInfo.participants]);
  useEffect(() => {
    console.log(status);
    console.log(
      "effect==================================================",
      currentPage,
      page,
    );
    if (!status.isEntered) {
      getChatMessages();
      dispatch(increasePage());
      dispatch(setEnter());
    }
  }, []);

  /**
   * 웹 소켓 연결된
   */
  useEffect(() => {
    // WebSocket 연결
    ws.onopen = () => {
      console.log("WebSocket connected");
      createSystemMessage(ws, ENTER, `${userId} 님이 입장했습니다.`);
    };
    ws.onerror = (error) => {
      console.error("WebSocket error", error);
    };

    ws.onmessage = (event) => {
      // 서버로부터 메시지 수신
      const data = event.data;

      // 메시지 파싱
      const parsedMessage = JSON.parse(data);
      console.log("============메시지 수신=================", parsedMessage);
      /**
       * 차단 메시지
       */
      if (parsedMessage.type == ENTER) {
        console.log("\n\n\nupdateParticipants==========================\n\n\n");
        console.log(parsedMessage.message, "\n\n\n");
        dispatch(updateParticipants(parsedMessage.message));
      } else if (parsedMessage.type == BLOCK) {
        dispatch(setBlockUsers(parsedMessage.message));
        dispatch(removeParticipants(parsedMessage.message));
        if (parsedMessage.message.includes(userId)) {
          ws.close();
          dispatch(setExit());
          navigation.goBack();
          Alert.alert("방에서 쫒겨나게되었습니닼ㅋㅋㅋㅋㅋㅋㅋㅋㅋ");
        }
      } else if (parsedMessage.type == END) {
        console.log(
          "============메시지 수신 -> EndPage =================\n\n",
          parsedMessage,
        );
        navigation.navigate("EndPage");
      } else {
        dispatch(addMessage(parsedMessage));
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };
    return () => {
      // 컴포넌트가 언마운트 될 때 WebSocket 연결 해제
      if (ws) {
        ws.close();
        dispatch(setExit());
      }

      // };
    };
  }, []);

  /**
   * 시스템 메시지 전달 생성,
   */
  /**
     * {
         _id: 1,
          text: 'This is a system message',
          createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
          system: true,
          // Any additional custom parameters are passed through
        }
     */
  const createSystemMessage = (ws, command, text) => {
    const newMessage = systemMessage(text);
    const payload = {
      type: command,
      message: newMessage,
      roomId: roomId,
      command: command,
    };
    if (!ws) {
      console.error("WebSocket is not connected");
      return;
    }
    if (command == "EN" || command == END) {
      ws.send(JSON.stringify(payload));
    }
  };

  const systemMessage = (text) => {
    const newMessage = {
      _id: `${Date.now()}`,
      text: text,
      createdAt: new Date(),
      system: true,
      user: {
        _id: userId,
        name: name,
        avatar: `${LOGO}`,
      },
    };
    return newMessage;
  };

  const createMessage = (text) => {
    const newMessage = {
      _id: `${Date.now()}`,
      text: text,
      createdAt: new Date(),
      user: {
        _id: userId,
        name: name,
        avatar: `${LOGO}`,
      },
    };
    return newMessage;
  };

  /**
   * 메시지 전달
   * @param {} messageList
   * @returns
   */
  const handleMessage = (messageList) => {
    if (!ws) {
      console.error("WebSocket is not connected");
      return;
    }

    const newMessage = createMessage(messageList[0].text);

    const payload = {
      type: TALK,
      message: newMessage,
      roomId: roomId,
    };

    ws.send(JSON.stringify(payload));
  };

  /**
   * GiftedChat의 loadEarlier 이벤트 핸들러
   * 이전 페이지의 채팅 메시지를 불러옴
   */
  const handleLoadEarlier = () => {
    if (currentPage <= page) {
      // 아직 불러올 페이지가 남아있는 경우에만 다음 페이지를 불러옴
      dispatch(increasePage());
      getChatMessages();
    }
  };
  /**
   * 채팅메시지 목록 불러오기
   */
  const getChatMessages = () => {
    dispatch(getMessages({ token, roomId, currentPage }));
  };

  /**
   * 우리끼리 놀기
   */
  const fixMemeberHandler = () => {
    dispatch(fixMemeber({ roomId, token }));
    Alert.alert("이제 새로운 인원을 받을 수 없습니다!");
  };

  /**
   * 채팅방 완전이 종료하기
   */
  const FinishChatHandler = () => {
    Alert.alert("모임을 종료하고, 채팅방을 없애겠습니까?");
    createSystemMessage(ws, END);
    navigation.navigate("EndPage");
  };

  return (
    <DrawerContainer>
      <Container>
        <GiftedChat
          placeholder="Enter a message ..."
          messages={messages}
          user={{ _id: userId, name, avatar: photo }}
          onSend={handleMessage}
          renderSend={(props) => <SendButton {...props} />}
          scrollToBottom={true}
          renderUsernameOnMessage={true}
          alwaysShowSend={true}
          multiline={false}
          onLoadEarlier={handleLoadEarlier}
          loadEarlier={currentPage <= page}
        />
      </Container>
      <PanGestureHandler
        onGestureEvent={gestureHandler}
        minPointers={1}
        maxPointers={1}
        hitSlop={{ left: -50, bottom: -80 }}
      >
        <Animated.View
          style={[
            drawerAnimatedStyle,
            {
              position: "absolute", // 위치를 고정하기 위해 position: absolute 사용
              top: 0, // 오른쪽 상단으로 고정
              right: 0, // 오른쪽 상단으로 고정
              bottom: 80, // 다른 컴포넌트를 덮도록 하기 위해 bottom 값은 0으로 설정
              left: 40, // 다른 컴포넌트를 덮도록 하기 위해 left 값은 0으로 설정
              // flex: 1,
              zIndex: 2,
            },
          ]}
        >
          <Drawer>
            <DrawerItem style={{ marginBottom: 30 }} onPress={() => {}}>
              <Image
                source={{
                  uri: `${LOGO}`,
                }}
                style={{ width: 80, height: 50 }}
              />
              <Title>{roomInfo.roomName}</Title>
              {/* <Title>{roomInfo.roomName}</Title> */}
            </DrawerItem>
            {roomInfo.participants.map((item) => (
              <DrawerItem key={item._id}>
                <Image
                  source={{
                    uri: item.avatar == null ? `${LOGO}` : `${item.avatar}`,
                  }}
                  // style={{ width: 80, height: 50, resizeMode: "contain" }}
                />
                <Text>{item.name}</Text>
                {user.userId == roomInfo.hostUser._id &&
                roomInfo.hostUser._id != item._id ? (
                  <BouncyCheckbox
                    style={{ margin: 10 }}
                    size={25}
                    fillColor="#FF0000"
                    unfillColor="#FFFFFF"
                    iconStyle={{ borderColor: "#FF0000" }}
                    onPress={(isCheck) => {
                      handleCheckboxToggle(item._id, isCheck);
                    }}
                  />
                ) : null}
              </DrawerItem>
            ))}
            <ButtonContainer>
              {roomInfo.hostUser._id == user.userId ? (
                <Button
                  title={"모임 완료하기"}
                  textStyle={buttonStyle}
                  onPress={FinishChatHandler}
                />
              ) : (
                <Button title={"나가기"} textStyle={buttonStyle} />
              )}

              {blockState ? null : (
                <Button
                  title={"차단"}
                  onPress={blockUserHandler}
                  textStyle={buttonStyle}
                />
              )}
              {roomInfo.hostUser._id == user.userId ? (
                roomInfo.complete ? null : (
                  <Button
                    title={"우리끼리 놀기"}
                    textStyle={buttonStyle}
                    onPress={fixMemeberHandler}
                  />
                )
              ) : null}
            </ButtonContainer>
          </Drawer>
        </Animated.View>
      </PanGestureHandler>
    </DrawerContainer>
  );
};

const Container = styled.View`
  flex: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.background};
`;
const SendIcon = styled(MaterialIcons).attrs(({ theme, text }) => ({
  name: "send",
  size: 24,
  color: text ? theme.sendBtnActive : theme.sendBtnInactive,
}))``;

const SendButton = (props) => {
  return (
    <Send
      {...props}
      containerStyle={{
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 4,
      }}
      disabled={!props.text}
    >
      <SendIcon text={props.text} />
    </Send>
  );
};

const Title = styled.Text`
  height: 40px;
  font-size: 13px;
  font-weight: bold;
  /* border: 1px; */
  /* margin-left: 2px; */
  padding: 10px;
`;
const Image = styled.Image`
  /* border: 1px; */
  width: 50px;
  height: 50px;
  /* border-radius: 50px; */
  /* resize: "contain"; */
`;
const DrawerContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #000;
`;

const Drawer = styled(Animated.View)`
  position: absolute;
  top: 0;
  right: 0;
  width: 250px;
  height: 100%;
  background-color: ${({ theme }) => theme.background};
  padding: 20px;
  z-index: 2;
  border: 1px;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
`;

const DrawerItem = styled.View`
  margin-bottom: 10px;
  flex-direction: row;
  padding: 5px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  position: absolute;
  left: 10px;
  bottom: 1px;
`;
const DrawerButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 20px;
  /* top: 50px; */
  right: 20px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
`;
const CheckboxContainer = styled.View`
  width: 24px;
  height: 24px;
  border-width: 2px;
  border-color: #333;
  border-radius: 4px;
  margin-left: auto;
`;
const Checkbox = styled.View`
  width: 100%;
  height: 100%;
  background-color: ${({ checked }) => (checked ? "#333" : "transparent")};
  border-radius: 2px;
`;

export default Chat;
