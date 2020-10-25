# H-Apis

별다른 건 없고.. 재미삼아서 만들어본 hitomi download 모듈.

이후 요구사항에 따라 타 사이트의 로직도 작성가능하며, 다른 많은 사람들의 코드레벨 참여 및 

## 제공형식

- CLI prompt (대화식)
- Web (단순 기능 확인수준)
- ~~Command Arguments (단일실행방식)~~ (TODO)
- ~~Library (타 모듈에서 사용할 수 있도록 import 제공)~~ (TODO)

## 제공기능 (TODO)

- [ ] 리스팅
  - [ ] 일반 데이터 리스팅 (페이징 필요할 수 있음)
  - [ ] 태그 데이터 리스팅
  - [ ]태그 필터된 데이터 리스팅
- [ ] 선택된 데이터에 대한 실제 페이지 랜딩
- [x] 다운로드
  - [ ] 선택된 데이터에 대한 압축파일 / 리스트 다운로드

# 동작 요구사항

- 네트워크 연결된 상태 =
- node, npm 설치된 상태 ([여기서 다운로드](https://nodejs.org/ko/))

# 실행 방법

1. 디렉토리 위치에서 `npm install` 을 통해 종속성 라이브러리 설치
2. `npm run cli` 명령어를 통해 커맨드라인에서 직접 다운로드
3. `npm run web` 명령어를 통해 웹서버 띄우기도 가능
   1. `http://localhost:3000` 혹은 `http://127.0.0.1:3000` 으로 확인가능 

