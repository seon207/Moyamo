// Vite의 glob import 기능 사용
const attractionImages = import.meta.glob('../assets/images/attractions/*.webp', { eager: true });
const flagImages = import.meta.glob('../assets/images/flags/*.{png,svg,webp}', { eager: true });
const logoImages = import.meta.glob('../assets/images/logos/*.{png,svg,webp}', { eager: true });
const iconImages = import.meta.glob('../assets/images/icons/*.{png,svg,webp}', { eager: true });
const backgroundImages = import.meta.glob('../assets/images/backgrounds/*.{png,svg,webp}', { eager: true });

// 경로에서 파일명(확장자 제외)을 추출하는 함수
const getKeyFromPath = (path: string): string => {
  const filename = path.split('/').pop() || '';
  return filename.replace(/\.[^/.]+$/, ''); // 확장자 제거
};

// 카테고리별 이미지 맵 생성
const createImageMap = (modules: Record<string, any>): Record<string, string> => {
  const result: Record<string, string> = {};
  
  Object.entries(modules).forEach(([path, module]) => {
    const key = getKeyFromPath(path);
    result[key] = (module as any).default;
  });
  
  return result;
};

// 이미지 맵 객체
const attractions = createImageMap(attractionImages);
const flags = createImageMap(flagImages);
const logos = createImageMap(logoImages);
const icons = createImageMap(iconImages);
const backgrounds = createImageMap(backgroundImages);

// 카테고리별 이미지 가져오는 함수들
export const getAttractionImage = (name: string): string => attractions[name] || '';
export const getFlagImage = (name: string): string => flags[name] || '';
export const getLogoImage = (name: string): string => logos[name] || '';
export const getIconImage = (name: string): string => icons[name] || '';
export const getBackgroundImage = (name: string): string => backgrounds[name] || '';

// 모든 이미지를 한번에 처리하는 범용 함수
export const getImage = (category: 'attractions' | 'flags' | 'logos' | 'icons' | 'backgrounds', name: string): string => {
  switch (category) {
    case 'attractions':
      return getAttractionImage(name);
    case 'flags':
      return getFlagImage(name);
    case 'logos':
      return getLogoImage(name);
    case 'icons':
      return getIconImage(name);
    case 'backgrounds':
      return getBackgroundImage(name);
    default:
      return '';
  }
};

// 개발용: 사용 가능한 이미지 키 목록 출력
export const listAvailableImages = () => {
  console.log('Available Attractions:', Object.keys(attractions));
  console.log('Available Flags:', Object.keys(flags));
  console.log('Available Logos:', Object.keys(logos));
  console.log('Available Logos:', Object.keys(backgrounds));
};