import { useState, useRef, useCallback } from 'react';

// API 연결 상태를 나타내는 타입
export type ApiStatus = 'closed' | 'connecting' | 'open' | 'error';

// 전역 변수로 마지막 감지된 제스처 저장
declare global {
  interface Window {
    lastDetectedGesture?: {
      gesture: string;
      confidence: number;
    };
    resetGestureSequence?: () => void;
    startCollectingFrames?: () => void; // 프레임 수집 시작 함수 추가
  }
}

// 제스처 인식 결과 타입
interface GestureRecognitionResult {
  gesture: string | null;
  confidence: number | null;
}

// 훅의 반환 타입
interface UseGestureHttpApiReturn {
  status: ApiStatus;
  gesture: string | null;
  confidence: number | null;
  sendLandmarks: (landmarks: any[]) => void;
  connect: () => void;
  disconnect: () => void;
  resetSequence: () => void;
  startCollectingFrames: () => void; // 프레임 수집 시작 함수 추가
}

/**
 * 제스처 인식을 위한 HTTP API 통신을 관리하는 커스텀 훅 (단순화된 버전)
 */
export const useGestureHttpApi = (): UseGestureHttpApiReturn => {
  const SERVER_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // API 상태 관리
  const [status, setStatus] = useState<ApiStatus>('closed');

  // 제스처 인식 결과 관리
  const [recognitionResult, setRecognitionResult] = useState<GestureRecognitionResult>({
    gesture: null,
    confidence: null,
  });

  // 시퀀스 참조 - 프레임 데이터를 저장
  const sequenceRef = useRef<number[][]>([]);

  // 시퀀스 길이 (frame 수)
  const SEQUENCE_LENGTH = 50;

  // 마지막으로 데이터를 전송한 시간
  const lastSentTimeRef = useRef<number>(0);

  // 마지막 API 요청 타임스탬프
  const lastApiRequestRef = useRef<number>(0);

  // API 요청 처리 중 여부
  const isProcessingRef = useRef<boolean>(false);

  // 한 세션에서 결과를 보낸 적이 있는지 여부
  const resultSentRef = useRef<boolean>(false);

  // 프레임 수집이 활성화된 상태인지 여부 (새로 추가)
  const isCollectingRef = useRef<boolean>(false);

  // 데이터 전송 간격 (ms)
  const SEND_THROTTLE = 50;

  // API 요청 간격 (ms)
  const API_REQUEST_THROTTLE = 1000;

  // 시퀀스 클리어
  const clearSequence = useCallback(() => {
    console.log('[🔄 시퀀스 초기화]');
    sequenceRef.current = [];
  }, []);

  // 시퀀스 초기화 및 수집 비활성화 (외부에서 호출 가능)
  const resetSequence = useCallback(() => {
    console.log('[🔄 시퀀스 리셋 및 수집 중지]');
    clearSequence();
    isCollectingRef.current = false;
    resultSentRef.current = false;
    isProcessingRef.current = false;
  }, [clearSequence]);

  // 프레임 수집 시작 (새로 추가) - clearSequence 뒤에 정의
  const startCollectingFrames = useCallback(() => {
    console.log('[🎬 프레임 수집 시작]');
    clearSequence(); // 기존 시퀀스 초기화
    isCollectingRef.current = true;
    resultSentRef.current = false;
  }, [clearSequence]);

  // 정적/동적 제스처 판별 함수
  const isDynamicGesture = useCallback((sequence: number[][], threshold = 0.005): boolean => {
    if (sequence.length < 2) return false;

    const centers = sequence.map((frame) => {
      const joint3D = frame.slice(0, 63); // 21*3
      const coords = Array.from({ length: 21 }, (_, i) => joint3D.slice(i * 3, i * 3 + 3));

      const [sumX, sumY, sumZ] = coords.reduce(
        ([sx, sy, sz], [x, y, z]) => [sx + x, sy + y, sz + z],
        [0, 0, 0]
      );

      return [sumX / 21, sumY / 21, sumZ / 21];
    });

    let totalMove = 0;
    for (let i = 1; i < centers.length; i++) {
      const [x1, y1, z1] = centers[i - 1];
      const [x2, y2, z2] = centers[i];
      const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
      totalMove += dist;
    }

    const avgMove = totalMove / (centers.length - 1);
    console.log('[📈 평균 이동량]', avgMove);
    return avgMove > threshold;
  }, []);

  // 데이터를 서버로 전송하는 함수
  const sendToServer = useCallback(
    async (sequenceData: number[][]) => {
      try {
        // 이미 결과를 보낸 적이 있으면 무시
        if (resultSentRef.current) {
          console.log('[🚫 이미 결과가 전송됨] 추가 API 요청 무시');
          isProcessingRef.current = false;
          return;
        }

        const now = Date.now();

        // API 요청 간격 제한 (쓰로틀링)
        if (now - lastApiRequestRef.current < API_REQUEST_THROTTLE) {
          console.log('[🔄 API 요청 쓰로틀링] 최근 요청 이후 충분한 시간이 지나지 않음');
          isProcessingRef.current = false;
          return;
        }

        lastApiRequestRef.current = now;

        // 수집된 시퀀스 데이터 확인
        if (sequenceData.length < 10) {
          console.log('[⚠️ 불충분한 데이터] 시퀀스 데이터가 너무 적습니다.');
          isProcessingRef.current = false;
          return;
        }

        const isDynamic = isDynamicGesture(sequenceData);
        const endpoint = isDynamic ? '/api/predict/dynamic' : '/api/predict/static';
        const url = SERVER_BASE_URL + endpoint;

        const payload = { frames: sequenceData };
        console.log(
          `[📤 전송됨] ${isDynamic ? '동적' : '정적'} 제스처 (${sequenceData.length} 프레임) to ${url}`
        );

        try {
          // HTTP API 요청
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error(`API 요청 실패: ${response.status}`);
          }

          const res = await response.json();

          // 응답 처리
          const result = Array.isArray(res) ? res[0] : res;

          // gesture가 배열인 경우 첫 번째 요소를 제스처 이름으로 사용
          const gestureName = Array.isArray(result.gesture) ? result.gesture[0] : result.gesture;
          // gesture가 배열인 경우 두 번째 요소를 confidence로 사용
          const confidenceValue = Array.isArray(result.gesture)
            ? result.gesture[1]
            : result.confidence;

          console.log('[📥 응답]', JSON.stringify(res));
          console.log('[🔍 인식된 제스처]', gestureName, '(신뢰도:', confidenceValue, ')');

          // 결과 저장
          if (gestureName) {
            // 중요: 전역 변수에도 결과 저장
            window.lastDetectedGesture = {
              gesture: gestureName,
              confidence: confidenceValue,
            };
            console.log('[💾 전역 변수에 제스처 저장]', gestureName);

            setRecognitionResult({
              gesture: gestureName,
              confidence: confidenceValue,
            });

            // 이미 결과 전송 플래그 설정
            resultSentRef.current = true;

            // 이벤트 발행
            const gestureEvent = new CustomEvent('gesture-detected', {
              detail: { gesture: gestureName, confidence: confidenceValue },
            });
            window.dispatchEvent(gestureEvent);
          } else {
            console.warn('[⚠️ 인식 실패] 서버 응답에 유효한 제스처가 없습니다.');

            // 실패해도 none 제스처를 전역 변수에 저장
            window.lastDetectedGesture = {
              gesture: 'none',
              confidence: 0,
            };
          }
        } catch (error) {
          console.error('[🌐 API 요청 오류]', error);
          // 에러가 발생해도 none 제스처로 전역 변수에 저장
          window.lastDetectedGesture = {
            gesture: 'none',
            confidence: 0,
          };

          // 에러가 발생해도 none 제스처로 이벤트 발행
          const gestureEvent = new CustomEvent('gesture-detected', {
            detail: { gesture: 'none', confidence: 0 },
          });
          window.dispatchEvent(gestureEvent);
        }

        // 처리 완료
        isProcessingRef.current = false;
      } catch (err) {
        console.error('[🌐 API 오류]', err);
        setStatus('error');
        isProcessingRef.current = false;

        // 전역 변수에도 오류 상태 저장
        window.lastDetectedGesture = {
          gesture: 'none',
          confidence: 0,
        };
      }
    },
    [SERVER_BASE_URL, isDynamicGesture, API_REQUEST_THROTTLE]
  );

  // 랜드마크 데이터 전송 함수
  const sendLandmarks = useCallback(
    (landmarks: any[]) => {
      try {
        // 상태가 'closed'이면 처리하지 않음
        if (status === 'closed') {
          return;
        }

        // API가 일시 중지되었거나 수집이 활성화되지 않았으면 무시
        if (!isCollectingRef.current) {
          return;
        }

        // 이미 결과가 전송되었으면 처리하지 않음
        if (resultSentRef.current) {
          return;
        }

        // 이미 처리 중이면 무시
        if (isProcessingRef.current) {
          return;
        }

        const now = Date.now();

        // 전송 간격 제한 (쓰로틀링)
        if (now - lastSentTimeRef.current < SEND_THROTTLE) {
          return;
        }

        lastSentTimeRef.current = now;

        if (status !== 'open') {
          console.log('[🌐 API] 상태를 open으로 변경');
          setStatus('open');
        }

        // 각 손에 대해 랜드마크 처리 (단순화된 로직)
        for (const hand of landmarks) {
          // 원점 (첫 번째 랜드마크)
          const origin = [hand[0].x, hand[0].y, hand[0].z];

          // 정규화된 랜드마크 계산
          const normalized = hand.map((lm: any) => [
            lm.x - origin[0],
            lm.y - origin[1],
            lm.z - origin[2],
          ]);

          // 정규화된 랜드마크를 1차원 배열로 평탄화
          const flat = normalized.flat();

          // 벡터 정규화
          const norm = Math.hypot(...flat);
          const normed = norm > 0 ? flat.map((v: number) => v / norm) : flat;

          // 양손 여부 추가
          const isTwoHands = landmarks.length === 2 ? 1 : 0;

          // 최종 벡터 생성
          const vector64 = [...normed, isTwoHands];

          // 시퀀스에 추가
          sequenceRef.current.push(vector64);

          // 시퀀스가 너무 길어지면 앞부분 제거
          if (sequenceRef.current.length > SEQUENCE_LENGTH * 1.5) {
            sequenceRef.current = sequenceRef.current.slice(-SEQUENCE_LENGTH);
          }
        }

        // 충분한 프레임이 모였고, 처리 중이 아니면 서버로 전송 (5프레임마다 로그)
        if (sequenceRef.current.length % 5 === 0) {
          console.log(
            `[🔄 시퀀스 수집 중] ${sequenceRef.current.length}/${SEQUENCE_LENGTH} 프레임`
          );
        }

        if (
          sequenceRef.current.length >= SEQUENCE_LENGTH &&
          !isProcessingRef.current &&
          !resultSentRef.current
        ) {
          console.log(`[🔄 시퀀스 완성] ${sequenceRef.current.length} 프레임`);
          isProcessingRef.current = true; // 처리 중 상태로 설정

          // 현재 시퀀스 복사 후 초기화
          const currentSequence = [...sequenceRef.current];
          clearSequence();

          // 서버로 전송
          sendToServer(currentSequence);
        }
      } catch (error) {
        console.error('[🌐 API] 데이터 처리 오류:', error);
        isProcessingRef.current = false;
      }
    },
    [SEND_THROTTLE, SEQUENCE_LENGTH, status, clearSequence, sendToServer]
  );

  // API 연결 준비 완료 콜백
  const connect = useCallback(() => {
    console.log('[🌐 API] 연결 준비 완료');
    setStatus('open');
    clearSequence();
    isProcessingRef.current = false;
    resultSentRef.current = false;
    lastApiRequestRef.current = 0;

    // 중요: 기본적으로 프레임 수집은 비활성화 상태로 시작
    // startCollectingFrames 함수를 명시적으로 호출해야 활성화됨
    isCollectingRef.current = false;

    // 결과 초기화
    setRecognitionResult({
      gesture: null,
      confidence: null,
    });
  }, [clearSequence]);

  // API 연결 해제 함수
  const disconnect = useCallback(() => {
    console.log('[🌐 API] 연결 종료');
    setStatus('closed');
    clearSequence();
    isProcessingRef.current = false;
    resultSentRef.current = false;

    // 프레임 수집 비활성화 (중요!)
    isCollectingRef.current = false;

    // 결과 초기화
    setRecognitionResult({
      gesture: null,
      confidence: null,
    });
  }, [clearSequence]);

  return {
    status,
    gesture: recognitionResult.gesture,
    confidence: recognitionResult.confidence,
    sendLandmarks,
    connect,
    disconnect,
    resetSequence,
    startCollectingFrames, // 새로 추가된 메서드 반환
  };
};
