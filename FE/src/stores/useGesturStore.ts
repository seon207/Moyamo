import { create } from 'zustand';
import { GuideTextState, GestureFrequency } from '@/types/gesture';

interface GestureState {
  // 현재 감지된 제스처
  currentGesture: string | null;
  currentConfidence: number | null;

  // 가이드 텍스트 상태
  guideText: GuideTextState;

  // 카운트다운 상태
  isPreparingGesture: boolean;
  preparationCountdown: number;
  isCountingDown: boolean;
  countdown: number;

  // 오류 상태
  isErrorToastShown: boolean;

  // 서버 연결 상태 (웹소켓에서 HTTP로 변경됨)
  isWebSocketConnected: boolean; // 호환성을 위해 이름 유지, 실제로는 HTTP 연결 상태

  // 제스처 빈도 기록
  gestureFrequency: GestureFrequency;

  // 상태 플래그
  isProcessing: boolean;
  toastShownTimestamp: number | null;

  // 고유 ID 생성용 카운터
  toastIdCounter: number;

  // 액션
  setCurrentGesture: (gesture: string | null) => void;
  setCurrentConfidence: (confidence: number | null) => void;
  setGuideText: (text: GuideTextState) => void;
  setPreparationState: (isPreparingGesture: boolean, countdown?: number) => void;
  setCountdownState: (isCountingDown: boolean, countdown?: number) => void;
  setErrorState: (isErrorShown: boolean) => void;

  // 서버 연결 관련 액션 (웹소켓에서 HTTP로 변경됨)
  setWebSocketConnected: (isConnected: boolean) => void; // 호환성 유지
  setServerConnected: (isConnected: boolean) => void; // 신규 메소드 추가 (선택 사항)

  decrementPreparationCountdown: () => void;
  decrementCountdown: () => void;
  updateGestureFrequency: (gesture: string) => void;
  resetGestureData: () => void;
  resetAllState: () => void;
  getUniqueToastId: (prefix: string) => string;

  // 제스처 분석
  getMostFrequentGesture: () => string | null;
}

export const useGestureStore = create<GestureState>((set, get) => ({
  // 초기 상태
  currentGesture: null,
  currentConfidence: null,
  guideText: '버튼을 누르면 검색이 진행됩니다',
  isPreparingGesture: false,
  preparationCountdown: 2,
  isCountingDown: false,
  countdown: 3,
  isErrorToastShown: false,
  isWebSocketConnected: false, // 이제 HTTP 연결 상태를 나타냄
  connectionType: 'http', // 초기 연결 타입 설정 (선택 사항)
  gestureFrequency: {},
  isProcessing: false,
  toastShownTimestamp: null,
  toastIdCounter: 0,

  // 액션
  setCurrentGesture: (gesture) => set({ currentGesture: gesture }),
  setCurrentConfidence: (confidence) => set({ currentConfidence: confidence }),

  setGuideText: (text) => set({ guideText: text }),

  setPreparationState: (isPreparingGesture, countdown = 2) =>
    set({
      isPreparingGesture,
      preparationCountdown: countdown,
    }),

  setCountdownState: (isCountingDown, countdown = 3) =>
    set({
      isCountingDown,
      countdown,
    }),

  setErrorState: (isErrorShown) =>
    set({
      isErrorToastShown: isErrorShown,
    }),

  // 웹소켓 연결 상태 설정 (이제는 HTTP 연결 상태를 나타냄)
  setWebSocketConnected: (isConnected) =>
    set({
      isWebSocketConnected: isConnected,
    }),

  // 신규 메소드: 서버 연결 상태 설정 (선택 사항)
  setServerConnected: (isConnected) =>
    set({
      isWebSocketConnected: isConnected, // 호환성을 위해 기존 변수 업데이트
    }),

  decrementPreparationCountdown: () =>
    set((state) => ({
      preparationCountdown: Math.max(0, state.preparationCountdown - 1),
    })),

  decrementCountdown: () =>
    set((state) => ({
      countdown: Math.max(0, state.countdown - 1),
    })),

  updateGestureFrequency: (gesture) =>
    set((state) => {
      const updatedFrequency = { ...state.gestureFrequency };
      updatedFrequency[gesture] = (updatedFrequency[gesture] || 0) + 1;
      return { gestureFrequency: updatedFrequency };
    }),

  resetGestureData: () =>
    set({
      currentGesture: null,
      currentConfidence: null,
      gestureFrequency: {},
      isProcessing: false,
      toastShownTimestamp: null,
    }),

  resetAllState: () =>
    set((state) => ({
      currentGesture: null,
      currentConfidence: null,
      guideText: '버튼을 누르면 검색이 진행됩니다',
      isPreparingGesture: false,
      preparationCountdown: 2,
      isCountingDown: false,
      countdown: 3,
      isErrorToastShown: false,
      isWebSocketConnected: false, // HTTP 연결 상태 초기화
      gestureFrequency: {},
      isProcessing: false,
      toastShownTimestamp: null,
      // 카운터는 유지 (매번 초기화되지 않도록)
      toastIdCounter: state.toastIdCounter,
    })),

  // 고유한 토스트 ID 생성
  getUniqueToastId: (prefix) => {
    const counter = get().toastIdCounter;
    set((state) => ({ toastIdCounter: state.toastIdCounter + 1 }));
    return `${prefix}-${counter}-${Date.now()}`;
  },

  // 제스처 분석
  getMostFrequentGesture: () => {
    const { gestureFrequency } = get();

    // 감지된 제스처가 없는 경우
    if (Object.keys(gestureFrequency).length === 0) {
      return null; // null 반환 (currentGesture 대신)
    }

    // 가장 빈번한 제스처 찾기
    let mostFrequentGesture = '';
    let maxCount = 0;

    Object.entries(gestureFrequency).forEach(([gesture, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostFrequentGesture = gesture;
      }
    });

    // 최소 인식 횟수 검증 (예: 2회 이상 인식된 경우만 유효하게 처리)
    if (maxCount < 2) {
      return null; // 인식 횟수가 적으면 null 반환
    }

    // '없음'인 경우에도 null 반환
    if (mostFrequentGesture === '없음') {
      return null;
    }

    return mostFrequentGesture || null; // currentGesture 대신 null 반환
  },
}));
