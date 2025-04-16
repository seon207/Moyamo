//카메라를 사용하는 문제에서 카메라를 준비하는 시간 5초를 카운트다운하는 컴포넌트입니다.
import { useState, useEffect } from 'react';

interface CameraTimerProps {
  onTimerEnd: () => void;
}

function CameraTimer({ onTimerEnd }: CameraTimerProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimerEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimerEnd]);

  return (
    <div className="h-full  bg-black/50 z-50 ">
      <div className="flex-col justify-center items-center text-white text-center">
        <p className="text-3xl font-bold mb-4">{countdown}초</p>
      </div>
    </div>
  );
}

export default CameraTimer;
