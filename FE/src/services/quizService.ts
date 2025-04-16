import apiClient from '@/api/apiClient';
import { QuizResponse, QuestionData, FrontendQuestionData } from '@/types/quizTypes';
import { quizMockData as mockData } from '@/pages/quiz/questions';

// 타입 단언을 사용하여 quizMockData의 타입을 명시적으로 지정
const quizMockData = mockData as QuestionData[];

// 개발 환경 확인
const isDevelopment = import.meta.env.MODE === 'development';

// 목 데이터 사용 여부를 localStorage에서 가져오기 (개발 중 전환 가능하도록)
const useMockData = () => {
  try {
    const storedValue = localStorage.getItem('useMockData');
    // localStorage에 값이 명시적으로 있으면 그 값을 사용
    if (storedValue !== null) {
      return storedValue === 'true';
    }
    // 없으면 개발 환경 여부로 결정
    return isDevelopment;
  } catch {
    return isDevelopment;
  }
};

// 서버 응답 데이터를 프론트엔드 형식으로 변환
const transformQuizData = (data: QuestionData[]): FrontendQuestionData[] => {
  return data.map((question) => ({
    id: question.question_id,
    text: question.question_text,
    type: question.question_type,
    gestureUrl: question.gesture_url,
    gestureType: question.gesture_type,
    options: question.options.map((option) => ({
      id: option.option_id,
      meaning: option.option_meaning,
      gestureId: option.gesture_id,
      gestureImage: option.gesture_image,
    })),
    answer: {
      id: question.answer.answer_id,
      correctOptionId: question.answer.answer_option_id,
      correctGestureName: question.answer.correct_gesture_name,
    },
  }));
};

// 퀴즈 문제 가져오기
export const getQuizQuestions = async (useCamera: boolean): Promise<FrontendQuestionData[]> => {
  // 목 데이터 사용 여부 확인
  if (useMockData()) {
    console.log('[개발 환경] 목 데이터 사용 중...');
    // API 응답 딜레이 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 300));
    return transformQuizData(quizMockData);
  }

  // 실제 API 호출
  console.log('[프로덕션 환경] 실제 API 호출 중...');
  try {
    const params = new URLSearchParams();
    if (useCamera) {
      params.append('type', 'CAMERA');
    } else {
      params.append('type', 'GESTURE');
      params.append('type', 'MEANING');
    }
    const { data } = await apiClient.get<QuizResponse>(`/api/quiz?${params.toString()}`);
    return transformQuizData(data.data);
  } catch (error) {
    console.error('API 호출 실패, 목 데이터로 대체:', error);
    return transformQuizData(quizMockData);
  }
};

// 카메라로 촬영한 제스처 인식
export const detectGesture = async (imageData: string): Promise<{ gesture: string }> => {
  // 목 데이터 사용 여부 확인
  if (useMockData()) {
    console.log('[개발 환경] 목 데이터로 제스처 인식 시뮬레이션...');
    await new Promise((resolve) => setTimeout(resolve, 300));
    const gestures = ['thumbs_up', 'victory', 'ok', 'heart'];
    return { gesture: gestures[Math.floor(Math.random() * gestures.length)] };
  }

  // 실제 API 호출
  console.log('[프로덕션 환경] 실제 제스처 인식 API 호출 중...');
  try {
    const { data } = await apiClient.post('/api/gestures/detect', { image: imageData });
    return data;
  } catch (error) {
    console.error('제스처 인식 API 호출 실패, 목 데이터로 대체:', error);
    const gestures = ['thumbs_up', 'victory', 'ok', 'heart'];
    return { gesture: gestures[Math.floor(Math.random() * gestures.length)] };
  }
};
