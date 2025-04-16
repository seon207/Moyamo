import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';

// 컴포넌트
import CameraDialogHeader from './CameraDialogHeader';
import CameraDialogContent from './CameraDialogContent';
import CameraDialogFooter from './CameraDialogFooter';

// 커스텀 훅
import { useGestureEvents } from '@/hooks/useGestureEvents';
import { useZoomPrevention } from '@/hooks/useZoomPrevention';

// 유틸리티
import { isSensitiveGesture, isSearchableGesture } from '@/utils/sensitiveGestureUtils';

// 가이드 텍스트 상수 정의
const GUIDE_TEXT = {
  INITIAL: '버튼을 누른 뒤 검색할 제스처를 준비해 주세요',
  PREPARE: '손 전체가 화면에 보이도록 준비해 주세요',
  COUNTDOWN: '인식중입니다. 동일한 제스처를 계속 유지해 주세요',
  WAITING: '잠시 기다려 주세요⋯⋯',
  SUCCESS: '인식 완료!',
  ERROR_HAND: '버튼을 눌러 다시 시도해 주세요',
  ERROR_GESTURE: '버튼을 눌러 다시 시도해 주세요',
  ERROR_INAPPROPRIATE: '다른 제스처로 다시 시도해 주세요'
};

declare global {
  interface Window {
    resetGestureSequence?: () => void;
    startCollectingFrames?: () => void;
    lastDetectedGesture?: {
      gesture: string;
      confidence: number;
    };
    stopGestureAPI?: () => void;
    stopWebcam?: () => void;
  }
}

function SearchCameraModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // 타이머 ID 관리를 위한 refs
  const prepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const waitingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 프레임 수집 상태 ref
  const isCollectingFramesRef = useRef(false);
  
  // Dialog 컴포넌트 강제 언마운트를 위한 키
  const [dialogKey, setDialogKey] = useState(0);

  // 상태 관리
  const [apiActive, setApiActive] = useState(false);
  const [guideText, setGuideText] = useState(GUIDE_TEXT.INITIAL);
  const [isPreparingGesture, setIsPreparingGesture] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isWaitingForProcessing, setIsWaitingForProcessing] = useState(false);
  const [preparationCountdown, setPreparationCountdown] = useState(2);
  const [countdown, setCountdown] = useState(3);
  const [waitingCountdown, setWaitingCountdown] = useState(1);
  const [isApiConnected, setIsApiConnected] = useState(true);
  const [isErrorToastShown, setIsErrorToastShown] = useState(false);

  // 제스처 관련 상태
  const [detectedGesture, setDetectedGesture] = useState<string | null>(null);
  const [lastConfidence, setLastConfidence] = useState<number>(0);
  const [handDetected, setHandDetected] = useState(false);
  const handDetectedRef = useRef(handDetected);

  useZoomPrevention();

  // 디버깅용 가이드 텍스트 로깅
  useEffect(() => {
    console.log(`[🔤 가이드 텍스트 변경] ${guideText}`);
  }, [guideText]);

  // 손 감지 상태 추적
  useEffect(() => {
    handDetectedRef.current = handDetected;
    console.log(`[🖐️ 손 감지 상태 변경] ${handDetected}`);
  }, [handDetected]);

  // 모든 타이머 정리 함수
  const clearAllTimers = useCallback(() => {
    console.log('[🧹 모든 타이머 정리]');
    
    if (prepTimerRef.current) {
      clearInterval(prepTimerRef.current);
      prepTimerRef.current = null;
    }

    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    if (waitingTimerRef.current) {
      clearInterval(waitingTimerRef.current);
      waitingTimerRef.current = null;
    }

    if (navigationTimerRef.current) {
      clearTimeout(navigationTimerRef.current);
      navigationTimerRef.current = null;
    }
  }, []);

  // 웹캠 강제 종료 함수
  const forceStopWebcam = useCallback(() => {
    console.log('[🎥 웹캠 강제 종료 시도]');
    
    // 전역 함수로 설정된 웹캠 정지 함수 호출
    if (window.stopWebcam) {
      console.log('[🎥 전역 웹캠 종료 함수 호출]');
      window.stopWebcam();
    }
    
    // 다이얼로그 강제 재생성 트리거
    setDialogKey(prev => prev + 1);
    
    // API 관련 작업 중지
    if (window.stopGestureAPI) {
      window.stopGestureAPI();
    }
  }, []);

  // 대기 타이머 (프레임 수집 후)
  const startWaitingTimer = useCallback(() => {
    if (!open) return;

    console.log('[⏱️ 대기 타이머] 시작');

    // 카운트다운 종료, 대기 상태 시작
    setIsCountingDown(false);
    setIsWaitingForProcessing(true);
    setWaitingCountdown(1);
    setGuideText(GUIDE_TEXT.WAITING);

    // 손 감지 상태 변수 - 타이머 내에서 유지
    let handDetectionOccurred = false;
    
    // 최종 제스처를 저장할 변수
    let finalGesture: string | null = null;
    
    console.log(`[🖐️ 대기 타이머 시작 시 손 감지 상태] ${handDetectedRef.current}`);
    
    // 초기 상태가 true면 이미 손이 감지된 것
    if (handDetectedRef.current) {
      handDetectionOccurred = true;
    }

    // 제스처 감지 이벤트 핸들러
    const gestureHandler = (event: Event) => {
      const gestureEvent = event as CustomEvent<{ gesture: string; confidence: number }>;
      if (gestureEvent.detail && gestureEvent.detail.gesture) {
        finalGesture = gestureEvent.detail.gesture;
        console.log(`[🖐️ 대기 중 제스처 캡처] ${finalGesture}`);
        // 제스처가 감지되었다면 손도 감지된 것
        handDetectionOccurred = true;

        // 실시간으로 상태 업데이트
        setDetectedGesture(finalGesture);
        setLastConfidence(gestureEvent.detail.confidence);
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener('gesture-detected', gestureHandler);

    // 대기 카운트다운
    let waitCount = 1;
    const waitInterval = setInterval(() => {
      // 모달이 닫혔으면 타이머 중지
      if (!open) {
        clearInterval(waitInterval);
        window.removeEventListener('gesture-detected', gestureHandler);
        return;
      }

      // 현재 손 감지 상태 확인
      if (handDetectedRef.current) {
        handDetectionOccurred = true;
        console.log('[🖐️ 손 감지 발생]');
      }

      waitCount--;
      setWaitingCountdown(waitCount);

      if (waitCount <= 0) {
        clearInterval(waitInterval);
        waitingTimerRef.current = null;

        // 리스너 제거
        window.removeEventListener('gesture-detected', gestureHandler);

        // 대기 상태 종료
        setIsWaitingForProcessing(false);

        // 마지막 손 감지 상태 확인
        if (handDetectedRef.current) {
          handDetectionOccurred = true;
        }

        // 전역 변수에서 제스처 가져오기
        if (!finalGesture && window.lastDetectedGesture) {
          finalGesture = window.lastDetectedGesture.gesture;
          console.log(`[🖐️ 전역 변수에서 제스처 가져옴] ${finalGesture}`);
          // 제스처가 있다면 손도 감지된 것
          if (window.lastDetectedGesture.gesture) {
            handDetectionOccurred = true;
          }
        }

        // 최종 제스처 선택
        const gestureToUse = finalGesture || detectedGesture;
        console.log(`[🔍 사용할 최종 제스처] ${gestureToUse || '없음'}`);
        console.log(`[🖐️ 최종 손 감지 상태] ${handDetectionOccurred}`);

        // API 비활성화
        setApiActive(false);
        isCollectingFramesRef.current = false;

        // 모달이 여전히 열려있는지 확인 후 처리
        if (!open) return;

        // 1. 손 감지가 일어나지 않았을 때 - 강제 조건 추가
        if (!handDetectionOccurred) {
          console.log('[🚨 손 감지 실패] 토스트 표시');
          
          // 토스트를 강제로 모두 제거 후 새로 표시
          toast.dismiss();
          
          // 비동기적으로 토스트 표시 (다음 틱에)
          setTimeout(() => {
            toast.info('손 감지 경고', {
              description:
                '손이 카메라에 인식되지 않았습니다. 손을 화면 내에 전부 들어가게 해주세요.',
              duration: 3000,
              position: 'top-right',
              icon: '👋',
            });
          }, 0);

          setGuideText(GUIDE_TEXT.ERROR_HAND);
          setIsErrorToastShown(true);
          return;
        }

        // 2. API 결과가 none인 경우 또는 제스처가 감지되지 않은 경우
        if (!gestureToUse || gestureToUse === '없음' || gestureToUse === 'none') {
          toast.dismiss();
          setTimeout(() => {
            toast.warning('제스처 인식 오류', {
              description: '유효한 제스처가 감지되지 않았습니다. 다시 시도해 주세요.',
              duration: 3000,
              position: 'top-right',
              icon: '⚠️',
            });
          }, 0);

          setGuideText(GUIDE_TEXT.ERROR_GESTURE);
          setIsErrorToastShown(true);
          return;
        }

        // 3. 민감한 제스처지만 검색 불가능한 경우 (middle_finger 등)
        if (isSensitiveGesture(gestureToUse) && !isSearchableGesture(gestureToUse)) {
          toast.dismiss();
          setTimeout(() => {
            toast.error('부적절한 제스처가 감지되었습니다', {
              description: '상대방을 존중하는 제스처를 사용해 주세요.',
              duration: 3000,
              position: 'top-right',
              icon: '🚫',
            });
          }, 0);

          setGuideText(GUIDE_TEXT.ERROR_INAPPROPRIATE);
          setIsErrorToastShown(true);
          return;
        }

        // 4. 일반 제스처 또는 검색 가능한 민감한 제스처 (devil 등)
        console.log(`[🔍 검색 실행] 제스처: ${gestureToUse}`);
        setGuideText(GUIDE_TEXT.SUCCESS);

        // 민감한 제스처인지 확인하여 파라미터에 추가
        const isSensitive = isSensitiveGesture(gestureToUse) ? '&sensitive=true' : '';
        
        // 약간의 지연 후 페이지 이동
        const targetUrl = `/search/camera?gesture_label=${gestureToUse}${isSensitive}`;
        navigationTimerRef.current = setTimeout(() => {
          if (!open) return;

          try {
            if (location.pathname.includes('/search')) {
              window.location.href = targetUrl;
            } else {
              navigate(targetUrl);
            }
            setOpen(false);
          } catch (error) {
            console.error('[🔍 검색 이동 실패]', error);
            toast.error('검색 페이지로 이동하는 중 오류가 발생했습니다');
          }
        }, 500);
      }
    }, 1000);

    // 타이머 ID 저장
    waitingTimerRef.current = waitInterval;

    return () => {
      clearInterval(waitInterval);
      window.removeEventListener('gesture-detected', gestureHandler);
    };
  }, [detectedGesture, location.pathname, navigate, open]);


  // 실제 카운트다운 타이머
  const startCountdownTimer = useCallback(() => {
    if (!open) return;

    console.log('[⏱️ 카운트다운 타이머] 시작');

    // 준비 단계 종료, 카운트다운 시작
    setIsPreparingGesture(false);
    setIsCountingDown(true);
    setCountdown(3);
    setGuideText(GUIDE_TEXT.COUNTDOWN);

    // 이 시점에서 프레임 수집 시작
    if (window.startCollectingFrames && !isCollectingFramesRef.current) {
      console.log('[🎬 프레임 수집 시작 요청] - 카운트다운 타이머');
      window.startCollectingFrames();
      isCollectingFramesRef.current = true;
    }

    // 카운트다운
    let count = 3;
    const countInterval = setInterval(() => {
      // 모달이 닫혔으면 타이머 중지
      if (!open) {
        clearInterval(countInterval);
        return;
      }

      count--;
      setCountdown(count);
      console.log(`[⏱️ 카운트다운] ${count}초 남음, 현재 손 감지 상태: ${handDetectedRef.current}`);

      if (count <= 0) {
        clearInterval(countInterval);
        countdownTimerRef.current = null;

        // 대기 타이머 시작
        startWaitingTimer();
      }
    }, 1000);

    // 타이머 ID 저장
    countdownTimerRef.current = countInterval;

    return () => {
      clearInterval(countInterval);
    };
  }, [open, startWaitingTimer]);

  // 준비 타이머
  const startPreparationTimer = useCallback(() => {
    if (!open || isPreparingGesture || isCountingDown || isWaitingForProcessing) {
      return;
    }

    console.log('[⏱️ 준비 타이머] 시작');

    // 준비 상태 설정
    setIsPreparingGesture(true);
    setPreparationCountdown(2);
    setGuideText(GUIDE_TEXT.PREPARE);

    // API 활성화
    setApiActive(true);

    // 준비 카운트다운
    let prepCountdown = 2;
    const prepInterval = setInterval(() => {
      if (!open) {
        clearInterval(prepInterval);
        return;
      }

      prepCountdown--;
      setPreparationCountdown(prepCountdown);

      if (prepCountdown <= 0) {
        clearInterval(prepInterval);
        prepTimerRef.current = null;
        // 여기서 직접 함수 호출
        startCountdownTimer();
      }
    }, 1000);

    // 타이머 ID 저장
    prepTimerRef.current = prepInterval;
  }, [
    isPreparingGesture,
    isCountingDown,
    isWaitingForProcessing,
    open,
    startCountdownTimer,
  ]);

  // 손 감지 콜백 - 메세지 줄이고 불필요한 업데이트 제한
  const handleHandDetected = useCallback((detected: boolean) => {
    // 값이 변경될 때만 로그 출력 (줄이기 위해)
    if (detected !== handDetectedRef.current) {
      console.log(`[🖐️ 손 감지 상태 변경] ${detected}`);
    }
    
    // ref는 항상 최신 상태 유지
    handDetectedRef.current = detected;
    
    // 상태 업데이트 (UI 반영용)
    setHandDetected(detected);
  }, []);

  // 제스처 감지 이벤트 처리
  const handleGestureDetected = useCallback(
    (gesture: string, confidence: number) => {
      if (!open) return;

      if ((isCountingDown || isWaitingForProcessing) && apiActive) {
        console.log(`[🖐️ 제스처 감지] ${gesture} (신뢰도: ${confidence})`);
        setDetectedGesture(gesture);
        setLastConfidence(confidence);
      }
    },
    [isCountingDown, isWaitingForProcessing, apiActive, open]
  );

  // 모든 상태 초기화
  const resetAllState = useCallback(() => {
    console.log('[🔄 모든 상태 초기화]');

    // 모든 타이머 정리
    clearAllTimers();

    // 상태 초기화 (한 번에 모든 상태 초기화)
    setIsPreparingGesture(false);
    setIsCountingDown(false);
    setIsWaitingForProcessing(false);
    setPreparationCountdown(2);
    setCountdown(3);
    setWaitingCountdown(1);
    setIsErrorToastShown(false);
    setDetectedGesture(null);
    setLastConfidence(0);
    setApiActive(false);
    setHandDetected(false); // 손 감지 상태 명시적 초기화
    setGuideText(GUIDE_TEXT.INITIAL);
    
    handDetectedRef.current = false;
    isCollectingFramesRef.current = false;

    // 토스트 메시지 모두 제거
    toast.dismiss();

    // 전역 저장된 이전 제스처 결과 초기화
    window.lastDetectedGesture = undefined;

    // API 시퀀스도 초기화 (전역 함수 활용)
    if (window.resetGestureSequence) {
      console.log('[🔄 제스처 시퀀스 리셋]');
      window.resetGestureSequence();
    }

    // API 강제 중지 함수 호출
    if (window.stopGestureAPI) {
      console.log('[🛑 API 강제 중지 요청]');
      window.stopGestureAPI();
    }
  }, [clearAllTimers]);

  // 제스처 이벤트 훅 사용
  useGestureEvents({
    isOpen: open,
    isPaused: !apiActive || !open, // 모달이 닫혔거나 API가 비활성화되면 일시정지
    onGestureDetected: handleGestureDetected,
  });

  // 캡처 버튼 클릭 핸들러 - 간소화
  const handleCaptureClick = useCallback(() => {
    if (!open || isPreparingGesture || isCountingDown || isWaitingForProcessing) {
      return;
    }

    console.log('[🔘 캡처 버튼 클릭]');

    // 토스트 메시지 모두 제거
    toast.dismiss();

    // 타이머 정리
    clearAllTimers();

    // 상태 초기화 - 최소한의 필요한 상태만 재설정
    setIsErrorToastShown(false);
    setDetectedGesture(null);
    setLastConfidence(0);
    
    // 손 감지 상태 명시적 초기화 (중요)
    setHandDetected(false);
    handDetectedRef.current = false;
    
    // 전역 저장된 이전 제스처 결과 초기화
    window.lastDetectedGesture = undefined;

    // API 시퀀스 초기화 (전역 함수 사용)
    if (window.resetGestureSequence) {
      window.resetGestureSequence();
    }

    // API 비활성화
    setApiActive(false);

    // 약간의 지연 후 타이머 시작
    setTimeout(() => {
      if (!open) return;

      setApiActive(true);
      startPreparationTimer(); // 준비 타이머에서 나머지 상태 설정
    }, 300);
  }, [
    isPreparingGesture,
    isCountingDown,
    isWaitingForProcessing,
    open,
    clearAllTimers,
    startPreparationTimer,
  ]);

  // 연결 상태 콜백
  const handleConnectionStatus = useCallback((status: boolean) => {
    setIsApiConnected(status);
  }, []);

  // 모달 열기/닫기 처리
  const handleDialogOpenChange = useCallback(
    (isOpen: boolean) => {
      console.log(`[🔄 모달 상태 변경] ${open} -> ${isOpen}`);
      
      // 모달이 닫히는 경우, 즉시 리소스 정리 작업 수행
      if (!isOpen && open) {
        console.log('[🔄 모달 닫힘] 즉시 API 중지');
        
        // 즉시 API 비활성화
        setApiActive(false);
        
        // 즉시 모든 타이머 정리
        clearAllTimers();
        
        // 토스트 메시지 모두 제거
        toast.dismiss();
        
        // 웹캠 강제 종료 시도
        forceStopWebcam();
        
        // 상태 업데이트
        setOpen(false);
        
        // 상태 초기화
        resetAllState();
        
        return; // 중요: 여기서 종료하여 아래 setOpen이 다시 호출되지 않도록 함
      }
      
      // 상태 업데이트 (닫기인 경우는 위에서 이미 처리했음)
      setOpen(isOpen);
      
      // 열림 상태인 경우 처리
      if (isOpen) {
        console.log('[🔄 모달 열림]');
        resetAllState();
      }
    },
    [resetAllState, clearAllTimers, open, forceStopWebcam]
  );

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      console.log('[🧹 컴포넌트 언마운트] 정리 작업');
      clearAllTimers();
      toast.dismiss();

      // API 관련 작업 중지
      if (window.stopGestureAPI) {
        window.stopGestureAPI();
      }
      
      // 웹캠 강제 종료
      if (window.stopWebcam) {
        window.stopWebcam();
      }

      // 전역 함수 제거
      window.resetGestureSequence = undefined;
      window.startCollectingFrames = undefined;
      window.stopGestureAPI = undefined;
      window.stopWebcam = undefined;
    };
  }, [clearAllTimers]);

  // 전역 함수 등록 (컴포넌트 초기화 시 1회)
  useEffect(() => {
    if (!window.stopGestureAPI) {
      console.log('[🛑 전역 API 중지 함수 등록]');
      window.stopGestureAPI = () => {
        console.log('[🛑 API 강제 중지 실행]');
        isCollectingFramesRef.current = false;
      };
    }

    // 중요: startCollectingFrames 전역 함수가 이미 등록되어 있는지 확인
    if (!window.startCollectingFrames) {
      console.log('[🎬 전역 프레임 수집 시작 함수 등록]');
      window.startCollectingFrames = () => {
        console.log('[🎬 전역에서 프레임 수집 시작!]');
        isCollectingFramesRef.current = true;
      };
    }
    
    // 모달이 처음 로드될 때 전역 저장된 이전 제스처 결과 초기화
    window.lastDetectedGesture = undefined;
  }, []);

  // 모달이 열릴 때마다 전역 저장된 제스처 결과 초기화
  useEffect(() => {
    if (open) {
      console.log('[🔄 모달 열림] 이전 제스처 결과 초기화');
      window.lastDetectedGesture = undefined;
    }
  }, [open]);

  return (
    <Dialog 
      key={`dialog-${dialogKey}`}
      open={open} 
      onOpenChange={handleDialogOpenChange}
    >
      <DialogTrigger asChild>
        <button
          onClick={() => setOpen(true)}
          className="flex flex-col items-center
          bg-transparent border-none 
          cursor-pointer"
        >
          <Camera className="w-6 h-6 cursor-pointer text-gray-600 dark:text-d-txt-50" />
        </button>
      </DialogTrigger>

      <DialogContent
        className="p-0 w-[95vw] sm:w-[450px] max-w-[500px] max-h-[90vh]
        rounded-2xl border-none
        mx-auto overflow-hidden
        dark:text-d-txt-50"
      >
        {/* 전체 컨테이너 */}
        <div className="flex flex-col rounded-2xl overflow-hidden">
          {/* 헤더 부분 */}
          <CameraDialogHeader />

          {/* 카메라 영역 */}
          {open && (
            <CameraDialogContent
              open={open}
              guideText={guideText}
              onConnectionStatus={handleConnectionStatus}
              isPaused={!apiActive || !open}
              onHandDetected={handleHandDetected}
            />
          )}

          <div className="h-2 bg-none"></div>

          {/* 하단 버튼 영역 */}
          <CameraDialogFooter
            isPreparingGesture={isPreparingGesture}
            isCountingDown={isCountingDown}
            isWaitingForProcessing={isWaitingForProcessing}
            preparationCountdown={preparationCountdown}
            countdown={countdown}
            waitingCountdown={waitingCountdown}
            isErrorToastShown={isErrorToastShown}
            isWebSocketConnected={isApiConnected}
            onCaptureClick={handleCaptureClick}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SearchCameraModal;