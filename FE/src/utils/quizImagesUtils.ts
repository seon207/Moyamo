// @/utils/quizImages.ts
// 정적 제스처 이미지를 관리하는 유틸리티 파일

// Vite의 정적 에셋 가져오기
const images = import.meta.glob('../assets/images/quiz_images/*.webp', { eager: true });

// 이미지 맵 객체 - gestureId를 키로 사용
export const quizImages: Record<number, string> = {};

// 경로에서 ID 추출하여 매핑
Object.entries(images).forEach(([path, module]) => {
  // 경로에서 파일명 추출 (예: '../assets/images/quiz_images/1.webp' -> '1.webp')
  const fileName = path.split('/').pop() || '';
  
  // 파일명에서 숫자 ID 추출 (예: '1.webp' -> 1)
  const gestureId = parseInt(fileName.split('.')[0]);
  
  if (!isNaN(gestureId)) {
    // @ts-ignore - module에는 default 속성이 있지만 타입 정의가 없을 수 있음
    quizImages[gestureId] = module.default;
  }
});

/**
 * 제스처 ID를 기반으로 퀴즈 이미지 경로를 반환하는 함수
 * @param gestureId 제스처 ID
 * @returns 이미지 경로 또는 null (이미지가 없는 경우)
 */
export const getQuizImage = (gestureId: number | null): string | null => {
  if (!gestureId) return null;
  return quizImages[gestureId] || null;
};

/**
 * 모든 사용 가능한 퀴즈 이미지 ID 목록 반환
 * @returns 사용 가능한 gestureId 배열
 */
export const getAvailableQuizImageIds = (): number[] => {
  return Object.keys(quizImages).map(id => parseInt(id));
};

/**
 * 퀴즈 이미지가 존재하는지 확인하는 함수
 * @param gestureId 확인할 제스처 ID
 * @returns 이미지 존재 여부 (boolean)
 */
export const hasQuizImage = (gestureId: number | null): boolean => {
  if (!gestureId) return false;
  return !!quizImages[gestureId];
};

// 디버깅을 위해 로드된 이미지 정보 출력
console.log('로드된 퀴즈 이미지:', { 
  count: Object.keys(quizImages).length,
  availableIds: getAvailableQuizImageIds()
});