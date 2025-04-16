import { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { HandLandmarkerResult } from '@mediapipe/tasks-vision';
import { useHandLandmarker } from '@/hooks/useHandLandmarker';
import { useGestureHttpApi } from '@/hooks/useGestureHttpApi';
import { toast } from 'sonner'; // Sonner의 toast 함수 가져오기

interface WebCameraProps {
  // 가이드라인 svg 조절 props
  guidelineClassName?: string;
  guideText?: string;
  // 연결 상태를 외부에서 제어할 수 있도록 추가
  onConnectionStatus?: (status: boolean) => void;
  isPaused?: boolean;
  onGesture?: (gesture: string, confidence: number) => void;
  // 가이드라인 표시 여부 제어
  showGuideline?: boolean;
  onHandDetected?: (detected: boolean) => void;
  // 웹캠 접근 차단 시 콜백 추가
  onCameraBlocked?: () => void;
  onResetSequence?: (resetFn: () => void) => void;
  onStartCollectingFrames?: (startFn: () => void) => void;
}

const WebCamera = ({
  guidelineClassName,
  guideText,
  onConnectionStatus,
  isPaused = true,
  onGesture,
  showGuideline = true,
  onHandDetected,
  onCameraBlocked,
  onResetSequence,
  onStartCollectingFrames,
}: WebCameraProps) => {
  // HandLandmarker 훅 사용
  const { isLoading, error, detectFrame, HAND_CONNECTIONS, drawLandmarks, drawConnectors } =
    useHandLandmarker();

  // HTTP API 서비스 사용
  const {
    status: apiStatus,
    gesture,
    confidence,
    sendLandmarks,
    connect: connectApi,
    disconnect: disconnectApi,
    resetSequence,
    startCollectingFrames,
  } = useGestureHttpApi();

  // 컴포넌트 상태 및 참조
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isCameraBlocked, setIsCameraBlocked] = useState(false);

  // API 연결 상태 콜백
  useEffect(() => {
    if (onConnectionStatus) {
      onConnectionStatus(!isCameraBlocked); // 카메라 차단 상태를 반영
    }
  }, [onConnectionStatus, isCameraBlocked]);

  // 토스트 메시지 중복 방지를 위한 참조
  const blockToastShown = useRef(false);

  // 웹캠 초기화 및 접근 오류 처리
  useEffect(() => {
    const initializeWebcam = async () => {
      try {
        // 사용자 미디어 권한 요청
        await navigator.mediaDevices.getUserMedia({ video: true });
        setIsCameraBlocked(false);
        blockToastShown.current = false; // 카메라 사용 가능해지면 토스트 상태 초기화
      } catch (error) {
        console.error('[🎥 웹캠 접근 오류]', error);
        setIsCameraBlocked(true);
        
        // 웹캠 접근 거부 시 토스트 메시지 표시 (중복 방지)
        if (!blockToastShown.current) {
          toast.error('웹캠 접근이 차단되었습니다', {
            description: '브라우저의 카메라 권한 허용 후 다시 시도해 주세요.',
            position: 'top-right',
            icon: '⚠️',
            duration: 3000,
          });
          blockToastShown.current = true;
        }
        
        // 콜백 함수가 제공된 경우 호출
        if (onCameraBlocked) {
          onCameraBlocked();
        }
      }
    };

    initializeWebcam();
  }, [onCameraBlocked]);

  // API 상태 관리 - 별도 useEffect로 분리
  useEffect(() => {
    // 카메라가 차단되었거나 isPaused가 true이면 API 연결 중단
    if (isCameraBlocked) {
      if (apiStatus === 'open') {
        console.log('[🌐 API 연결 해제] 카메라 차단 상태');
        disconnectApi();
        resetSequence();
      }
      return;
    }
  
    // isPaused가 false일 때만 API 연결
    if (!isPaused && apiStatus === 'closed') {
      console.log('[🌐 API 연결 시작]');
      resetSequence(); // 시퀀스 초기화 후 연결 시작
      connectApi();
    }
    // isPaused가 true일 때 API 연결 해제
    else if (isPaused && apiStatus === 'open') {
      console.log('[🌐 API 연결 해제]');
      disconnectApi();
      resetSequence(); // 연결 해제 시 시퀀스 초기화
    }
  
    // 컴포넌트 언마운트 시 API 연결 해제
    return () => {
      if (apiStatus === 'open') {
        disconnectApi();
        resetSequence(); // 연결 해제 시 시퀀스 초기화
      }
    };
  }, [isPaused, apiStatus, connectApi, disconnectApi, resetSequence, isCameraBlocked]);
  
  // 화면 방향 제어를 위한 useEffect 추가
  useEffect(() => {
    // 현재 방향을 유지하는 함수
    const maintainCurrentOrientation = async () => {
      try {
        // Screen Orientation API 타입 체크 및 적용
        if (screen.orientation && 'lock' in screen.orientation) {
          // 현재 방향 가져오기
          const currentOrientation = screen.orientation.type;
          console.log('[📱 현재 화면 방향]', currentOrientation);
          
          // lock 메서드가 있는지 확인 후 사용
          const orientationLock = screen.orientation as any;
          await orientationLock.lock(currentOrientation);
          console.log('[📱 화면 방향] 현재 방향으로 고정됨:', currentOrientation);
        } else {
          console.log('[📱 화면 방향] Screen Orientation API가 지원되지 않습니다');
        }
      } catch (error) {
        console.error('[📱 화면 방향 설정 실패]', error);
      }
    };

    // 카메라가 차단되지 않았을 때만 화면 방향 설정 시도
    if (!isCameraBlocked) {
      maintainCurrentOrientation();
    }

    // 컴포넌트 언마운트 시 화면 방향 잠금 해제
    return () => {
      try {
        if (screen.orientation && 'unlock' in screen.orientation) {
          const orientationLock = screen.orientation as any;
          orientationLock.unlock();
          console.log('[📱 화면 방향] 잠금 해제됨');
        }
      } catch (error) {
        console.error('[📱 화면 방향 잠금 해제 실패]', error);
      }
    };
  }, [isCameraBlocked]);
    
  useEffect(() => {
    if (onResetSequence) {
      onResetSequence(resetSequence);
    }
  }, [resetSequence, onResetSequence]);

  // 부모 컴포넌트에 startCollectingFrames 함수 전달
  useEffect(() => {
    if (onStartCollectingFrames) {
      onStartCollectingFrames(startCollectingFrames);
    }
  }, [startCollectingFrames, onStartCollectingFrames]);

  // 제스처 정보가 변경될 때만 이벤트 발행
  useEffect(() => {
    // 카메라가 차단되었거나 isPaused가 true이면 처리하지 않음
    if (isCameraBlocked || isPaused) return;

    // 제스처 감지 시 이벤트 발행
    if (gesture) {
      console.log(`[🖐️ 제스처 감지] ${gesture} (신뢰도: ${confidence || 0})`);

      // 새 이벤트를 발행하기 전에 이벤트 발행 지연 (중복 방지)
      setTimeout(() => {
        // 이미 모달이 닫혔거나 isPaused 상태가 변경되었으면 이벤트 발행 취소
        if (isPaused || isCameraBlocked) {
          console.log('[🖐️ 제스처 이벤트 취소] 일시 정지 상태 또는 카메라 차단 상태');
          return;
        }

        // 커스텀 이벤트 생성하여 제스처 데이터 전달
        const gestureEvent = new CustomEvent('gesture-detected', {
          detail: { gesture, confidence },
        });

        // 이벤트 발행
        window.dispatchEvent(gestureEvent);
        console.log(`[🖐️ 제스처 이벤트 발행] ${gesture}`);

        // onGesture 콜백이 있으면 호출
        if (onGesture) {
          onGesture(gesture, confidence || 0);
        }
      }, 100);
    }
  }, [gesture, confidence, isPaused, onGesture, isCameraBlocked]);

  // 캔버스에 랜드마크 그리기 함수
  const drawCanvas = useCallback(
    (results: HandLandmarkerResult) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const canvasCtx = canvas.getContext('2d');
      if (!canvasCtx) return;

      const width = canvas.width;
      const height = canvas.height;

      // 캔버스 초기화
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, width, height);

      // 정사각형 영역에 비디오 그리기
      if (webcamRef.current?.video) {
        const video = webcamRef.current.video;

        // 정사각형 크기 계산
        const size = Math.min(width, height);
        const offsetX = (width - size) / 2;
        const offsetY = (height - size) / 2;

        // 정사각형 영역에 비디오 그리기
        canvasCtx.drawImage(video, offsetX, offsetY, size, size);
      }

      // 랜드마크 그리기
      if (results.landmarks) {
        for (const landmarks of results.landmarks) {
          // 관절 연결선 그리기 (손가락과 손 윤곽)
          drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
            color: '#ebc853',
            lineWidth: 5,
          });

          // 랜드마크 점 그리기
          drawLandmarks(canvasCtx, landmarks, {
            color: '#fffcc6',
            lineWidth: 2,
            radius: 4,
          });
        }
      }

      canvasCtx.restore();
    },
    [HAND_CONNECTIONS, drawConnectors, drawLandmarks]
  );

  // 웹캠 스트림 설정
  useEffect(() => {
    if (isCameraBlocked) return;

    if (webcamRef.current && webcamRef.current.video) {
      console.log('Setting up video loadedmetadata event');
      webcamRef.current.video.onloadedmetadata = () => {
        console.log('Video metadata loaded');
        setIsStreaming(true);
      };
    }
  }, [isCameraBlocked]);

  // 웹캠에서 프레임을 가져와 처리하는 함수
  const predictWebcam = useCallback(async () => {
    // 카메라가 차단된 경우 처리하지 않음
    if (isCameraBlocked) return;

    // 조기 종료 조건
    if (!webcamRef.current?.video?.readyState || !canvasRef.current) {
      // 다음 프레임에서 다시 시도
      animationRef.current = requestAnimationFrame(predictWebcam);
      return;
    }

    try {
      const video = webcamRef.current.video;

      // 손 랜드마크 감지 시도
      const results = await detectFrame(video);

      // 손 감지 여부를 부모 컴포넌트로 전달
      const handDetected = !!(results?.landmarks && results.landmarks.length > 0);
      if (onHandDetected) {
        onHandDetected(handDetected);
      }

      // 감지된 랜드마크 그리기 (공통 함수 활용)
      drawCanvas(
        results || { landmarks: [], worldLandmarks: [], handednesses: [], handedness: [] }
      );

      // API 통신 (isPaused가 false일 때만)
      if (handDetected && !isPaused) {
        // API로 랜드마크 전송 (수집 여부는 useGestureHttpApi 내부에서 처리)
        sendLandmarks(results.landmarks);
      }
    } catch (e) {
      console.error('[🖐️ 손 감지 오류]', e);
    }

    // 항상 다음 프레임 요청
    animationRef.current = requestAnimationFrame(predictWebcam);
  }, [detectFrame, sendLandmarks, isPaused, drawCanvas, onHandDetected, isCameraBlocked]);

  // 애니메이션 프레임 관리 - 분리된 useEffect로 처리
  useEffect(() => {
    console.log('Animation frame effect triggered', { isLoading, error, isCameraBlocked });
    
    // 카메라가 차단된 경우 애니메이션 프레임을 시작하지 않음
    if (isCameraBlocked) return;
    
    // 초기 애니메이션 프레임 요청
    if (!isLoading && !error) {
      console.log('Starting animation frame');
      animationRef.current = requestAnimationFrame(predictWebcam);
    }

    // 정리 함수
    return () => {
      if (animationRef.current) {
        console.log('Canceling animation frame');
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isLoading, error, predictWebcam, isCameraBlocked]);

  // 디바이스 변경 감지 처리
  useEffect(() => {
    const handleDeviceChange = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputDevices = devices.filter(device => device.kind === 'videoinput');

        if (videoInputDevices.length === 0) {
          setIsCameraBlocked(true);
          // 중복 토스트 방지
          if (!blockToastShown.current) {
            toast.error('웹캠이 비활성화되었습니다. 다시 활성화해주세요.');
            blockToastShown.current = true;
          }
          if (onCameraBlocked) {
            onCameraBlocked();
          }
        } else {
          // 카메라 장치가 있지만, 사용 권한이 있는지 확인
          try {
            await navigator.mediaDevices.getUserMedia({ video: true });
            // 이전에 차단되었다가 다시 활성화된 경우에만 상태 업데이트
            if (isCameraBlocked) {
              setIsCameraBlocked(false);
              blockToastShown.current = false;
            }
          } catch (error) {
            setIsCameraBlocked(true);
            // 중복 토스트 방지
            if (!blockToastShown.current) {
              toast.error('웹캠 접근이 차단되었습니다. 카메라 권한을 허용해주세요.');
              blockToastShown.current = true;
            }
            if (onCameraBlocked) {
              onCameraBlocked();
            }
          }
        }
      } catch (error) {
        console.error('[🎥 디바이스 변경 감지 오류]', error);
        setIsCameraBlocked(true);
        // 중복 토스트 방지
        if (!blockToastShown.current) {
          toast.error('웹캠 접근 상태를 확인할 수 없습니다.');
          blockToastShown.current = true;
        }
        if (onCameraBlocked) {
          onCameraBlocked();
        }
      }
    };

    // 브라우저에서 디바이스 변경 이벤트 감지
    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, [onCameraBlocked, isCameraBlocked]);

  return (
    <div className="w-full h-full bg-white relative overflow-hidden">
      {isLoading && (
  <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm rounded-lg px-2.5 py-1.5 z-40 flex items-center shadow-lg">
    <svg className="animate-spin h-3.5 w-3.5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span className="text-white text-xs font-medium">AI 준비중</span>
  </div>
)}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="text-red-500 text-xl font-bold">모델 로딩 오류</div>
        </div>
      )}

      {isCameraBlocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center 
          bg-black/90 z-50
          font-[NanumSquareRoundB]">
          <div className="text-orange-400 text-xl font-bold mb-2">카메라 접근이 차단됨</div>
          <div className="text-white text-base">브라우저 설정에서 카메라 권한을 허용 후 다시 시도해주세요</div>
        </div>
      )}

      {/* 웹캠 (숨겨진 상태) */}
      <Webcam
        audio={false}
        width={720}
        height={720}
        ref={webcamRef}
        videoConstraints={{
          facingMode: 'user',
          width: 720,
          height: 720,
        }}
        className="invisible absolute"
        onUserMediaError={(error) => {
          console.error('[🎥 웹캠 사용자 미디어 오류]', error);
          setIsCameraBlocked(true);
          // 토스트는 initializeWebcam에서만 표시하도록 제거
          if (onCameraBlocked) {
            onCameraBlocked();
          }
        }}
      />

      {/* 캔버스 (웹캠 화면과 손 랜드마크를 표시) */}
      <canvas
        ref={canvasRef}
        width={720}
        height={720}
        className="w-full h-full"
        style={{ transform: 'scaleX(-1)' }}
      />

      {/* 가이드라인 컨테이너 */}
      {showGuideline && !isCameraBlocked && (
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <div className="relative w-full h-[90%] flex justify-center items-center overflow-hidden">
            {/* SVG 가이드라인 */}
            <img
              src="/images/guide-line.svg"
              alt="카메라 가이드라인"
              className={`absolute ${guidelineClassName}`}
            />
            {/* 안내 텍스트 - 가시성 향상 */}
            <div className="absolute top-5 left-0 right-0 flex justify-center items-center">
              <p
                className="bg-black/60 text-white px-4 py-2 rounded-lg
                text-sm md:text-base font-[NanumSquareRoundEB] 
                drop-shadow-lg"
              >
                {guideText}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebCamera;