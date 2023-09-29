// import React, { useState, useRef, useEffect, useContext } from "react";
// import { Chat, Side } from "../screens/chat";
// import styled, { ThemeContext } from "styled-components/native";
// import { Text } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import { LOGO } from "@env";
// import { Button } from "../components/common";
// import { PanGestureHandler } from "react-native-gesture-handler";
// import Animated, {
//   useAnimatedGestureHandler,
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
// } from "react-native-reanimated";
// import { setBlockUsers } from "../redux/slice/chatSlice";
// import BouncyCheckbox from "react-native-bouncy-checkbox";

// const ChatDraw = () => {
//   const dispatch = useDispatch();
//   const theme = useContext(ThemeContext);
//   const roomInfo = useSelector((state) => state.chat.roomInfo);
//   const user = useSelector((state) => state.user);
//   const isDrawerOpen = useSharedValue(false); // useSharedValue로 상태 관리
//   const drawerAnimation = useSharedValue(1);
//   const [blockState, setBlockState] = useState(false);
//   const [blockList, setBlockList] = useState([]);

//   console.log(
//     "==================roomInfo from chatDraw====================",
//     roomInfo,
//     user.userId,
//   );
//   useEffect(() => {
//     if (blockList.length == 0) {
//       setBlockState(true);
//     }
//   }, [blockList]);

//   const handleCheckboxToggle = (item, isChecked) => {
//     if (isChecked) {
//       setBlockList([...blockList, item]);
//       setBlockState(false);
//     } else {
//       setBlockList(
//         blockList.filter((i) => {
//           return i !== item;
//         }),
//       );
//     }
//   };

//   const blockUserHandler = () => {
//     dispatch(setBlockUsers(blockList));
//   };
//   const gestureHandler = useAnimatedGestureHandler({
//     onStart: (_, ctx) => {
//       ctx.startX = drawerAnimation.value;
//     },
//     onActive: (event, ctx) => {
//       const newValue = ctx.startX + event.translationX / 250;
//       drawerAnimation.value = newValue < 0 ? 0 : newValue > 1 ? 1 : newValue;
//     },
//     onEnd: (event) => {
//       if (event.translationX < -10) {
//         drawerAnimation.value = withTiming(0, { duration: 300 });
//         isDrawerOpen.value = false;
//       } else if (event.translationX > 10) {
//         drawerAnimation.value = withTiming(1, { duration: 300 });
//         isDrawerOpen.value = true;
//       }
//     },
//   });

//   const drawerAnimatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [{ translateX: drawerAnimation.value * 250 }], // Drawer가 닫혀있는 상태(0)에서 열린 상태(1)로 이동하면서 오른쪽으로 이동
//     };
//   });

//   return (
//     <Container>
//       <Chat />
//       <PanGestureHandler
//         onGestureEvent={gestureHandler}
//         minPointers={1}
//         maxPointers={1}
//         hitSlop={{ left: -50, bottom: -80 }}
//       >
//         <Animated.View
//           style={[
//             drawerAnimatedStyle,
//             {
//               position: "absolute", // 위치를 고정하기 위해 position: absolute 사용
//               top: 0, // 오른쪽 상단으로 고정
//               right: 0, // 오른쪽 상단으로 고정
//               bottom: 80, // 다른 컴포넌트를 덮도록 하기 위해 bottom 값은 0으로 설정
//               left: 80, // 다른 컴포넌트를 덮도록 하기 위해 left 값은 0으로 설정
//               // flex: 1,
//               zIndex: 2,
//             },
//           ]}
//         >
//           <Drawer>
//             <DrawerItem style={{ marginBottom: 30 }} onPress={() => {}}>
//               <Image
//                 source={{
//                   uri: `${LOGO}`,
//                 }}
//                 style={{ width: 80, height: 50 }}
//               />
//               <Title>염병 좆같은 시발</Title>
//               {/* <Title>{roomInfo.roomName}</Title> */}
//             </DrawerItem>
//             {roomInfo.participants.map((item) => (
//               <DrawerItem key={item._id}>
//                 <Image
//                   source={{
//                     uri: item.avatar == null ? `${LOGO}` : `${item.avatar}`,
//                   }}
//                   // style={{ width: 80, height: 50, resizeMode: "contain" }}
//                 />
//                 <Text>{item.name}</Text>
//                 {user.userId == roomInfo.hostUser ? (
//                   <BouncyCheckbox
//                     style={{ margin: 10 }}
//                     size={25}
//                     fillColor="#FF0000"
//                     unfillColor="#FFFFFF"
//                     iconStyle={{ borderColor: "#FF0000" }}
//                     onPress={(isCheck) => {
//                       handleCheckboxToggle(item._id, isCheck);
//                     }}
//                   />
//                 ) : null}
//               </DrawerItem>
//             ))}
//             <ButtonContainer>
//               <Button title={"exit"} />
//               {blockState ? null : (
//                 <Button title={"block"} onPress={blockUserHandler} />
//               )}
//             </ButtonContainer>
//           </Drawer>
//         </Animated.View>
//       </PanGestureHandler>
//     </Container>
//   );
// };

// const Title = styled.Text`
//   height: 40px;
//   font-size: 13px;
//   font-weight: bold;
//   /* border: 1px; */
//   /* margin-left: 2px; */
//   padding: 10px;
// `;
// const Image = styled.Image`
//   /* border: 1px; */
//   width: 50px;
//   height: 50px;
//   /* border-radius: 50px; */
//   /* resize: "contain"; */
// `;
// const Container = styled.View`
//   flex: 1;
//   justify-content: center;
//   align-items: center;
//   background-color: #000;
// `;

// const Drawer = styled(Animated.View)`
//   position: absolute;
//   top: 0;
//   right: 0;
//   width: 250px;
//   height: 100%;
//   background-color: ${({ theme }) => theme.background};
//   padding: 20px;
//   z-index: 2;
//   border: 1px;
//   border-top-left-radius: 15px;
//   border-bottom-left-radius: 15px;
// `;

// const DrawerItem = styled.View`
//   margin-bottom: 10px;
//   flex-direction: row;
//   padding: 5px;
// `;

// const ButtonContainer = styled.View`
//   flex-direction: row;
//   position: absolute;
//   left: 10px;
//   bottom: 1;
// `;
// const DrawerButton = styled.TouchableOpacity`
//   position: absolute;
//   bottom: 20px;
//   /* top: 50px; */
//   right: 20px;
//   padding: 10px;
//   background-color: #f0f0f0;
//   border-radius: 5px;
// `;
// const CheckboxContainer = styled.View`
//   width: 24px;
//   height: 24px;
//   border-width: 2px;
//   border-color: #333;
//   border-radius: 4px;
//   margin-left: auto;
// `;
// const Checkbox = styled.View`
//   width: 100%;
//   height: 100%;
//   background-color: ${({ checked }) => (checked ? "#333" : "transparent")};
//   border-radius: 2px;
// `;

// export default ChatDraw;
