import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { isSensitiveGesture, getSensitiveGestureWarning } from '@/utils/sensitiveGestureUtils';

/**
 * 검색 페이지에 포함할 민감한 제스처 경고 컴포넌트
 */
function SensitiveGestureWarning(){
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  
  // URL에서 제스처 라벨과 민감한 제스처 여부 확인
  const gestureLabel = params.get('gesture_label') || '';
  const isSensitive = params.get('sensitive') === 'true';
  
  useEffect(() => {
    // 카메라 검색 결과이고, 민감한 제스처로 표시된 경우에만 처리
    if (location.pathname.includes('/search/camera') && isSensitive) {
      // 실제로 민감한 제스처인지 재확인 (보안상 이중 체크)
      if (isSensitiveGesture(gestureLabel)) {
        const warning = getSensitiveGestureWarning(gestureLabel);
        
        // 페이지 로드 후 약간의 지연을 두고 토스트 표시
        const timer = setTimeout(() => {
          toast.warning(warning.title, {
            description: warning.description,
            duration: 5000,
            position: 'top-right',
            icon: warning.icon,
          });
        }, 500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [location.pathname, gestureLabel, isSensitive]);
  
  // 이 컴포넌트는 UI를 렌더링하지 않음
  return null;
};

export default SensitiveGestureWarning;