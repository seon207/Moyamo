import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

// 모델 URL을 상수로 정의 (쿼리 파라미터 없이)
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';
const WASM_BASE_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm';

// 싱글톤 변수들
let handLandmarkerInstance: HandLandmarker | null = null;
let isInitializing = false;
let initPromise: Promise<HandLandmarker> | null = null;
let filesetResolverInstance: any = null;

// 캐시 상태 관리
const MODEL_LOADED_KEY = 'handLandmarkerModelLoaded';
const MODEL_VERSION_KEY = 'handLandmarkerModelVersion';
const CURRENT_MODEL_VERSION = '1.0'; // 모델 버전 명시

export const getHandLandmarker = async (): Promise<HandLandmarker> => {
  // 이미 인스턴스가 있는 경우
  if (handLandmarkerInstance) {
    console.log('[🖐️ HandLandmarker 싱글톤] 캐시된 인스턴스 반환');
    return handLandmarkerInstance;
  }

  // 초기화 중인 경우
  if (isInitializing && initPromise) {
    console.log('[🖐️ HandLandmarker 싱글톤] 초기화 진행 중... 기존 Promise 반환');
    return initPromise;
  }

  // 초기화 시작
  isInitializing = true;
  console.log('[🖐️ HandLandmarker 싱글톤] 초기화 시작');

  initPromise = (async () => {
    try {
      // 이전 버전 확인
      const savedVersion = localStorage.getItem(MODEL_VERSION_KEY);

      // 버전이 다른 경우 캐시 정리
      if (savedVersion !== CURRENT_MODEL_VERSION) {
        console.log(
          `[🖐️ HandLandmarker 싱글톤] 모델 버전 변경: ${savedVersion} -> ${CURRENT_MODEL_VERSION}`
        );
        localStorage.removeItem(MODEL_LOADED_KEY);
      }

      console.log('[🖐️ HandLandmarker 싱글톤] FilesetResolver 초기화');

      // 서비스 워커가 활성화되어 있는지 확인
      let isServiceWorkerActive = false;
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        isServiceWorkerActive = true;
        console.log('[🖐️ HandLandmarker 싱글톤] 서비스 워커 활성화됨, 캐싱 활용 가능');
      } else {
        console.log('[🖐️ HandLandmarker 싱글톤] 서비스 워커 미활성화, 직접 다운로드 필요');
      }

      // FilesetResolver 초기화
      if (!filesetResolverInstance) {
        // 서비스 워커를 통해 리소스 요청 (캐싱 활용)
        filesetResolverInstance = await FilesetResolver.forVisionTasks(WASM_BASE_URL);
        console.log('[🖐️ HandLandmarker 싱글톤] FilesetResolver 생성 완료');
      } else {
        console.log('[🖐️ HandLandmarker 싱글톤] 캐시된 FilesetResolver 사용');
      }

      console.log('[🖐️ HandLandmarker 싱글톤] HandLandmarker 생성 시작');

      // 서비스 워커가 활성화된 상태라면 네트워크 요청 전에 잠시 대기
      // (서비스 워커가 완전히 활성화되도록)
      if (isServiceWorkerActive) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // 미디어파이프 손 감지 모델 생성
      const handLandmarker = await HandLandmarker.createFromOptions(filesetResolverInstance, {
        baseOptions: {
          modelAssetPath: MODEL_URL, // 쿼리 파라미터 없이 깨끗한 URL 사용
          delegate: 'GPU',
        },
        numHands: 1,
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      // 인스턴스 저장
      handLandmarkerInstance = handLandmarker;

      // 캐시 상태 저장
      localStorage.setItem(MODEL_LOADED_KEY, 'true');
      localStorage.setItem(MODEL_VERSION_KEY, CURRENT_MODEL_VERSION);

      console.log('[🖐️ HandLandmarker 싱글톤] 초기화 완료');
      isInitializing = false;
      return handLandmarker;
    } catch (err) {
      console.error('[🖐️ HandLandmarker 싱글톤] 초기화 오류:', err);
      isInitializing = false;
      // 오류 발생 시 localStorage 초기화 (다음 시도 시 처음부터 다시 시도)
      localStorage.removeItem(MODEL_LOADED_KEY);
      throw err;
    }
  })();

  return initPromise;
};

// 메모리 정리
export const disposeHandLandmarker = () => {
  if (handLandmarkerInstance) {
    try {
      if (typeof handLandmarkerInstance.close === 'function') {
        handLandmarkerInstance.close();
      }
      handLandmarkerInstance = null;
      console.log('[🖐️ HandLandmarker 싱글톤] 인스턴스 정리됨');
    } catch (err) {
      console.error('[🖐️ HandLandmarker 싱글톤] 정리 중 오류:', err);
    }
  }
};

// 글로벌 정리
if (typeof window !== 'undefined') {
  window.addEventListener('unload', () => {
    disposeHandLandmarker();
  });
}
