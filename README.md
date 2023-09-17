# RUDoori-Frontend (친구 만들기 앱 프로젝트)

<br>

#### 💡 주제 : 많은 학생수를 보유한 강원대학교에서 낯선 환경의 학우들이 같이 공부하고 운동하고 밥먹을 친구를 구할 수 있는 앱
- **Frontend :** React-native
- **Backend :** Spring boot

<br>

#### 📚 여기는 Frontend 개발의 기록입니다!


- 🖥 **프레임워크 :** React Native 0.71.8, Expo
  
- ⚙ **패키지 관리자 :** Yarn

- 📲 **Use :** Android, ios

<br><br>

## ⭐ 공동 작업 유의사항!! ⭐

- 작업자들의 패키지 버전 통일을 위해 " yarn.lock " 파일 생성해놓음 (초기 세팅된 패키지 버전들 기록되어 있음)
  
- git에서 clone 후, " yarn install " 명령으로 한번에 패키지 다운받기 (해당 디렉토리로 이동후 명령어 실행)
- 프로젝트 중간에 pull 했을 때, 다른 작업자가 새로운 패키지를 설치했을 수 있으므로 이때는 "yarn install"이 아닌 "yarn install --immutable --immutable-cache --check-cache
"를 통해 패키지 설치하기!
  ( -> yarn.lock 파일에 있는 버전으로 통일되어 설치됨)
- 코드 구성과 맞춤법의 통일을 위하여 "ESLint, Prettier" 파일을 생성해놓음 -> 회의를 통해 규칙 정할 예정
- 각자 VSCode에서 "ESLint, Prettier extension" 설치하기
- "변수명, 함수명" 등은 직관적으로 명명하기

<br><br>

## 🔖 Git 커밋 메세지 규칙 🔖

- feat : 새로운 기능 추가
  
- fix : 버그 수정
- docs : 문서 수정
- style : 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우
- refactor : 코드 리펙토링
- test : 테스트 코드, 리펙토링 테스트 코드 추가
- chore : 빌드 업무 수정, 패키지 매니저 수정
