import { useState, useEffect, useRef, useCallback } from 'react';
import {
  HandLandmarker,
  HandLandmarkerResult,
  FilesetResolver
} from '@mediapipe/tasks-vision';

// 결과 및 상태를 위한 인터페이스
interface UseHandLandmarkerReturn {
  isLoading: boolean;
  error: Error | null;
  detectFrame: (video: HTMLVideoElement) => Promise<HandLandmarkerResult | null>;
  HAND_CONNECTIONS: number[][];
  drawLandmarks: (
    ctx: CanvasRenderingContext2D,
    landmarks: any[],
    options: { color: string; lineWidth: number; radius: number }
  ) => void;
  drawConnectors: (
    ctx: CanvasRenderingContext2D,
    landmarks: any[],
    connections: number[][],
    options: { color: string; lineWidth: number }
  ) => void;
}

/**
 * MediaPipe HandLandmarker 기능을 제공하는 커스텀 훅
 */
export const useHandLandmarker = (): UseHandLandmarkerReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);

  // 손 연결 정보 (관절 간 연결)
  const HAND_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4], // 엄지
    [0, 5], [5, 6], [6, 7], [7, 8], // 검지
    [5, 9], [9, 10], [10, 11], [11, 12], // 중지
    [9, 13], [13, 14], [14, 15], [15, 16], // 약지
    [13, 17], [17, 18], [18, 19], [19, 20], // 소지
    [0, 17], [17, 5], [5, 0] // 손바닥
  ];

  // HandLandmarker 초기화
  useEffect(() => {
    const initializeHandLandmarker = async () => {
      try {
        console.log("[🖐️ HandLandmarker] 초기화 중...");
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        
        const handLandmarker = await HandLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-tasks/hand_landmarker/hand_landmarker.task",
            delegate: "GPU"
          },
          numHands: 2,
          runningMode: "VIDEO",
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
        
        handLandmarkerRef.current = handLandmarker;
        setIsLoading(false);
        console.log("[🖐️ HandLandmarker] 초기화 완료");
      } catch (err) {
        console.error("[🖐️ HandLandmarker] 초기화 오류:", err);
        setError(err instanceof Error ? err : new Error('HandLandmarker 초기화 실패'));
        setIsLoading(false);
      }
    };

    initializeHandLandmarker();
  }, []);

  // 비디오 프레임에서 손 랜드마크 감지
  const detectFrame = useCallback(async (video: HTMLVideoElement): Promise<HandLandmarkerResult | null> => {
    if (!handLandmarkerRef.current || video.readyState !== 4) {
      return null;
    }
    
    const timestamp = performance.now();
    const results = handLandmarkerRef.current.detectForVideo(video, timestamp);
    return results;
  }, []);

  // 랜드마크 점 그리기 함수
  const drawLandmarks = useCallback((
    ctx: CanvasRenderingContext2D,
    landmarks: any[],
    options: { color: string; lineWidth: number; radius: number }
  ) => {
    const { color, lineWidth, radius } = options;
    
    for (const landmark of landmarks) {
      const x = landmark.x * ctx.canvas.width;
      const y = landmark.y * ctx.canvas.height;
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = "#FFFFFF";
      ctx.stroke();
    }
  }, []);

  // 연결선 그리기 함수
  const drawConnectors = useCallback((
    ctx: CanvasRenderingContext2D,
    landmarks: any[],
    connections: number[][],
    options: { color: string; lineWidth: number }
  ) => {
    const { color, lineWidth } = options;
    
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    
    for (const connection of connections) {
      const [start, end] = connection;
      if (landmarks[start] && landmarks[end]) {
        const startX = landmarks[start].x * ctx.canvas.width;
        const startY = landmarks[start].y * ctx.canvas.height;
        const endX = landmarks[end].x * ctx.canvas.width;
        const endY = landmarks[end].y * ctx.canvas.height;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    }
  }, []);

  return {
    isLoading,
    error,
    detectFrame,
    HAND_CONNECTIONS,
    drawLandmarks,
    drawConnectors
  };
};