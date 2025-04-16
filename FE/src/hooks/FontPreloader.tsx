// 폰트 빠른 로딩 필요할 때 사용하는 컴포넌트
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// preload 대신 preconnect 사용
function setupFontPreconnect(url: string): void {
  const domain = new URL(url).origin;
  
  // 이미 존재하는 preconnect 링크 확인
  const existingLink = document.querySelector(`link[rel="preconnect"][href="${domain}"]`);
  if (!existingLink) {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }
}

function FontPreloader() {
  const location = useLocation();
  const fontUrl = 'https://cdn.df.nexon.com/img/common/font/DNFBitBitv2.otf';

  useEffect(() => {
    // 홈페이지에서만 실행
    if (location.pathname === '/') {
      // preconnect 설정
      setupFontPreconnect(fontUrl);
      
      // 필요한 경우에만 - 이미 index.css에서 font-face를 정의했다면 이 부분은 필요 없음
      // ensureFontStyle(fontUrl);
    }
    
    // 컴포넌트 언마운트 시 cleanup 함수 (선택사항)
    return () => {
      // 필요한 경우 cleanup 로직 추가
    };
  }, [location, fontUrl]);

  return null;
}

export default FontPreloader;