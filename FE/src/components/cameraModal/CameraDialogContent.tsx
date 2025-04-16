import React, { useEffect, useRef } from 'react';
import WebCamera from '../WebCamera';

interface CameraDialogContentProps {
  open: boolean;
  guideText?: string;
  onConnectionStatus?: (status: boolean) => void;
  isPaused: boolean;
  onHandDetected?: (detected: boolean) => void;
}

/**
 * 카메라 다이얼로그의 내용 컴포넌트
 * - 웹캠 출력 및 상태 관리
 */
const CameraDialogContent: React.FC<CameraDialogContentProps> = ({
  open,
  guideText = '손 전체가 화면에 보이도록 준비해 주세요',
  onConnectionStatus,
  isPaused,
  onHandDetected,
}) => {
  // useGestureHttpApi 훅의 메서드에 접근하기 위한 참조
  const resetSequenceRef = useRef<() => void>(() => {
    console.log('[🔄 resetSequence 더미 함수 호출됨]');
  });
  
  const startCollectingFramesRef = useRef<() => void>(() => {
    console.log('[🎬 startCollectingFrames 더미 함수 호출됨]');
  });

  // WebCamera 컴포넌트에서 메서드 참조를 받기 위한 콜백
  const handleResetSequence = (resetFn: () => void) => {
    resetSequenceRef.current = resetFn;
  };
  
  const handleStartCollectingFrames = (startFn: () => void) => {
    startCollectingFramesRef.current = startFn;
  };

  // 전역 함수 설정
  useEffect(() => {
    if (open) {
      // 전역 함수에 실제 메서드 연결
      window.resetGestureSequence = () => {
        console.log('[🔄 전역에서 시퀀스 리셋 요청됨]');
        resetSequenceRef.current();
      };
      
      // 전역 프레임 수집 시작 함수 연결
      window.startCollectingFrames = () => {
        console.log('[🎬 전역에서 프레임 수집 시작 요청됨]');
        startCollectingFramesRef.current();
      };

      console.log('[🔄 전역 함수 연결됨]');
    }

    return () => {
      // 컴포넌트 언마운트나 모달이 닫힐 때 연결 해제
      if (open) {
        window.resetGestureSequence = undefined;
        window.startCollectingFrames = undefined;
        console.log('[🔄 전역 함수 연결 해제]');
      }
    };
  }, [open]);

  // 모달이 열릴 때마다 시퀀스 초기화
  useEffect(() => {
    if (open) {
      resetSequenceRef.current();
      console.log('[🔄 모달 열림: 시퀀스 초기화]');
    }
  }, [open]);

  // 일시 정지 상태 변경 시 시퀀스 초기화
  useEffect(() => {
    if (isPaused) {
      resetSequenceRef.current();
      console.log('[🔄 일시 정지: 시퀀스 초기화]');
    }
  }, [isPaused]);

  return (
    <div className="w-full aspect-square bg-gray-100 relative">
      {open && (
        <WebCamera
          guidelineClassName="w-[70%] h-auto top-20 opacity-70"
          guideText={guideText}
          onConnectionStatus={onConnectionStatus}
          isPaused={isPaused}
          onHandDetected={onHandDetected}
          onResetSequence={handleResetSequence}
          onStartCollectingFrames={handleStartCollectingFrames}
        />
      )}
    </div>
  );
};

export default CameraDialogContent;