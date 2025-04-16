import { useEffect } from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../assets/lottie/loading.json';

interface LoadingPageProps {
  minDuration?: number; // 최소 표시 시간
  size?: number; // 애니메이션 크기
  onComplete?: () => void; // 완료 콜백
}

function LoadingPage({ minDuration = 1000, size = 200, onComplete }: LoadingPageProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f5] dark:bg-gray-900">
      <Lottie
        animationData={loadingAnimation}
        loop={true}
        autoplay={true}
        style={{ width: size, height: size }}
      />
      <p className="mt-10 text-[40px] font-[DNFBitBitv2] text-black dark:text-d-txt-50">
        Loading...
      </p>
    </div>
  );
}

export default LoadingPage;
