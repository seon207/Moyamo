import { useState, useRef, useEffect } from 'react';
import { FrontendQuestionData } from '@/types/quizTypes';
import GestureQuizCamera from '@/components/GestureQuizCamera';

interface Answers3Props {
  options: FrontendQuestionData['options'];
  answer: FrontendQuestionData['answer'];
  onSelect: (answer: boolean) => void;
  isTimeOut?: boolean;
  questionData?: FrontendQuestionData;
}

const Answers3: React.FC<Answers3Props> = ({ onSelect, answer, questionData, isTimeOut }) => {
  const [isAnswered, setIsAnswered] = useState(false);
  // 중요: 답변 제출 여부를 추적하는 ref
  const hasSubmittedRef = useRef(false);
  // API 연결 상태 추적
  const [apiConnected, setApiConnected] = useState(false);

  // 컴포넌트 마운트/언마운트 추적
  useEffect(() => {
    console.log('[Answers3] 컴포넌트 마운트됨');

    return () => {
      console.log('[Answers3] 컴포넌트 언마운트됨');
      // 언마운트 시 hasSubmittedRef 초기화
      hasSubmittedRef.current = false;
    };
  }, []);

  // API 연결 상태 변경 처리
  const handleApiConnectionStatus = (connected: boolean) => {
    console.log(`[Answers3] API 연결 상태 변경: ${connected}`);
    setApiConnected(connected);
  };

  // 제스처 인식 성공 시 호출될 함수
  const handleGestureCorrect = (correct: boolean) => {
    // 이미 답변을 제출했거나 타임아웃된 경우 무시
    if (hasSubmittedRef.current || isTimeOut) {
      console.log('[Answers3] 이미 제출됨 또는 타임아웃, 제스처 무시');
      return;
    }

    console.log('[Answers3] 제스처 인식 결과:', correct ? '정답' : '오답');

    // 정답 처리
    hasSubmittedRef.current = true;
    setIsAnswered(true);
    onSelect(correct);
  };

  // 타임아웃 감지
  useEffect(() => {
    if (isTimeOut && !hasSubmittedRef.current) {
      console.log('[Answers3] 타임아웃 발생, 오답으로 처리');
      hasSubmittedRef.current = true;
      setIsAnswered(true);
      // 타임아웃 시 오답으로 처리하도록 수정
      onSelect(false);
    }
  }, [isTimeOut, onSelect]);

  // 디버그 로깅
  useEffect(() => {
    console.log(
      `[Answers3] 상태 업데이트: isAnswered=${isAnswered}, isTimeOut=${isTimeOut}, apiConnected=${apiConnected}`
    );
  }, [isAnswered, isTimeOut, apiConnected]);

  return (
    <div className="flex justify-center relative h-screen mx-[2vh] xl:mx-[10vh] bg-transparent">
      <div className="h-1/3 sm:h-1/2 w-auto aspect-square relative">
        <div className="absolute inset-0">
          <GestureQuizCamera
            guidelineClassName="max-w-[500px] w-[40%] lg:w-[60%] top-16 lg:top-22"
            guideText={isAnswered ? '' : '제스처를 유지해주세요.'}
            correctGestureName={answer?.correctGestureName}
            gestureType={questionData?.gestureType}
            isPaused={isAnswered || isTimeOut} // 정답 처리되면 카메라 일시 정지
            isTimeOut={isTimeOut} // 타임아웃 상태 전달
            onCorrect={handleGestureCorrect}
            onConnectionStatus={handleApiConnectionStatus} // API 연결 상태 콜백 추가
          />
        </div>
      </div>
    </div>
  );
};

export default Answers3;
