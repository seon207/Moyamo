import { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import TypedWebCamera from './TypedWebCamera';

interface GesturePracticeCameraProps {
  guidelineClassName?: string;
  guideText?: string;
  gestureLabel?: string;
  // 제스처 타입 prop - string 타입 유지
  gestureType?: string;
  onCorrect?: (isCorrect: boolean) => void;
}

const GesturePracticeCamera = ({
  guidelineClassName,
  guideText,
  gestureLabel,
  onCorrect,
  // 기본값은 'STATIC'으로 설정
  gestureType = 'STATIC',
}: GesturePracticeCameraProps) => {
  const [isCorrect, setIsCorrect] = useState(false);
  const [showGuideline, setShowGuideline] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  // 웹소켓 -> API 방식으로 변경: wsConnected -> apiConnected
  const [apiConnected, setApiConnected] = useState(false);

  // 추가: 안내 메시지 상태
  const [feedbackMessage, setFeedbackMessage] = useState('');
  // 추가: 다시 시도 타이머 참조
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);
  // 추가: 제스처 처리 중 상태
  const [isProcessing, setIsProcessing] = useState(false);

  // resetSequence 함수 참조 추가
  const resetSequenceRef = useRef<(() => void) | null>(null);

  // 컨테이너 참조
  const containerRef = useRef<HTMLDivElement>(null);
  const correctTimeRef = useRef<NodeJS.Timeout | null>(null);

  // 정규화된 제스처 타입을 계산 (TypedWebCamera로 전달될 타입)
  const normalizedGestureType = gestureType === 'DYNAMIC' ? 'DYNAMIC' : 'STATIC';

  // 추가: 타이머 정리 함수
  const clearAllTimers = useCallback(() => {
    if (correctTimeRef.current) {
      clearTimeout(correctTimeRef.current);
      correctTimeRef.current = null;
    }

    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  // 추가: 인식 시작 함수 - resetSequence 호출 추가
  const startGestureRecognition = useCallback(() => {
    setCameraActive(true);
    setShowGuideline(true);
    setIsProcessing(false);
    setFeedbackMessage('');

    // resetSequence 함수가 있으면 호출
    if (resetSequenceRef.current) {
      console.log('[🔄 제스처 인식 초기화] 시퀀스 리셋');
      resetSequenceRef.current();
    } else {
      console.log('[⚠️ 경고] resetSequenceRef.current가 null입니다.');
    }
  }, []);

  const handleGesture = useCallback(
    (gesture: string, confidence: number) => {
      // 처리 중이거나 카메라가 비활성화된 경우 무시
      if (!cameraActive || isProcessing) {
        return;
      }

      console.log(
        `[🔍 제스처 이벤트] "${gesture}", "confidence": ${confidence}, "expected": ${gestureLabel}, "type": ${gestureType}`
      );

      // 인식 정확도가 너무 낮은 경우 무시
      if (confidence < 30) {
        return;
      }

      // 처리 중 상태로 설정하여 중복 이벤트 방지
      setIsProcessing(true);

      if (gesture === gestureLabel) {
        // 정답인 경우
        setIsCorrect(true);
        setShowGuideline(false);

        // 부모 컴포넌트에 정답 여부 알림 (콜백 함수가 있는 경우에만)
        if (onCorrect) {
          onCorrect(true);
        }

        // 정답 표시 후 일정 시간 후에 다시하기 버튼 표시
        clearAllTimers();
        correctTimeRef.current = setTimeout(() => {
          setIsCorrect(false);
          // 카메라 비활성화는 정답 표시가 사라진 후(다시하기 버튼이 나타날 때)
          setCameraActive(false);
        }, 1000);
      } else {
        // 오답인 경우
        setShowGuideline(false);
        // 화면에 배경 어둡게 하기 위해 isProcessing 설정
        setIsProcessing(true);
        setFeedbackMessage('다시 시도해주세요.');

        // 시퀀스 리셋 추가
        if (resetSequenceRef.current) {
          console.log('[🔄 오답 후 시퀀스 리셋]');
          resetSequenceRef.current();
        }

        // 2초 후 다시 인식 시작
        clearAllTimers();
        retryTimerRef.current = setTimeout(() => {
          startGestureRecognition();
        }, 2000);
      }
    },
    [cameraActive, gestureLabel, gestureType, isProcessing, clearAllTimers, startGestureRecognition]
  );

  const handleRestart = useCallback(() => {
    clearAllTimers();
    setIsCorrect(false);
    startGestureRecognition();
  }, [clearAllTimers, startGestureRecognition]);

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  // API 연결 상태를 받는 콜백 함수
  const handleConnectionStatus = useCallback((status: boolean) => {
    setApiConnected(status);
    console.log(`[🌐 API 연결 상태] ${status ? '연결됨' : '연결 끊김'}`);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full aspect-square bg-white relative overflow-hidden rounded-lg drop-shadow-basic"
    >
      {/* 고정 비율 유지를 위한 래퍼 */}
      <div className="relative w-full h-full">
        {/* TypedWebCamera 컴포넌트 사용 - cameraActive가 false일 때 숨김 처리 */}
        {cameraActive ? (
          <>
            <TypedWebCamera
              guidelineClassName={guidelineClassName}
              guideText={guideText} // 피드백 메시지는 별도로 표시
              onConnectionStatus={handleConnectionStatus}
              isPaused={!cameraActive || isProcessing} // 처리 중일 때도 일시 정지
              onGesture={handleGesture}
              showGuideline={showGuideline}
              gestureType={normalizedGestureType as 'STATIC' | 'DYNAMIC'} // 타입 변환
              resetSequenceRef={resetSequenceRef} // 참조 전달
            />

            {/* 피드백 메시지가 있고 처리 중일 때 살짝 어두운 오버레이 추가 */}
            {feedbackMessage && isProcessing && !isCorrect && (
              <div className="absolute inset-0 bg-black/30 z-5"></div>
            )}
          </>
        ) : (
          // 카메라가 비활성화된 경우 검은 배경 표시
          <div className="w-full h-full bg-black flex justify-center items-center"></div>
        )}

        {isCorrect && (
          <div className="absolute inset-0 flex justify-center items-center z-10 pointer-events-none">
            <img
              src="/images/correct_mark.svg"
              alt="correct_mark"
              className="w-50 lg:w-80 max-w-[70%]"
            />
          </div>
        )}

        {/* 피드백 메시지 표시 (오답 및 안내) - 화면 중앙에 표시 */}
        {feedbackMessage && !isCorrect && cameraActive && (
          <div className="absolute inset-0 flex justify-center items-center z-10 pointer-events-none">
            <div className="bg-kr-400/70 text-white px-4 py-3 rounded-xl text-base sm:text-lg max-w-[80%] text-center shadow-lg font-[NanumSquareRoundB]">
              {feedbackMessage}
            </div>
          </div>
        )}

        {/* 카메라 비활성화 시 오버레이 및 다시하기 버튼 */}
        {!cameraActive && !isCorrect && (
          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center z-20">
            <button
              className="bg-kr-400 hover:bg-kr-500 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 md:py-3 md:px-8 rounded-full shadow-md transition-colors text-md lg:text-lg"
              onClick={handleRestart}
            >
              <FontAwesomeIcon icon={faRotateRight} className="mr-1 sm:mr-2" />
              <span> 다시 연습하기</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GesturePracticeCamera;
