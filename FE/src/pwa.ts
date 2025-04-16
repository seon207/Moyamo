import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    // 새 버전이 있을 때 사용자에게 알림
    if (confirm('새 버전이 있습니다. 업데이트하시겠습니까?')) {
      updateSW();
    }
  },
  onOfflineReady() {
    // 오프라인 모드 준비 완료 시 알림
    console.log('앱이 오프라인에서도 사용할 수 있습니다');
    
    // 선택사항: 토스트 메시지 표시
    const toast = document.createElement('div');
    toast.className = 'offline-toast';
    toast.textContent = '오프라인에서도 사용 가능합니다';
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  },
});

// 오프라인 토스트 메시지 스타일
const style = document.createElement('style');
style.textContent = `
  .offline-toast {
    position: fixed;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #4CAF50;
    color: white;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    z-index: 9999;
    animation: fadeInOut 3s ease-in-out;
  }
  
  @keyframes fadeInOut {
    0% { opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { opacity: 0; }
  }
`;
document.head.appendChild(style);

export default updateSW;