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
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50">
      {/* 반투명 배경 */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm"></div>

      {/* 로딩 콘텐츠 */}
      <div className="z-10 flex flex-col items-center justify-center bg-white dark:bg-gray-900 p-10 rounded-xl shadow-lg">
        <Lottie
          animationData={loadingAnimation}
          loop={true}
          autoplay={true}
          style={{ width: size, height: size }}
        />
        <p className="mt-10 text-[40px] font-[DNFBitBitv2] text-black dark:text-d-txt-50">
          퀴즈로 이동 중...
        </p>
      </div>
    </div>
  );
}

export default LoadingPage;
