import { useEffect } from 'react';

// 강력한 줌 방지 훅
export const useZoomPrevention = () => {
  useEffect(() => {
    // 메타 태그 설정
    const setViewportMeta = () => {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      } else {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(meta);
      }
    };

    // 초기 메타 태그 설정
    setViewportMeta();

    // DOM이 변경될 때마다 메타 태그 확인 (다른 스크립트가 변경할 수 있음)
    const observer = new MutationObserver(() => {
      setViewportMeta();
    });
    
    observer.observe(document.head, { 
      childList: true, 
      subtree: true 
    });

    // 키보드 단축키 방지 (더 철저한 방법)
    const preventKeyboardZoom = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && 
          (e.key === '+' || e.key === '-' || e.key === '=' || 
          e.key === '0' || e.which === 187 || e.which === 189 || e.which === 48)) {
        e.preventDefault();
        return false;
      }
    };

    // 터치 핀치 줌 방지
    const preventTouchZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // 휠 줌 방지 (캡처링 단계에서 적용)
    const preventWheelZoom = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // 제스처 이벤트 방지
    const preventGestureZoom = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // CSS 설정 
    const style = document.createElement('style');
    style.textContent = `
      html, body {
        touch-action: pan-x pan-y !important;
        -ms-touch-action: pan-x pan-y !important;
        -webkit-touch-callout: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        overscroll-behavior: none !important;
      }
    `;
    document.head.appendChild(style);

    // 모든 이벤트에 대해 캡쳐링 단계에서 리스너 추가 (캡처링은 이벤트가 하위 요소로 전파되기 전에 먼저 호출됨)
    window.addEventListener('keydown', preventKeyboardZoom, { capture: true });
    window.addEventListener('wheel', preventWheelZoom, { passive: false, capture: true });
    window.addEventListener('touchstart', preventTouchZoom, { passive: false, capture: true });
    window.addEventListener('touchmove', preventTouchZoom, { passive: false, capture: true });
    
    // iOS Safari용 제스처 이벤트
    window.addEventListener('gesturestart', preventGestureZoom, { passive: false, capture: true });
    window.addEventListener('gesturechange', preventGestureZoom, { passive: false, capture: true });
    window.addEventListener('gestureend', preventGestureZoom, { passive: false, capture: true });

    // 최초 페이지 로드 시 줌 리셋 (이미 확대된 상태라면 초기화)
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      // iOS용 더블 탭 이벤트 제거 (투명 오버레이로 처리)
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 999999;
        touch-action: none;
      `;
      document.body.appendChild(overlay);
      
      // Safari 모바일용 빠른 줌 초기화
      setTimeout(() => {
        window.scrollTo(0, 1);
        window.scrollTo(0, 0);
      }, 100);
    }

    return () => {
      // 이벤트 리스너 정리
      window.removeEventListener('keydown', preventKeyboardZoom, { capture: true });
      window.removeEventListener('wheel', preventWheelZoom, { capture: true });
      window.removeEventListener('touchstart', preventTouchZoom, { capture: true });
      window.removeEventListener('touchmove', preventTouchZoom, { capture: true });
      window.removeEventListener('gesturestart', preventGestureZoom, { capture: true });
      window.removeEventListener('gesturechange', preventGestureZoom, { capture: true });
      window.removeEventListener('gestureend', preventGestureZoom, { capture: true });
      
      // 옵저버 정리
      observer.disconnect();
      
      // 스타일 제거
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);
};