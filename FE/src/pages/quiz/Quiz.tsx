import { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Question from './Question.tsx';
import QuizResult from './QuizResult';
import { useQuizQuestions } from '@/hooks/apiHooks';

function Quiz() {
  const [userAnswers, setUserAnswers] = useState<(boolean | null)[]>([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true); // 첫 로딩 상태 추가
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const useCamera = queryParams.get('useCamera') === 'true';

  // useQuizQuestions 훅 사용
  const { data: quizData, isLoading, error } = useQuizQuestions(useCamera);
  const activeQuestionIndex = userAnswers.length;

  // 퀴즈 완료 조건 수정
  const quizIsComplete = quizData && activeQuestionIndex >= quizData.length;

  const handleSelectAnswer = useCallback(
    (selectedAnswer: boolean | null): void => {
      setUserAnswers((prevUserAnswers) => {
        const newAnswers = [...prevUserAnswers, selectedAnswer];
        // console.log('현재 답변 상태:', {
        //   '전체 문제 수': quizData?.length,
        //   '현재 답변 수': newAnswers.length,
        //   '현재 답변들': newAnswers,
        // });
        return newAnswers;
      });
    },
    [quizData?.length]
  );

  const handleFirstLoadComplete = useCallback(() => {
    setIsFirstLoad(false); // 첫 로딩 완료 시 상태 업데이트
  }, []);

  // 디버깅을 위한 상태 출력
  // console.log('퀴즈 상태:', {
  //   '전체 문제 수': quizData?.length,
  //   '현재 문제 인덱스': activeQuestionIndex,
  //   '퀴즈 완료 여부': quizIsComplete,
  // });

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>에러가 발생했습니다.</div>;
  }

  if (quizIsComplete) {
    return <QuizResult userAnswers={userAnswers} />;
  }

  if (!quizData || activeQuestionIndex >= quizData.length) {
    return null;
  }

  return (
    <Question
      key={activeQuestionIndex} // 여전히 고유 key 유지
      Index={activeQuestionIndex}
      onSelectAnswer={handleSelectAnswer}
      questionData={quizData[activeQuestionIndex]}
      isFirstLoad={isFirstLoad} // 첫 로딩 상태 전달
      onFirstLoadComplete={handleFirstLoadComplete} // 첫 로딩 완료 콜백 전달
    />
  );
}

export default Quiz;
