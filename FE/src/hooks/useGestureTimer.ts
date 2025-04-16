// useSimpleTimer.ts
import { useRef, useCallback } from 'react';

export const useGestureTimer = () => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // 타이머 시작
  const startTimer = useCallback((callback: () => void, delay: number) => {
    // 기존 타이머 정리
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // 새 타이머 설정
    timerRef.current = setTimeout(callback, delay);
    return timerRef.current;
  }, []);
  
  // 타이머 정리
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  
  // 컴포넌트 언마운트 시 정리를 위한 함수
  const cleanupTimers = useCallback(() => {
    clearTimer();
  }, [clearTimer]);
  
  return {
    startTimer,
    clearTimer,
    cleanupTimers
  };
};