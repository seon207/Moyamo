// 수정된 OfflineIndicator.tsx 예시
import { useEffect, useState } from 'react';

const OfflineIndicator = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // 초기 연결 상태 확인
    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 초기 상태를 다시 한번 체크 (추가)
    setTimeout(() => {
      setIsOffline(!navigator.onLine);
    }, 1000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black">
      <div className="text-center p-4">
        <div className="mb-4">
          <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h10a4 4 0 004-4v-4a4 4 0 00-4-4H7a4 4 0 00-4 4v4z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v6m0 0V9m0 0l-4 4m4-4l4 4" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">인터넷 연결이 필요합니다</h2>
        <p className="mb-4">현재 오프라인 상태입니다. 이 앱을 사용하려면 인터넷 연결이 필요합니다.</p>
        <p className="mb-4">네트워크 연결을 확인한 후 다시 시도해 주세요.</p>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => window.location.reload()}
        >
          다시 시도
        </button>
      </div>
    </div>
  );
};

export default OfflineIndicator;