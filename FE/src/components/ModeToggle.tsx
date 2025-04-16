// src/components/DataModeToggle.tsx
import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toggleMockDataMode, isMockDataMode } from '@/services/searchService';

// 개발 환경에서만 표시되는 데이터 소스 전환 컴포넌트
function ModeToggle() {
  const [useMockData, setUseMockData] = useState(isMockDataMode());
  
  // 모드 변경 시 처리
  const handleToggle = (checked: boolean) => {
    toggleMockDataMode(checked);
    setUseMockData(checked);
  };
  
  // 초기값 설정
  useEffect(() => {
    setUseMockData(isMockDataMode());
  }, []);
  
  // 프로덕션 환경에서는 표시하지 않음
  if (import.meta.env.MODE === 'production') {
    return null;
  }
  
  return (
    <div className="flex items-center space-x-2 p-2 mb-4 bg-gray-200 rounded-md">
      <Switch
        id="data-mode"
        checked={useMockData}
        onCheckedChange={handleToggle}
        className='bg-gray-400'
      />
      <Label htmlFor="data-mode" className="cursor-pointer">
        {useMockData ? '목 데이터 사용 중' : '실제 API 사용 중'}
      </Label>
      <div className="text-xs text-gray-500 ml-2">
        (개발 환경 전용)
      </div>
    </div>
  );
};

export default ModeToggle;