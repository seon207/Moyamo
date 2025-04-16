import { useRef, useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import quizCorrectAnimation from '@/assets/lottie/quizCorrect.json';

interface QuizCorrectLottieProps {
  width?: number | string;
  height?: number | string;
  autoPlay?: boolean;
  speed?: number;
  onComplete?: () => void;
}

function QuizCorrectLottie({
  width = '90vh',
  height = '900vh',
  autoPlay = true,
  speed = 2,
  onComplete,
}: QuizCorrectLottieProps) {
  const lottieRef = useRef<any>(null);
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    if (lottieRef.current) {
      // 초기화 완료 표시
      setInitialized(true);
      
      // 애니메이션 속도 설정
      lottieRef.current.setSpeed(speed);
      
      // 애니메이션 완료 이벤트 처리
      if (onComplete) {
        lottieRef.current.addEventListener('complete', onComplete);
        
        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
          lottieRef.current?.removeEventListener('complete', onComplete);
        };
      }
    }
  }, [lottieRef.current, onComplete, speed]);

  return (
    <div
      style={{
        width,
        height,
        overflow: 'hidden',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
      }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={quizCorrectAnimation}
        loop={false}
        autoplay={autoPlay}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
}

export default QuizCorrectLottie;