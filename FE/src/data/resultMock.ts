import { GestureSearchResult } from "@/types/searchGestureType";
import { getFlagImage } from "@/utils/imageUtils";

export const searchResultMock: GestureSearchResult[] = [
  {
    gestureId: 1,
    gestureName: "승리",
    meanings: [
      {
        countryId: 1,
        imageUrl: getFlagImage("kr"),
        countryName: "대한민국", 
        meaning: "손가락으로 만드는 V자 모양의 제스처. '승리'를 뜻하며 사진을 찍을 때 많이 사용한다."
      },
      {
        countryId: 2,
        imageUrl: getFlagImage("us"),
        countryName: "미국", 
        meaning: "손가락으로 만드는 V자 모양의 제스처. '승리'를 뜻하며 사진을 찍을 때 많이 사용한다."
      },
    ],
    gestureImage: '/images/gestures/victory.png',
  },
  {
    gestureId: 2,
    gestureName: "행운을 빌다",
    meanings: [
      {
        countryId: 2,
        imageUrl: getFlagImage("us"),
        countryName: "미국",
        meaning: "중지와 검지를 꼬는 제스처. 악과 불운이 사라진다는 미신에서 시작되었으며 'Good Luck'의 의미를 가진다."
      },
    ],
    gestureImage: '/images/gestures/cross-finger.png',
  },
  {
    gestureId: 3,
    gestureName: "나",
    meanings: [
      {
        countryId: 3,
        imageUrl: getFlagImage("jp"),
        countryName: "일본",
        meaning: "검지로 자신의 얼굴(보통 코)을 가리키며 제스처를 취한 '본인'을 뜻한다."
      },
    ],
    gestureImage: '/images/gestures/me.png',
  },
  {
    gestureId: 4,
    gestureName: "하트",
    meanings: [
      {
        countryId: 1,
        imageUrl: getFlagImage("kr"),
        countryName: "대한민국",
        meaning: "엄지와 검지를 이용해 하트를 만든다."
      },
    ],
    gestureImage: '/images/gestures/finger-heart.png',
  },
  {
    gestureId: 5,
    gestureName: "하트",
    meanings: [
      {
        countryId: 2,
        imageUrl: getFlagImage("us"),
        countryName: "미국",
        meaning: "엄지와 검지를 이용해 하트를 만든다."
      },
    ],
    gestureImage: null, // 일부 데이터는 이미지가 없을 수 있음
  },
  {
    gestureId: 6,
    gestureName: "하트",
    meanings: [
      {
        countryId: 3,
        imageUrl: getFlagImage("jp"),
        countryName: "일본",
        meaning: "엄지와 검지를 이용해 하트를 만든다."
      },
    ],
    gestureImage: '/images/gestures/finger-heart.png',
  },
  {
    gestureId: 7,
    gestureName: "하트",
    meanings: [
      {
        countryId: 4,
        imageUrl: getFlagImage("cn"),
        countryName: "중국",
        meaning: "엄지와 검지를 이용해 하트를 만든다."
      },
    ],
    gestureImage: null, // 일부 데이터는 이미지가 없을 수 있음
  },
  {
    gestureId: 12,
    gestureName: "cross_finger",
    meanings: [
      {
        countryId: 2,
        imageUrl: "https://moyamos3.s3.ap-northeast-2.amazonaws.com/gesture/326bdb90-1436-402b-8a23-4016647d718d_us.webp",
        countryName: "미국",
        meaning: "행운을 빌어, 거짓말"
      }
    ],
    gestureImage: null,
  },
  {
    gestureId: 16,
    gestureName: "pardon",
    meanings: [
      {
        countryId: 2,
        imageUrl: "https://moyamos3.s3.ap-northeast-2.amazonaws.com/gesture/326bdb90-1436-402b-8a23-4016647d718d_us.webp",
        countryName: "미국",
        meaning: "다시 말해주세요, 요청"
      }
    ],
    gestureImage: null,
  }
];