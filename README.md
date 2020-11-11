# Hi-Web

## 동작 요구사항

- 네트워크 연결된 상태 =
- node, npm 설치된 상태 ([여기서 다운로드](https://nodejs.org/ko/))

## 실행 방법

1. [node.js](https://nodejs.org/ko/) 설치 되어있지 않다면 설치
1. > git 사용할 줄 아는 경우  
   > 해당 프로젝트를 `git clone https://github.com/h-apis/h-apis.git` 명령을 통해 설치
   >
   > git 이 뭔지 모르는 경우  
   > ![image](https://user-images.githubusercontent.com/73422319/98678169-7d127300-23a1-11eb-9ee8-47b10221fe6b.png)  
   > 에서 Download ZIP 을 눌러서 코드 다운로드, 압축 해제
   >
1. 해당 폴더에 접근 > 주소창에 cmd 입력 후 엔터 혹은, cmd 에서 해당 프로젝트 디렉토리 경로까지 접근
1. 디렉토리 위치에서 `npm install` 을 통해 종속성 라이브러리 설치
1. `npm run web:build` 로 한번 코드를 빌드 (public 안에 dist 라는 이름의 디렉토리가 생김)
1. `npm run web` 을 입력하면 웹서버가 구동됨
   1. `http://localhost:3000` 혹은 `http://127.0.0.1:3000` 으로 확인가능 

