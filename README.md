# ✌️MoyaMo 모야모
![image](https://github.com/user-attachments/assets/097c409e-23e3-4c30-96d9-a4ba6e3d3fb3)

## 📑 목차
- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#️-기술-스택)
- [프로젝트 구조](#-프로젝트-구조)
- [설치 및 실행 방법](#️-설치-및-실행-방법)
- [팀원 정보](#-팀원-정보)

## 📋 프로젝트 소개
"**모야모(MOYAMO)**"는 국가별로 다양한 의미를 가진 제스처를 확인하고 연습해볼 수 있는 제스처 사전 서비스입니다.
전 세계의 제스처 문화를 확인하고 비교할 수 있어 여행이나 국제 교류 시 발생할 수 있는 문화적 오해를 방지할 수 있습니다다.
모야모에서는 검색, 딕셔너리, 연습 모드, 퀴즈 기능을 통해 제스처 정보를 확인할 수 있고, 3D 이미지를 통해 다양한 각도에서 동작을 확인할 수 있습니다.
또한, AI 모델 기반의 제스처 검색·연습·퀴즈 기능을 통해 사용자가 입력한 제스처를 실시간으로 추론하고, 그 정확도를 확인할 수 있습니다.

## 🚀 주요 기능
1. **제스처 검색**
  

2. **제스처 사전**
- 한국, 미국, 일본, 중국, 이탈리아 5개국 중 원하는 국가를 선택하여 해당 국가에서 사용하는 제스처 확인 가능
- 디테일 페이지를 통해 사용 상황, 다른 나라에서의 의미 차이, 제스처 관련 TMI 등 다양한 정보를 제공
- 비교 가이드 : 다양한 국가에서 같은 제스처가 가지는 다른 의미 비교 제공
- 제스처 연습 
    - 3D 이미지를 통한 다양한 각도에서의 제스처 확인 가능
    - AI를 활용한 사용자 제스처 인식 및 피드백 제공
3. **제스처 퀴즈**
   

## 💻 화면
### 1. 메인화면
![image](https://github.com/user-attachments/assets/cb1d14a3-6543-4614-9b71-8540daf08326)

### 2. 제스처 검색
**키워드 검색**
![image](https://github.com/user-attachments/assets/76bcf58f-6be2-406c-a2c2-4619235dfd96)

**제스처 검색**
![image](https://github.com/user-attachments/assets/939431be-d697-4af1-aa2d-2ef44f6025e0)

### 3-1. 제스처 사전
**디테일**
![image](https://github.com/user-attachments/assets/d46e456d-73d3-4699-8fc6-fcf01d95760d)

**비교가이드**
![image](https://github.com/user-attachments/assets/add488af-cc4c-41e4-8bb9-3adb59f95297)

### 3-2. AI 연습
![AI연습](https://github.com/user-attachments/assets/923ab1d8-61ae-4577-b614-efcb74619e96)

### 4-1. 의미 맞추기 퀴즈 
![의미맞추기퀴즈](https://github.com/user-attachments/assets/06120281-dfab-4850-8958-e57de1652e91)

### 4-2. 제스처 맞추기 퀴즈 
![제스처맞추기퀴즈](https://github.com/user-attachments/assets/cb30fb5e-b63a-4eaa-8029-b9808a1e8024)

### 4-3. AI 인식 퀴즈
![ai퀴즈](https://github.com/user-attachments/assets/5a5f8372-4155-46e3-a674-4d9e7de8baf9)



## 🛠️ 기술 스택

### 💻 프론트엔드
- React 
- TypeScript
- Tailwind CSS
- Zustand
- Threejs
- Vite
- blender

### ⚙️ 백엔드
- Java 17
- SpringBoot
- FastAPI

### 🗄️ 데이터베이스
- MySQL
- Elasticsearch

### ☁️ 인프라
- Docker
- Jenkins
- Docker Compose
- AWS EC2
- S3

### 📹 AI
- Mediapipe + Tensorflow
- Conv1D
- LSTM

### 📂 프로젝트 구조

### 📦 프론트엔드
```
📁 FE
├── 📁 public
├── 📁 scripts
├── 📁 src
│   ├── 📁 api
│   ├── 📁 assets
│   │   ├── 📁 images
│   │   └── 📁 lottie
│   ├── 📁 components
│   │   ├── 📁 cameraModal
│   │   ├── 📁 gestureSearch
│   │   └── 📁 ui
│   ├── 📁 data
│   ├── 📁 hooks
│   ├── 📁 lib
│   ├── 📁 pages
│   │   ├── 📁 dict
│   │   ├── 📁 home
│   │   ├── 📁 quiz
│   │   ├── 📁 result
│   │   └── 📁 test
│   ├── 📁 services
│   ├── 📁 stores
│   ├── 📁 types
│   └── 📁 utils
│   └── 📜 App.tsx
│   └── 📜 main.tsx
│   └── 📜 index.css
```

### 🖥️ 백엔드
```
📦 BE
├── 📁 src
│   └── 📁 main
│       ├── 📁 java
│       │   └── 📁 com.moyamo.be
│       │       ├── 📁 common
│       │       │   └── 📄 ApiResponse.java
│       │       ├── 📁 config
│       │       │   ├── 📄 ElasticSearchConfig.java
│       │       │   ├── 📄 S3Config.java
│       │       │   └── 📄 WebConfig.java
│       │       ├── 📁 dictionary
│       │       │   ├── 📁 controller
│       │       │   ├── 📁 dto
│       │       │   ├── 📁 entity
│       │       │   ├── 📁 repository
│       │       │   └── 📁 service
│       │       ├── 📁 quiz
│       │       │   ├── 📁 controller
│       │       │   ├── 📁 dto
│       │       │   ├── 📁 entity
│       │       │   ├── 📁 repository
│       │       │   └── 📁 service
│       │       ├── 📁 s3
│       │       │   ├── 📁 controller
│       │       │   ├── 📁 dto
│       │       │   └── 📁 service
│       │       ├── 📁 search
│       │       │   ├── 📁 controller
│       │       │   ├── 📁 dto
│       │       │   ├── 📁 repository
│       │       │   └── 📁 service
│       │       ├── 📁 tip
│       │       │   ├── 📁 controller
│       │       │   ├── 📁 dto
│       │       │   ├── 📁 entity
│       │       │   ├── 📁 repository
│       │       │   └── 📁 service
│       │       └── 📄 BeApplication.java
│       └── 📁 resources
│           ├── 📄 application.yaml
│           ├── 📄 application-dev.yaml
│           └── 📄 application-prod.yaml
├── 📁 test

```

### 📚 ERD
![image](https://github.com/user-attachments/assets/a9bd0d92-0c9c-455e-ac2a-dd3e5cee6fa3)


### ⚙️ 설치 및 실행 방법
```bash
# Frontend


# Backend

```

### 🛠 담당 파트

<table>
  <tr>
    <td align="center">
      <img src="" width="50" height="50" style="object-fit: cover; border-radius: 10px;" />
      <br />
      <strong>김선주</strong>
      <br />
      🔧 BE | 🛠 Infra | 🤖 AI
    </td>
    <td align="center">
      <img src="" width="30" height="50" style="object-fit: cover; border-radius: 10px;" />
      <br />
      <strong>김민재</strong>
      <br />
      🔧 BE | 🤖 AI
    </td>
    <td align="center">
      <img src="" width="30" height="50" style="object-fit: cover; border-radius: 10px;" />
      <br />
      <strong>전용현</strong>
      <br />
      🔧 BE | 🤖 AI
    </td>
    <td align="center">
      <img src="" width="30" height="50" style="object-fit: cover; border-radius: 10px;" />
      <br />
      <strong>정주은</strong>
      <br />
      💻 FE
    </td>
    <td align="center">
      <img src="" width="30" height="50" style="object-fit: cover; border-radius: 10px;" />
      <br />
      <strong>조혜정</strong>
      <br />
      💻 FE
    </td>
    <td align="center">
      <img src="" width="30" height="50" style="object-fit: cover; border-radius: 10px;" />
      <br />
      <strong>윤지원</strong>
      <br />
      💻 FE
    </td>
  </tr>
</table>

### 공통 파트
- Git 컨벤션 준수
- 코드 리뷰 진행
- 기술 문서 작성


# 회고
- 김선주
```
이번 프로젝트에서 백엔드 팀장을 맡았고, 인프라, AI, API 개발, DB 관리 등을 담당했습니다.

AI 모델을 직접 학습시켜 프로젝트에 적용해보는 것이 처음이라 걱정이 많았는데, 최종적으로 만족스러운 성능이 나와 뿌듯함이 남습니다. 그 중에서도 특히 정적/동적 모델을 구분해야 하다보니 최적화를 위해 끊임없이 고민해야했고, 프로젝트 도중 실시간 웹소켓 통신에서 동시 처리 이슈를 해결했던 부분이 가장 기억에 남습니다.

인프라 구축에서는 이전에 해본 경험이 있어 빠르게 진행할 수 있었는데, 이번 프로젝트에서는 AI 모델도 배포하고 관리하는 흐름을 설계하다보니 더 효율적인 방식이 없을지에 대한 고민 해볼 수 있는 기회가 되었습니다. 이 경험을 바탕으로, 이후 프로젝트에서는 다양한 인프라 기술을 적극적으로 실험하고 적용해보고 싶다는 생각도 들었습니다.
DB 작업에서 제스처 정보와 퀴즈 데이터를 직접 생성하고 넣는 작업이 많아 특히 시간이 많이 걸렸는데, 데이터를 정확하게 유지하고 효율적으로 저장하기 위해 데이터 구조를 개선하며 데이터베이스 설계와 관리 부분에서 한층 성장한 느낌이 들었습니다.

전체적으로 백엔드 중심으로 개발했지만 프론트엔드 퀴즈 페이지에서 발생하는 오류를 수정하는 등 프론트, 백엔드, AI, 인프라까지 다양한 부분을 직접 개발하며 전반적인 시스템 흐름을 경험할 수 있었던 프로젝트였고, 기술적으로도, 협업적으로도 많은 걸 배운 프로젝트였습니다.
```
>

- 김민재
```
팀원들이 모두 마지막까지 최선을 다한 덕분에 의도한 기능을 모두 구현하고 마무리할 수 있었던 것 같습니다.
또한 AI를 활용하는 것에 어느 정도 익숙해질 수 있었던 것 같습니다.
개인적으로는 많은 부분 기여하지 못한 것 같아 미안함과 아쉬움이 남는 것 같습니다.
정말 좋은 기획과 좋은 팀원들과 함께해 프로젝트를 마칠 수 있었던 것 같아 감사했습니다.
```
>

- 전용현
```
매번 API로 호출하던 AI를 이번 기회에 처음으로 직접 데이터 수집 및 학습을 시켜봤습니다. 
처음 접근하는 만큼 많이 어려웠던것 같습니다. 특히 제스처 판별을 위한 모델 선정부터 데이터셋 확보 및 증강까지의 과정에서 여러 시행착오를 겪었던것 같습니다. 
정적 제스처와 동적 제스처 둘다 LSTM구조의 모델로 시도 했다가 정적 제스처는 Conv1D, 동적 제스처는 LSTM으로 분리하는 결정을 내리면서 부터 성과가 나오기 시작했던것 같습니다.
정적 동적 제스처를 실시간으로 추론하게 만들어 사용자 경험을 극대화 시키려 시도했던 웹소켓에서 세션을 분리하지 않으면 사용자들의 입력값이 엉키는 문제를 발견했고 이를 극복하는 과정이 기억에 남는것 같습니다. 
이번 프로젝트를 계기로 AI 학습에 대한 두려움이 줄었고 앞으로 다양한 도전을 통해 여러 기술을 습득해 나아 갈 수 있는 계기가 된 것 같습니다.

그리고 이번 프로젝트에서 DB에 들어갈 미디어 파일의 저장을 담당했는데, 소스파일의 용량을 줄이기 위해 S3를 사용했습니다. 
하지만, 서비스에 사용되는 이미지는 단순 이미지가 아닌 블렌더로 생성한 3D이미지였고 당연히 용량이 매우 컸습니다.
이런 이유로 페이지 렌더링 시간이 길어지는 문제가 있었는데 cloudfront의 캐싱 기술을 조금만 더 빨리 알았다면 적용시켜 볼 수 있지 않았을까 하는 아쉬움이 크게 남았습니다. 
```
>

- 정주은
```
이번 프로젝트에서는 TypeScript, React Query, Zustand, PWA 등 처음 접해보는 기술들이 많아서
어렵기도 했지만, 그만큼 많이 배우고 성장할 수 있었던 소중한 시간이었습니다.
특히, 언제 어디서나 사용할 수 있는 서비스가 중요하다고 생각해 반응형 구현에 많은 신경을 썼고,
그 과정이 쉽지만은 않았지만 완성 후에는 큰 보람을 느꼈습니다.
또한, 카메라를 활용해 제스처를 인식하고 정답을 판별하는 기능은 구현 과정에서 시행착오가 가장 많았던
부분이었지만, 처음에 의도한 대로 잘 작동해줘서 다행이었고, 그만큼 큰 성취감을 느낄 수 있었습니다.
```
>

- 조혜정
```
7주간 모야모 프로젝트의 팀장으로서 Jira와 Notion을 활용해 체계적인 프로젝트 관리를 진행했습니다. 
팀원 모두가 Jira 이슈 관리에 적극 참여하여 구미 이슈 수 1등을 기록할 정도로 협업 도구를 효과적으로 활용했습니다. 
이 과정에서 팀원들과 원활한 소통을 통해 협업의 중요성을 깊이 이해할 수 있었습니다.

프론트엔드 개발에서는 TypeScript, Zustand, PWA, Shadcn 등 다양한 기술을 적용했습니다. 
React 기반에 TypeScript를 도입해 코드 안정성을 확보했으며, PWA로 사용자 접근성을 높이고 Shadcn과 Lottie로 UI 품질을 향상시켰습니다. 
특히 Blender 디자인을 Three.js 환경에 가져와 웹에서 구현하는 과정에서 새로운 기술 습득의 기회를 얻었습니다.

퀴즈 페이지 개발에서는 useEffect를 통한 상태관리와 setTimeout을 활용한 타이밍 제어로 복잡한 동시성 문제를 해결했습니다. 
하나의 동작이 여러 상태값에 영향을 주는 상황에서 최적의 사용자 경험을 제공하기 위해 관련 기술을 연구하고 적용하며 프론트엔드 개발자로서 역량을 키울 수 있었습니다. 

앞으로는 기능 구현을 넘어 웹 성능 최적화에 더 집중하고 싶습니다. 
로딩 속도 개선과 리소스 효율화를 통해 사용자 경험을 한 단계 더 향상시킬 수 있도록 노력하겠습니다. 
```
> 

- 윤지원
```
지난 공통 프로젝트에서의 TypeScript 선행 경험자로서 TypeScript를 사용해보지 못했던 팀원들과 적극적으로 기술 공유를 하려 노력했으며, 해결책을 함께 고민하는 과정에서 저 또한 많이 성장했습니다.

비슷한 기술만을 사용하지 않기 위해 익숙하지 않았던 Tanstack Query 학습에 집중했습니다. 
그 결과 서버 상태 관리 및 캐싱을 효율적으로 처리할 수 있었으며, 특히 엘라스틱서치를 활용한 연관검색어 기능에서 사용자 입력에 따라 실시간으로 검색 결과를 갱신하는 과정을 최적화할 수 있었습니다. 
그리고 키 입력마다 API 요청을 관리하고 응답 데이터를 효율적으로 화면에 반영하는 로직을 Tanstack Query를 통해 간결하게 구현했습니다. 결과적으로 대부분의 요청이 즉각적으로 사용자에게 제공될 수 있었습니다.

또, 전체 팀원들이 사용해야 하는 제스처 인식 카메라 컴포넌트의 로직을 개발 및 유지보수했습니다.
초기 미디어파이프 로직이 정확도를 기반으로 판단하는 것이었기에 오히려 잘못된 결과를 반환하는 일이 잦아 가장 많이 인지된 제스처의 빈도를 카운팅하는 형식으로 전환했습니다.
추후 웹소켓으로 연결해 두었던 로직이 동시성 문제로 인해 API POST 요청으로 바뀌었었는데, 꼬인 useEffect를 정리하며 많은 시행착오를 겪었습니다.
이 문제의 해결 과정에서 메모리 누수 방지를 위한 리소스 정리 함수 구현에 집중하여 더 안정적인 서비스를 만들기 위해 노력했습니다. 
성공적으로 등록된 모든 제스처를 인식하는 로직을 구현하게 되어 큰 성취감을 느꼈습니다.

사용자 경험을 중시하는 UI/UX 디자인을 위해 tailwindcss 외에도 shadcn.ui를 도입하였고, 다크모드 및 모바일 사이즈의 UI까지 구현하였습니다.
많은 시행착오를 겪었지만, 결과적으로 모든 사람들이 손쉽게 문화적인 제스처를 확인할 수 있도록 개발하게 되어 뿌듯함을 느낍니다. 

이외에도 이미지 리사이징 및 포맷 변환의 자동화를 통한 정적 리소스 최적화 및 웹폰트 최적화 등을 활용하여 lighthouse 기준 렌더링 속도를 약 20점 가량 올리는 결과를 이끌어냈습니다.

이러한 경험을 바탕으로 앞으로도 더 나은 사용자 경험을 추구하고 렌더링 성능을 끌어올리기 위해 발전해 나가고 싶습니다!
```
> 

# 📌 기타 정보
-


