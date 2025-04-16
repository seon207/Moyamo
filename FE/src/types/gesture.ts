// 제스처 감지 이벤트 타입 정의
export interface GestureDetectedEvent extends CustomEvent {
  detail: {
    gesture: string;
    confidence: number;
  };
}

// 가이드 텍스트 상태
export type GuideTextState =
  | '버튼을 누른 뒤 손 전체가 화면에 나오게 준비해 주세요'
  | '검색할 제스처를 준비하며 손 전체가 화면에 보이게 해 주세요'
  | '인식중입니다. 동일한 제스처를 계속 유지해주세요'
  | '인식 완료!'
  | '다른 제스처로 다시 시도해 주세요'
  | '버튼을 눌러 다시 시도해 주세요';

// 제스처 감지 상태 타입
export interface GestureDetectionState {
  currentGesture: string | null;
  currentConfidence: number | null;
  guideText: GuideTextState;
  isPreparingGesture: boolean;
  isCountingDown: boolean;
  preparationCountdown: number;
  countdown: number;
  isErrorToastShown: boolean;
  isWebSocketConnected: boolean;
}

// 제스처 빈도 기록 타입
export type GestureFrequency = Record<string, number>;

// 웹캠 컴포넌트 props 타입
export interface WebCameraProps {
  guidelineClassName?: string;
  guideText: string;
  onConnectionStatus: (status: boolean) => void;
  isPaused: boolean;
}
