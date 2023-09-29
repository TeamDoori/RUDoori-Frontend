import React, { useState, useEffect } from "react";
import { TouchableOpacity, Text } from "react-native";
import styled, { ThemeProvider } from "styled-components/native";
import { Title, InputBox, OptionName, Line } from "../../components/room2";
import { theme } from "./theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "@env";

const Container = styled.View`
  justify-content: flex-start;
  background-color: ${({ theme }) => theme.background};
  padding: 0 20px;
  flex: 1;
`;

const CheckContainer = styled.View`
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: wrap;
  padding-bottom: 10px;
`;

const ButtonContainer = styled.View`
  padding-left: 2px;
  padding-right: 2px;
  padding-top: 8px;
  margin: 2px 2px 2px 2px;
`;

const Button = styled(TouchableOpacity)`
  background-color: ${({ theme, isChecked }) =>
    isChecked ? theme.checkedColor : theme.uncheckedColor};
  width: 100px;
  height: 50px;
  border-radius: 30px;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled(Text)`
  color: black;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
`;

const delivery = {
  title: "배달 시킬 두리",
  one: "위치",
  two: "기숙사",
  three: "메뉴",
  data: [
    {
      전체: false,
      후문: false,
      애막골: false,
      정문: false,
      명동: false,
      기타: false,
    },
    {
      전체: false,
      새롬관: false,
      이룸관: false,
      국지원: false,
      난지원: false,
      퇴계관: false,
      재정: false,
    },
    {
      전체: false,
      한식: false,
      일식: false,
      양식: false,
      중식: false,
      카페: false,
    },
  ],
};

const exercise = {
  title: "운동할 두리",
  one: "종류",
  two: "위치",
  data: [
    {
      전체: false,
      헬스: false,
      골프: false,
      탁구: false,
      농구: false,
      야구: false,
      배드민턴: false,
      자전거: false,
      등산: false,
      복싱: false,
    },
    {
      전체: false,
      후문: false,
      애막골: false,
      정문: false,
      공쪽: false,
      기숙사: false,
    },
  ],
};

const foreigner = {
  title: "외국인 두리 만나기",
  one: "내 언어",
  two: "친구 언어",
  data: [
    {
      전체: false,
      영어: false,
      일본어: false,
      중국어: false,
      러시아어: false,
      불어: false,
      독일어: false,
      한국어: false,
      아랍어: false,
    },
    {
      전체: false,
      영어: false,
      일본어: false,
      중국어: false,
      러시아어: false,
      불어: false,
      독일어: false,
      한국어: false,
      아랍어: false,
    },
  ],
};

const hobby = {
  title: "취미 같이 할 두리",
  one: "종류",
  two: "온라인 게임",
  data: [
    {
      전체: false,
      영화: false,
      코노: false,
      볼링: false,
      포켓볼: false,
      자전거: false,
      당구: false,
      보드게임: false,
      카페투어: false,
    },
    {
      전체: false,
      롤: false,
      배그: false,
      서든: false,
      피파: false,
      스팀: false,
      오버워치: false,
    },
  ],
};

const meal = {
  title: "밥 먹을 두리",
  one: "학식",
  two: "외식",
  three: "메뉴",
  data: [
    {
      전체: false,
      천지: false,
      크누: false,
      기숙사: false,
      백록: false,
      석재: false,
    },
    {
      전체: false,
      후문: false,
      애막골: false,
      정문: false,
      명동: false,
    },
    {
      전체: false,
      한식: false,
      일식: false,
      양식: false,
      중식: false,
    },
  ],
};

const study = {
  title: "스터디 할 두리",
  one: "위치",
  two: "기간",
  three: "분류",
  data: [
    {
      전체: false,
      도서관: false,
      카페: false,
      정문: false,
      공쪽: false,
      후문: false,
    },
    {
      전체: false,
      번개: false,
      단기: false,
      장기: false,
    },
    {
      전체: false,
      자격증: false,
      팀플: false,
      공모전: false,
    },
  ],
};
const taxi = {
  title: "택시 탈 두리",
  one: "출발지",
  two: "목적지",
  data: [
    {
      전체: false,
      새롬관: false,
      이룸관: false,
      국지원: false,
      난지원: false,
      퇴계관: false,
      재정: false,
      백록관: false,
      후문: false,
    },
    {
      전체: false,
      후문: false,
      애막골: false,
      정문: false,
      명동: false,
      기타: false,
    },
  ],
};
const RoomSelect = ({ route, navigation }) => {
  const { keyword } = route.params;
  const [firstSelector, setFirstSelector] = useState({});
  const [secondSelector, setSecondSelector] = useState({});
  const [thirdSelector, setThirdSelector] = useState({});
  // const navigation = useNavigation();
  const [one, setOne] = useState("");
  const [two, setTwo] = useState("");
  const [three, setThree] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  // 검색할 키워드 저장 자료구조
  const [sendData, setSendData] = useState(new Set());

  useEffect(() => {
    console.log(keyword);
    // keyword에 따라서 적절한 변수 선택
    let selectedCategories = {};
    if (keyword === "delivery") {
      selectedCategories = delivery;
      setCategory("배달");
    } else if (keyword === "exercise") {
      selectedCategories = exercise;
      setCategory("운동");
    } else if (keyword === "foreigner") {
      selectedCategories = foreigner;
      setCategory("외국인");
    } else if (keyword === "hobby") {
      selectedCategories = hobby;
      setCategory("취미");
    } else if (keyword === "meal") {
      selectedCategories = meal;
      setCategory("밥");
    } else if (keyword === "study") {
      selectedCategories = study;
      setCategory("공부");
    } else if (keyword === "taxi") {
      selectedCategories = taxi;
      setCategory("택시");
    }
    const data = selectedCategories.data;
    if (data && data.length === 3) {
      setFirstSelector(selectedCategories.data[0]);
      setSecondSelector(selectedCategories.data[1]);
      setThirdSelector(selectedCategories.data[2]);
      setOne(selectedCategories.one);
      setTwo(selectedCategories.two);
      setThree(selectedCategories.three);
      setTitle(selectedCategories.title);
    } else if (data && data.length === 2) {
      setFirstSelector(selectedCategories.data[0]);
      setSecondSelector(selectedCategories.data[1]);
      setOne(selectedCategories.one);
      setTwo(selectedCategories.two);
      setTitle(selectedCategories.title);
    }
  }, []);
  const addSendData = (key, value, arrayName, setName) => {
    //버튼이 안 눌린 상태면
    if (!value) {
      if (key === "전체") {
        // 모든 키워드 "체크"된 상태로 바꾸기
        const allChecked = {};
        for (const [k, v] of Object.entries(arrayName)) {
          allChecked[k] = true;
        }
        setName(allChecked);

        // 전체를 제외한 모든 데이터 sendData에 넣기
        const filteredArray = Object.keys(arrayName).filter(
          (element) => element !== "전체",
        );

        filteredArray.forEach((i) => {
          setSendData(new Set(sendData.add(i)));
        });
      }
      // 하나의 키워드를 선택할 때
      else {
        setSendData(new Set(sendData.add(key)));
        setName({ ...arrayName, [key]: true });
      }
    }
    //버튼이 눌린 상태면
    else {
      if (key === "전체") {
        // 모든 키워드 "체크 해제"된 상태로 바꾸기
        const allChecked = {};
        for (const [k, v] of Object.entries(arrayName)) {
          allChecked[k] = false;
        }
        setName(allChecked);

        // 모든 데이터 sendData에서 빼기
        const filteredArray = [...sendData].filter(
          (key) => !arrayName.hasOwnProperty(key),
        );
        setSendData(new Set(filteredArray));
      }
      // 하나의 키워드를 해제할 때
      else {
        sendData.delete(key);
        setSendData(new Set(sendData));
        setName({ ...arrayName, [key]: false });
      }
    }
  };

  // 검색 완료 -> 백엔드로 데이터 보냄
  const handleSendButton = (inputBoxKeyword) => {
    if (inputBoxKeyword !== "") {
      sendData.add(inputBoxKeyword);
      setSendData(new Set(sendData));
    }

    const array = Array.from(sendData);
    const dataArray = []; // 방 리스트 보여주는 스크린으로 보내는 데이터
    let data = {
      category: category,
      keywordList: array,
    };

    const send = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(`${API_URL}/room/searchRoom`, send)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        // JSON 데이터를 파싱하여 다음 then 블록으로 전달
        return response.json();
      })
      .then((data) => {
        // 성공
        console.log(data);

        dataArray.push(...Object.values(data));
        console.log(dataArray);
        navigation.navigate("Result", { data: dataArray });
        console.log("성공");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    console.log("보낼 데이터 : ", sendData);
  }, [sendData]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <Container>
          <Title title={title} />
          <InputBox
            onPress={(inputBoxKeyword) => handleSendButton(inputBoxKeyword)}
          />
          <OptionName text={one} />
          <Line />
          <CheckContainer>
            {Object.entries(firstSelector).map(([key, value]) => (
              <ButtonContainer>
                <Button
                  isChecked={value}
                  onPress={() =>
                    addSendData(key, value, firstSelector, setFirstSelector)
                  }
                >
                  <ButtonText>{key}</ButtonText>
                </Button>
              </ButtonContainer>
            ))}
          </CheckContainer>
          <OptionName text={two} />
          <Line />
          <CheckContainer>
            {Object.entries(secondSelector).map(([key, value]) => (
              <ButtonContainer>
                <Button
                  isChecked={value}
                  onPress={() =>
                    addSendData(key, value, secondSelector, setSecondSelector)
                  }
                >
                  <ButtonText>{key}</ButtonText>
                </Button>
              </ButtonContainer>
            ))}
          </CheckContainer>
          {three == "" ? null : (
            <>
              <OptionName text={three} />
              <Line />
              <CheckContainer>
                {Object.entries(thirdSelector).map(([key, value]) => (
                  <ButtonContainer>
                    <Button
                      isChecked={value}
                      onPress={() =>
                        addSendData(key, value, thirdSelector, setThirdSelector)
                      }
                    >
                      <ButtonText>{key}</ButtonText>
                    </Button>
                  </ButtonContainer>
                ))}
              </CheckContainer>
            </>
          )}
        </Container>
      </ThemeProvider>
    </SafeAreaView>
  );
};

export default RoomSelect;
