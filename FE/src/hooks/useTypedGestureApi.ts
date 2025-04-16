import { useCallback, useEffect, useState } from 'react';
import { useGestureHttpApi, ApiStatus } from '@/hooks/useGestureHttpApi';

// 훅의 반환 타입 (startCollectingFrames 함수 추가)
interface UseTypedGestureApiReturn {
  status: ApiStatus;
  gesture: string | null;
  confidence: number | null;
  sendLandmarks: (landmarks: any[]) => void;
  connect: () => void;
  disconnect: () => void;
  resetSequence: () => void;
  startCollectingFrames: () => void; // 이 함수를 반환값에 추가
}

// 훅 파라미터 타입
interface UseTypedGestureApiProps {
  gestureType: 'STATIC' | 'DYNAMIC';
}

/**
 * 제스처 타입에 맞는 API 엔드포인트를 호출하는 훅
 * useGestureHttpApi를 확장하여 제스처 타입에 따라 적절한 엔드포인트를 호출합니다.
 */
export const useTypedGestureApi = ({
  gestureType,
}: UseTypedGestureApiProps): UseTypedGestureApiReturn => {
  // 원래 훅 사용
  const originalHook = useGestureHttpApi();

  // API 엔드포인트 URL 추적
  const [apiEndpoint, setApiEndpoint] = useState<string | null>(null);

  // 디버깅을 위한 API 요청 카운터
  const [apiRequestCount, setApiRequestCount] = useState({
    static: 0,
    dynamic: 0,
  });

  // 훅이 마운트될 때 한 번만 실행
  useEffect(() => {
    console.log(`[🔧 제스처 타입 초기화] 타입: ${gestureType}`);

    // 원래 fetch 함수 백업
    const originalFetch = window.fetch;

    // fetch 함수 오버라이드
    window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
      // URL을 문자열로 변환
      const url = input.toString();

      // API 엔드포인트 경로 부분만 가져오기
      if (url.includes('/api/predict/')) {
        // 현재 요청 중인 엔드포인트 저장 (디버깅용)
        setApiEndpoint(url);

        // 디버깅을 위한 카운터 추가
        if (url.includes('/api/predict/static')) {
          setApiRequestCount((prev) => ({
            ...prev,
            static: prev.static + 1,
          }));
          console.log(`[🔍 원본 API 요청] static API 호출 감지 (타입: ${gestureType})`);
          console.log(
            `[📊 API 요청 통계] static: ${apiRequestCount.static + 1}, dynamic: ${apiRequestCount.dynamic}`
          );
        } else if (url.includes('/api/predict/dynamic')) {
          setApiRequestCount((prev) => ({
            ...prev,
            dynamic: prev.dynamic + 1,
          }));
          console.log(`[🔍 원본 API 요청] dynamic API 호출 감지 (타입: ${gestureType})`);
          console.log(
            `[📊 API 요청 통계] static: ${apiRequestCount.static}, dynamic: ${apiRequestCount.dynamic + 1}`
          );
        }

        // 제스처 타입에 맞게 API 엔드포인트 수정
        let newUrl = url;

        // 타입이 STATIC인데 dynamic 엔드포인트를 호출하려는 경우
        if (gestureType === 'STATIC' && url.includes('/api/predict/dynamic')) {
          newUrl = url.replace('/api/predict/dynamic', '/api/predict/static');
          // console.log(`[🔄 API 경로 변경] dynamic -> static (${newUrl})`);
        }
        // 타입이 DYNAMIC인데 static 엔드포인트를 호출하려는 경우
        else if (gestureType === 'DYNAMIC' && url.includes('/api/predict/static')) {
          newUrl = url.replace('/api/predict/static', '/api/predict/dynamic');
          // console.log(`[🔄 API 경로 변경] static -> dynamic (${newUrl})`);
        }

        // URL이 변경되었는지 확인하고 로그 출력
        // if (url !== newUrl) {
        //   console.log(`[🎯 최종 API 요청] ${newUrl} (원본: ${url})`);
        // } else {
        //   console.log(`[🎯 최종 API 요청] ${url} (변경 없음)`);
        // }

        // 변경된 URL로 요청
        return originalFetch(newUrl, init);
      }

      // 그 외의 경우 원래 fetch 함수 호출
      return originalFetch(input, init);
    };

    // 클린업 함수에서 원본 fetch로 복원
    return () => {
      window.fetch = originalFetch;
      console.log('[🔧 제스처 타입 API 해제] 기본 API 요청으로 복원');
    };
  }, [gestureType, apiRequestCount]);

  // 원본 훅의 resetSequence 함수를 확장
  const resetSequence = useCallback(() => {
    console.log(`[🔄 제스처 시퀀스] 초기화 (타입: ${gestureType})`);
    originalHook.resetSequence();
  }, [originalHook, gestureType]);

  // 원본 훅의 connect 함수를 확장하여 로깅 추가 및 자동으로 프레임 수집 시작
  const connect = useCallback(() => {
    console.log(`[🌐 제스처 API] 연결 시작 (타입: ${gestureType})`);
    originalHook.connect();

    // 연결 시 자동으로 프레임 수집 시작 - 이 부분이 중요합니다!
    console.log('[🌐 제스처 API] 자동으로 프레임 수집 시작');
    originalHook.startCollectingFrames();
  }, [originalHook, gestureType]);

  // 연결 해제 함수도 확장
  const disconnect = useCallback(() => {
    console.log('[🌐 제스처 API] 연결 종료');
    originalHook.disconnect();
  }, [originalHook]);

  // 프레임 수집 시작 함수 추가 - 이 부분이 중요합니다!
  const startCollectingFrames = useCallback(() => {
    console.log(`[🎬 제스처 프레임 수집] 시작 (타입: ${gestureType})`);
    originalHook.startCollectingFrames();
  }, [originalHook, gestureType]);

  // 랜드마크 전송 함수 래핑
  const sendLandmarks = useCallback(
    (landmarks: any[]) => {
      // 디버깅 로그
      console.log(
        `[👋 랜드마크 전송] ${landmarks.length}개 (타입: ${gestureType}, 최근 엔드포인트: ${apiEndpoint})`
      );

      // 원본 훅의 sendLandmarks 함수 호출
      originalHook.sendLandmarks(landmarks);
    },
    [originalHook, gestureType, apiEndpoint]
  );

  // 원본 훅의 반환값에서 필요한 메서드만 오버라이드하여 반환
  return {
    ...originalHook,
    sendLandmarks,
    connect,
    disconnect,
    resetSequence,
    startCollectingFrames, // 이 함수를 반환값에 추가
  };
};
