import QuizWrongLottie from '../../components/QuizWrongLottie';
import QuizCorrectLottie from '../../components/QuizCorrectLottie';

interface AnimationProps {
  showWrongImage: boolean;
  showCorrectImage: boolean;
  onWrongAnimationComplete?: () => void;
  onCorrectAnimationComplete?: () => void;
  animationSpeed?: number; // 애니메이션 속도 조절을 위한 속성 추가
  wrongImageSize?: string | number; // wrong 이미지 크기 조절
  correctImageSize?: string | number; // correct 이미지 크기 조절
}

function Animation({ 
  showWrongImage, 
  showCorrectImage,
  onWrongAnimationComplete,
  onCorrectAnimationComplete,
  animationSpeed = 1.5, // 기본 속도값 설정
  wrongImageSize = '50vh', // wrong 이미지 기본 크기 축소
  correctImageSize = '90vh' // correct 이미지 기본 크기 유지
}: AnimationProps): JSX.Element {
  return (
    <>
      {showCorrectImage && (
        <QuizCorrectLottie 
          width={correctImageSize} 
          height={correctImageSize} 
          autoPlay={true}
          speed={animationSpeed}
          onComplete={onCorrectAnimationComplete}
        />
      )}
      {showWrongImage && (
        <QuizWrongLottie 
          width={wrongImageSize} 
          height={wrongImageSize} 
          autoPlay={true}
          speed={animationSpeed}
          onComplete={onWrongAnimationComplete}
        />
      )}
    </>
  );
}

export default Animation;