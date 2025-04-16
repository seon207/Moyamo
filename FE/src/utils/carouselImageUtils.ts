// Vite의 glob import 기능을 사용해 캐러셀 제스처 이미지 로드
const carouselGestureImages = import.meta.glob('../assets/images/carousel_gestures/*.webp', {
  eager: true,
});

// 경로에서 파일명(확장자 제외)을 추출하는 함수
const getKeyFromPath = (path: string): string => {
  const filename = path.split('/').pop() || '';
  return filename.replace(/\.[^/.]+$/, ''); // 확장자 제거
};

// 이미지 맵 생성
const createImageMap = (modules: Record<string, any>): Record<string, string> => {
  const result: Record<string, string> = {};

  Object.entries(modules).forEach(([path, module]) => {
    const key = getKeyFromPath(path);
    result[key] = (module as any).default;
  });

  return result;
};

// 캐러셀 제스처 이미지 맵 생성
const carouselGestures = createImageMap(carouselGestureImages);

/**
 * 캐러셀 제스처 이미지를 가져오는 함수
 * @param name 이미지 파일명(확장자 제외)
 * @returns 이미지 URL 또는 빈 문자열
 */
export const getCarouselGestureImage = (name: string): string => carouselGestures[name] || '';

/**
 * 사용 가능한 모든 캐러셀 제스처 이미지 키 목록 반환
 * @returns 이미지 키 배열
 */
export const getCarouselGestureImageKeys = (): string[] => Object.keys(carouselGestures);

/**
 * 개발용: 사용 가능한 캐러셀 제스처 이미지 목록 콘솔에 출력
 */
export const listCarouselGestureImages = (): void => {
  console.log('Available Carousel Gesture Images:', Object.keys(carouselGestures));
};

/**
 * 캐러셀 제스처 이미지가 존재하는지 확인
 * @param name 이미지 파일명(확장자 제외)
 * @returns 이미지 존재 여부
 */
export const hasCarouselGestureImage = (name: string): boolean => !!carouselGestures[name];
