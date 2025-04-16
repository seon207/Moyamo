// API 응답 형식 정의
export interface QuizResponse {
  status: number;
  data: QuestionData[];
}

// 서버 응답에 맞춘 질문 데이터 타입
export interface QuestionData {
  question_id: number;
  question_text: string;
  question_type: 'MEANING' | 'GESTURE' | 'CAMERA';
  gesture_type: 'STATIC' | 'DYNAMIC';
  gesture_url: string | null;
  options: Array<{
    option_id: number;
    option_meaning: string | null;
    gesture_id: number | null;
    gesture_image: string | null;
  }>;
  answer: {
    answer_id: number;
    answer_option_id: number | null;
    correct_gesture_name: string | null;
  };
}

// 프론트엔드에서 사용할 형식으로 변환된 질문 데이터 타입
export interface FrontendQuestionData {
  id: number;
  text: string;
  type: 'MEANING' | 'GESTURE' | 'CAMERA';
  gestureType: 'STATIC' | 'DYNAMIC';
  gestureUrl: string | null;
  options: Array<{
    id: number;
    meaning: string | null;
    gestureId: number | null;
    gestureImage: string | null;
  }>;
  answer: {
    id: number;
    correctOptionId: number | null;
    correctGestureName: string | null;
  };
}

// 에러 응답 타입
export interface ErrorResponse {
  status: number;
  error: string;
  message: string;
}
