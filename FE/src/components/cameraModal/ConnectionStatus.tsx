// ConnectionStatus.tsx
import { useEffect, useState } from 'react';

interface ConnectionStatusProps {
  isServerConnected: boolean;
  isOpen: boolean;
}

function ConnectionStatus({ isServerConnected, isOpen }: ConnectionStatusProps) {
  const [showStatus, setShowStatus] = useState(false);

  // isOpen 값이 변경되면(모달이 열리거나 닫히면) 상태를 업데이트
  useEffect(() => {
    if (isOpen) {
      // 모달이 열리면 0.5초 후에 상태를 표시
      const timer = setTimeout(() => {
        setShowStatus(true);
      }, 500);

      return () => {
        clearTimeout(timer);
      };
    } else {
      // 모달이 닫히면 즉시 상태 숨김
      setShowStatus(false);
    }
  }, [isOpen]);

  if (!showStatus) return null;

  return (
    <div
      className="absolute top-2 right-2 py-1 px-3 
      rounded-full flex items-center gap-2
      bg-black/50 dark:bg-white/20 backdrop-blur-md
      z-50"
    >
      {/* 상태 표시 아이콘 */}
      <div
        className={`w-2 h-2 rounded-full
        ${isServerConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
      />

      {/* 상태 텍스트 */}
      <span className="text-xs text-white dark:text-d-txt-50">
        {isServerConnected ? '서버 연결됨' : '서버 연결 중...'}
      </span>
    </div>
  );
};

export default ConnectionStatus;
