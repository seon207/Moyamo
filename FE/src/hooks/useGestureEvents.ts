// useGestureEvents.ts
import { useEffect } from 'react';

interface GestureDetectedEvent extends CustomEvent {
  detail: {
    gesture: string;
    confidence: number;
  };
}

interface UseGestureEventsProps {
  isOpen: boolean;
  isPaused: boolean;
  onGestureDetected: (gesture: string, confidence: number) => void;
}

export const useGestureEvents = ({ isOpen, isPaused, onGestureDetected }: UseGestureEventsProps) => {
  useEffect(() => {
    // 제스처 이벤트 핸들러
    const handleGestureDetected = (event: Event) => {
      // 모달이 닫혀있거나 일시정지 상태면 이벤트 무시
      if (!isOpen || isPaused) {
        console.log('[🖐️ 제스처 무시] 모달 닫힘 또는 일시정지 상태', { isOpen, isPaused });
        return;
      }

      const gestureEvent = event as GestureDetectedEvent;
      if (gestureEvent.detail && gestureEvent.detail.gesture) {
        const { gesture, confidence } = gestureEvent.detail;
        console.log(`[🖐️ 제스처 감지] ${gesture} (신뢰도: ${confidence})`);
        
        // 콜백 실행
        onGestureDetected(gesture, confidence);
      }
    };

    // 이벤트 리스너 등록 (모달이 열려 있을 때만)
    if (isOpen) {
      window.addEventListener('gesture-detected', handleGestureDetected);
      console.log('[🎧 제스처 이벤트 리스너] 등록됨');
    }

    // 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener('gesture-detected', handleGestureDetected);
      console.log('[🎧 제스처 이벤트 리스너] 제거됨');
    };
  }, [isOpen, isPaused, onGestureDetected]);
};