// 예시 

/*
  api 요청과 관련된 interface의 경우 백엔드 형식에 맞춰 작성합니다.
  이후 서비스 레이어를 통해 카멜 케이스로 변환하여 프론트에서 사용합니다.
*/

export interface Gesture {
  meaning_id: number;
  gesture_id: number;
  gesture_image: string;
  gesture_title: string;
  gesture_meaning: string;
  gesture_situation: string;
  gesture_others: string;
  gesture_tmi: string;
  is_positive: boolean;
  multiple_gestures: number;
}

export type QuizType = 'GESTURE' | 'MEANING' | 'CAMERA';

// interface GestureOption {
//   optionId: number;
//   gestureId: number;
//   gestureImage: string;
// }
// interface MeanOption {
//   optionId: number;
//   optionMeaning: string;
// }