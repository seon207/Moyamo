// src/utils/sensitiveGestureUtils.ts

/**
 * 민감한 제스처인지 확인하는 함수
 */
export const isSensitiveGesture = (gestureName: string): boolean => {
  // 소문자로 변환하여 비교
  const lowercaseName = gestureName.toLowerCase().trim();
  
  // 민감한 제스처 목록
  const sensitiveGestures = [
    'devil',
    'middle_finger',
    // 추가 필요한 단어들
  ];
  
  return sensitiveGestures.some(gesture => 
    lowercaseName.includes(gesture)
  );
};

/**
 * 민감한 제스처의 경고 메시지를 생성하는 함수
 */
export const getSensitiveGestureWarning = (gestureName: string): {
  title: string;
  description: string;
  icon: string;
} => {
  return {
    title: '민감한 제스처가 감지되었습니다',
    description: '특정 나라에서 부적절한 의미를 가지고 있을 수 있습니다. 검색 결과를 확인해 주세요.',
    icon: '⚠️'
  };
};

/**
 * 민감한 제스처를 검색 결과로 허용할지 여부를 결정하는 함수
 */
export const isSearchableGesture = (gestureName: string): boolean => {
  const lowercaseName = gestureName.toLowerCase().trim();
  
  // 검색 불가능한 제스처 목록
  const nonSearchableGestures = [
    'middle_finger',
  ];
  
  return !nonSearchableGestures.some(gesture => 
    lowercaseName.includes(gesture)
  );
};