import { useRef, useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import quizTwinkleAnimation from '@/assets/lottie/quizTwinkle.json';

interface QuizTwinkleLottieProps {
  width?: string | number;
  height?: string | number;
  autoPlay?: boolean;
  loop?: boolean;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

function QuizTwinkleLottie({
  width = '100%',
  height = '100%',
  autoPlay = true,
  loop = true,
  speed = 1,
  className = '',
  onComplete,
}: QuizTwinkleLottieProps) {
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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      className={className}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={quizTwinkleAnimation}
        loop={loop}
        autoplay={autoPlay}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
}

export default QuizTwinkleLottie;