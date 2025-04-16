import { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import TypedWebCamera from './TypedWebCamera';

interface GestureQuizCameraProps {
  guidelineClassName?: string;
  guideText?: string;
  correctGestureName?: string | null;
  gestureType?: string;
  isPaused?: boolean;
  isTimeOut?: boolean;
  onCorrect?: (isCorrect: boolean) => void;
  onConnectionStatus?: (status: boolean) => void;
}

const GestureQuizCamera = ({
  guidelineClassName,
  guideText = '제스처를 유지해주세요.',
  correctGestureName,
  onCorrect,
  // 기본값은 'STATIC'으로 설정
  gestureType = 'STATIC',
  isPaused = false,
  isTimeOut = false,
  onConnectionStatus,
}: GestureQuizCameraProps) => {
  const [isCorrect, setIsCorrect] = useState(false);
  const [showGuideline, setShowGuideline] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // 컴포넌트 마운트 추적
  const isMountedRef = useRef(true);
  // 제스처 이벤트 처리 여부 추적
  const gestureProcessedRef = useRef(false);

  // 타이머 참조들
  const correctTimeRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);

  // resetSequence 함수 참조 추가
  const resetSequenceRef = useRef<(() => void) | null>(null);

  // 컨테이너 참조
  const containerRef = useRef<HTMLDivElement>(null);

  // 정규화된 제스처 타입을 계산 (TypedWebCamera로 전달될 타입)
  const normalizedGestureType = gestureType === 'DYNAMIC' ? 'DYNAMIC' : 'STATIC';

  // 컴포넌트 마운트/언마운트 처리
  useEffect(() => {
    console.log(
      `[GestureQuizCamera] 컴포넌트 마운트됨, 타입: ${gestureType}, 제스처: ${correctGestureName}`
    );
    isMountedRef.current = true;
    gestureProcessedRef.current = false;

    // 초기 상태 설정
    setCameraActive(true);
    setShowGuideline(true);
    setIsProcessing(false);
    setFeedbackMessage('');
    setIsCorrect(false);

    return () => {
      console.log('[GestureQuizCamera] 컴포넌트 언마운트됨');
      isMountedRef.current = false;

      // 모든 타이머 정리
      clearAllTimers();

      // API 연결 상태 초기화
      if (onConnectionStatus) {
        onConnectionStatus(false);
      }
    };
  }, [gestureType, correctGestureName, onConnectionStatus]);

  // 타이머 정리 함수
  const clearAllTimers = useCallback(() => {
    console.log('[GestureQuizCamera] 모든 타이머 정리');

    if (correctTimeRef.current) {
      clearTimeout(correctTimeRef.current);
      correctTimeRef.current = null;
    }

    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  // 인식 시작 함수
  const startGestureRecognition = useCallback(() => {
    // 컴포넌트가 언마운트된 경우 무시
    if (!isMountedRef.current) {
      console.log('[GestureQuizCamera] 컴포넌트 언마운트됨, 인식 시작 무시');
      return;
    }

    console.log('[GestureQuizCamera] 제스처 인식 시작');
    setCameraActive(true);
    setShowGuideline(true);
    setIsProcessing(false);
    setFeedbackMessage('');
    gestureProcessedRef.current = false;

    // resetSequence 함수가 있으면 호출
    if (resetSequenceRef.current) {
      console.log('[GestureQuizCamera] 🔄 제스처 인식 초기화 - 시퀀스 리셋');
      resetSequenceRef.current();
    }
  }, []);

  // 제스처 인식 처리 함수
  const handleGesture = useCallback(
    (gesture: string, confidence: number) => {
      // 처리 중이거나 카메라가 비활성화된 경우 무시
      if (
        !isMountedRef.current ||
        !cameraActive ||
        isProcessing ||
        isPaused ||
        isTimeOut ||
        gestureProcessedRef.current
      ) {
        console.log(`[GestureQuizCamera] 제스처 처리 무시: ${gesture}, 이유: 컴포넌트 상태`);
        return;
      }

      console.log(
        `[GestureQuizCamera] 🔍 제스처 이벤트: "${gesture}", 신뢰도: ${confidence}, 기대값: ${correctGestureName}, 타입: ${gestureType}`
      );

      // 인식 정확도가 너무 낮은 경우 무시
      if (confidence < 30) {
        console.log(`[GestureQuizCamera] 제스처 신뢰도 낮음: ${confidence}, 무시`);
        return;
      }

      // 처리 중 상태로 설정하여 중복 이벤트 방지
      setIsProcessing(true);

      if (gesture === correctGestureName) {
        console.log(`[GestureQuizCamera] ✅ 정답 제스처 감지: ${gesture}`);
        gestureProcessedRef.current = true;

        // 정답인 경우
        setIsCorrect(true);
        setShowGuideline(false);

        // 부모 컴포넌트에 정답 여부 알림
        if (onCorrect) {
          onCorrect(true);
        }

        // 시퀀스 리셋
        if (resetSequenceRef.current) {
          console.log('[GestureQuizCamera] 🔄 정답 후 시퀀스 리셋');
          resetSequenceRef.current();
        }

        // 2초 후 다시 인식 시작
        clearAllTimers();
        retryTimerRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            startGestureRecognition();
          }
        }, 2000);
      } else {
        // 아직 처리중이 아닌 경우에만 처리 해제
        setTimeout(() => {
          if (isMountedRef.current && !gestureProcessedRef.current) {
            console.log('[GestureQuizCamera] 제스처 불일치, 처리 상태 재설정');
            setIsProcessing(false);
          }
        }, 500);
      }
    },
    [
      cameraActive,
      correctGestureName,
      gestureType,
      isProcessing,
      isPaused,
      isTimeOut,
      clearAllTimers,
      startGestureRecognition,
      onCorrect,
    ]
  );

  // 외부에서 타임아웃 또는 일시 정지 상태 변경 시 처리
  useEffect(() => {
    console.log(`[GestureQuizCamera] 외부 상태 변경: isTimeOut=${isTimeOut}, isPaused=${isPaused}`);

    if (isTimeOut || isPaused) {
      console.log('[GestureQuizCamera] 타임아웃 또는 일시 정지 감지, 모든 타이머 정리');
      clearAllTimers();
      setIsProcessing(true);
      gestureProcessedRef.current = true;
    } else {
      // 새로운 인식 시작 - 상태가 재설정된 경우
      console.log('[GestureQuizCamera] 상태 활성화, 새 인식 시작');
      gestureProcessedRef.current = false;
      setIsProcessing(false);
    }
  }, [isTimeOut, isPaused, clearAllTimers]);

  // API 연결 상태 변경 핸들러
  const handleConnectionStatus = useCallback(
    (status: boolean) => {
      // 컴포넌트가 언마운트된 경우 무시
      if (!isMountedRef.current) {
        console.log(`[GestureQuizCamera] 컴포넌트 언마운트됨, API 상태 업데이트 무시: ${status}`);
        return;
      }

      console.log(`[GestureQuizCamera] 🌐 API 연결 상태: ${status ? '연결됨' : '연결 끊김'}`);
      setApiConnected(status);

      // 부모 컴포넌트에 API 연결 상태 전달
      if (onConnectionStatus) {
        onConnectionStatus(status);
      }
    },
    [onConnectionStatus]
  );

  return (
    <div
      ref={containerRef}
      className="w-full h-full aspect-square bg-white relative overflow-hidden rounded-lg drop-shadow-basic"
    >
      {/* 고정 비율 유지를 위한 래퍼 */}
      <div className="relative w-full h-full">
        {/* TypedWebCamera 컴포넌트 - cameraActive가 false일 때 숨김 처리 */}
        {cameraActive ? (
          <>
            <TypedWebCamera
              guidelineClassName={guidelineClassName}
              guideText={guideText}
              onConnectionStatus={handleConnectionStatus}
              isPaused={isPaused || isTimeOut || isProcessing}
              onGesture={handleGesture}
              showGuideline={showGuideline}
              gestureType={normalizedGestureType as 'STATIC' | 'DYNAMIC'}
              resetSequenceRef={resetSequenceRef}
            />

            {/* 피드백 메시지가 있고 처리 중일 때 살짝 어두운 오버레이 */}
            {feedbackMessage && isProcessing && !isCorrect && (
              <div className="absolute inset-0 bg-black/30 z-5"></div>
            )}
          </>
        ) : (
          // 카메라가 비활성화된 경우 검은 배경 표시
          <div className="w-full h-full bg-black flex justify-center items-center"></div>
        )}
      </div>
    </div>
  );
};

export default GestureQuizCamera;
