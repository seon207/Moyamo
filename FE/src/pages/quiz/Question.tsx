import Progress from './Progress.tsx';
import Answers from './Answers.tsx';
import Answers2 from './Answers2.tsx';
import Answers3 from './Answers3.tsx';
import PbNumber from './PbNumber.tsx';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useCallback, useEffect, useRef } from 'react';
import { FrontendQuestionData } from '@/types/quizTypes';
import Animation from './Animation.tsx';
import QuizLoadingPage from '@/components/QuizLoading';

interface ResultProps {
  Index: number;
  onSelectAnswer: (answer: boolean | null) => void;
  questionData: FrontendQuestionData;
  isFirstLoad: boolean; // 첫 로딩 상태
  onFirstLoadComplete: () => void; // 첫 로딩 완료 콜백
}

interface AnswerState {
  isCorrect: boolean | null;
}

function Question({ onSelectAnswer, Index, questionData, isFirstLoad, onFirstLoadComplete }: ResultProps): JSX.Element {
  const [answer, setAnswer] = useState<AnswerState>({
    isCorrect: null,
  });
  const [showCorrectImage, setShowCorrectImage] = useState<boolean>(false);
  const [showWrongImage, setShowWrongImage] = useState<boolean>(false);
  const [timer, setTimer] = useState(questionData.type === 'CAMERA' ? 30000 : 10000);
  const [progressClass, setProgressClass] = useState('bg-[var(--color-kr-600)]');
  const [startProgress, setStartProgress] = useState(true);
  const [isTimeOut, setIsTimedOut] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isMountedRef = useRef(true);
  const answerProcessedRef = useRef(false);
  const timeoutProcessedRef = useRef(false);
  const nextQuestionCalledRef = useRef(false);
  const animationDelayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const nextQuestionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 로딩 완료 핸들러
  const handleLoadingComplete = useCallback(() => {
    if (isMountedRef.current) {
      setIsLoading(false);
      onFirstLoadComplete(); // 부모 컴포넌트에 첫 로딩 완료 알림
      console.log('[Question] 로딩 완료');
    }
  }, [onFirstLoadComplete]);

  // 로딩 상태 처리 함수
  const handleLoading = useCallback((duration: number = 1500) => {
    setIsLoading(true);

    // 이전 타이머가 있다면 제거
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
    }

    // 지정된 시간 후 로딩 상태 해제
    loadingTimerRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setIsLoading(false);
        console.log('[Question] 로딩 완료');
      }
    }, duration);
  }, []);

  // 로딩 상태 수동으로 설정하는 함수
  const setLoadingState = useCallback((state: boolean) => {
    setIsLoading(state);
    console.log(`[Question] 로딩 상태 설정: ${state}`);
  }, []);

  // 컴포넌트 마운트/언마운트 처리
  useEffect(() => {
    console.log(`[Question] 컴포넌트 마운트됨, 문제 인덱스: ${Index}, 타입: ${questionData.type}`);
    isMountedRef.current = true;
    answerProcessedRef.current = false;
    timeoutProcessedRef.current = false;
    nextQuestionCalledRef.current = false;
    setIsTimedOut(false);

    // 첫 번째 문제일 때만 로딩 화면 표시
    if (isFirstLoad) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }

    return () => {
      console.log(`[Question] 컴포넌트 언마운트됨, 문제 인덱스: ${Index}`);
      isMountedRef.current = false;

      // 모든 타이머 정리
      if (animationDelayTimerRef.current) {
        clearTimeout(animationDelayTimerRef.current);
        animationDelayTimerRef.current = null;
      }

      if (nextQuestionTimerRef.current) {
        clearTimeout(nextQuestionTimerRef.current);
        nextQuestionTimerRef.current = null;
      }

      // 로딩 타이머 정리 추가
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }
    };
  }, [Index, questionData.type, isFirstLoad]);

  // 안전하게 다음 문제로 이동하는 함수
  const safelyGoToNextQuestion = useCallback(
    (isCorrect: boolean | null) => {
      // 이미 다음 문제로 넘어갔거나 컴포넌트가 언마운트된 경우
      if (nextQuestionCalledRef.current || !isMountedRef.current) {
        console.log('[Question] 이미 다음 문제로 넘어갔거나 컴포넌트가 언마운트됨. 무시.');
        return;
      }

      console.log(`[Question] 다음 문제로 이동: ${isCorrect}`);
      nextQuestionCalledRef.current = true;

      // 다음 문제로 넘어가기 전 Animation 숨기기
      setShowCorrectImage(false);
      setShowWrongImage(false);

      // 부모 컴포넌트 콜백 호출
      onSelectAnswer(isCorrect);
    },
    [onSelectAnswer]
  );

  // 타임아웃 또는 스킵 처리
  const handleSkipAnswer = useCallback((): void => {
    // 이미 처리된 경우 중복 처리 방지
    if (answerProcessedRef.current || !isMountedRef.current || timeoutProcessedRef.current) {
      console.log('[Question] 이미 답변이 처리되었거나 언마운트됨. 스킵 무시.');
      return;
    }

    console.log('[Question] Skip button clicked or timer expired');
    timeoutProcessedRef.current = true;
    setIsTimedOut(true);
    setStartProgress(false); // 타이머 중지

    // 오답 이미지 표시
    setShowWrongImage(true);

    // 타이머 중지 및 1초 후 다음 문제로 이동
    if (nextQuestionTimerRef.current) {
      clearTimeout(nextQuestionTimerRef.current);
    }

    nextQuestionTimerRef.current = setTimeout(() => {
      safelyGoToNextQuestion(false); // 스킵은 false(오답)로 처리
    }, 1000);
  }, [safelyGoToNextQuestion]);

  // 답변 선택 핸들러 - 안전하게 처리
  function handleSelectAnswer(isCorrect: boolean | null) {
    // 이미 처리되었거나 컴포넌트가 언마운트된 경우 무시
    if (answerProcessedRef.current || !isMountedRef.current || timeoutProcessedRef.current) {
      console.log(`[Question] 답변 이미 처리됨 또는 언마운트됨, 무시: ${isCorrect}`);
      return;
    }

    console.log(`[Question] 답변 처리 시작: ${isCorrect}`);
    answerProcessedRef.current = true;

    // 타이머 중지 (답변이 선택된 경우)
    setStartProgress(false);

    // 모든 케이스(정답, 오답, 스킵)에 대해 처리
    setAnswer({
      isCorrect: isCorrect,
    });

    // 스킵(null) 처리
    if (isCorrect === null) {
      setShowWrongImage(true); // 스킵도 오답으로 처리
    } else {
      // 정답/오답 처리
      if (isCorrect) {
        setShowCorrectImage(true);
      } else {
        setShowWrongImage(true);
      }
    }

    // 기존 타이머가 있으면 제거
    if (nextQuestionTimerRef.current) {
      clearTimeout(nextQuestionTimerRef.current);
    }

    // 이미지 표시를 위한 타이머 (1초 후 이미지 숨김 및 다음 문제 이동)
    nextQuestionTimerRef.current = setTimeout(() => {
      safelyGoToNextQuestion(isCorrect);
    }, 1000);
  }

  // Progress 컴포넌트의 타임아웃 리스너
  useEffect(() => {
    // 컴포넌트가 언마운트되면 리스너 제거
    if (!isMountedRef.current) return;

    // Progress 컴포넌트에서 타임아웃 이벤트가 발생하면
    const progressTimeout = () => {
      // 이미 처리되었으면 무시
      if (
        answerProcessedRef.current ||
        timeoutProcessedRef.current ||
        nextQuestionCalledRef.current
      ) {
        return;
      }

      // 타임아웃 처리
      handleSkipAnswer();
    };

    // Progress 컴포넌트에서 onTimeout이 호출될 때 타임아웃 처리
    if (timer <= 0 && startProgress) {
      progressTimeout();
    }
  }, [timer, startProgress, handleSkipAnswer]);

  return (
    <div className="h-screen mx-[2vh] xl:mx-[10vh] bg-transparent">
      {/* 로딩 모달 */}
      {isLoading && isFirstLoad && (
        <QuizLoadingPage
          minDuration={2000}
          index={Index + 1} // 인덱스는 0부터 시작하므로 1을 더해 1번부터 표시
          onComplete={handleLoadingComplete}
        />
      )}

      {!isLoading && (
        <div className="h-1/3">
          <Animation showCorrectImage={showCorrectImage} showWrongImage={showWrongImage} />
          <div className="h-screen flex flex-col mt-[5vh] xl:mt-[10vh] ">
            <div className="flex justfy-center items-center align-middle">
              <PbNumber Index={Index} />
            </div>

            <Progress
              key={`${Index}-${timer}`}
              timeout={timer}
              startProgress={startProgress}
              onTimeout={handleSkipAnswer}
              className={progressClass}
            />

            <div className="flex justify-between items-center mt-[3vh]">
              <h1 className="sm:text-sm md:text-2xl lg:text-3xl 2xl:text-4xl font-[NanumSquareRoundB] mx-[2%] dark:text-white">
                {`Q${Index + 1}. ${questionData?.text}`}
              </h1>
              <button
                className="flex justify-between items-center rounded-2xl py-1 px-3 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer dark:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
                onClick={handleSkipAnswer}
                disabled={answer.isCorrect !== null || isTimeOut || answerProcessedRef.current}
              >
                <p className="sm:text-xs md:text-xl 2xl:text-2xl font-[NanumSquareRoundB]">Skip</p>
                <FontAwesomeIcon icon={faArrowRight} className="m-3 sm:text-xs md:text-xl" />
              </button>
            </div>
            <div className="h-2/3 w-full overflow-x-visible mt-[3vh]">
              {questionData?.type === 'MEANING' && (
                <Answers
                  options={questionData.options}
                  answer={questionData.answer}
                  onSelect={handleSelectAnswer}
                  quizImage={questionData.gestureUrl}
                  isTimeOut={isTimeOut}
                />
              )}
              {questionData?.type === 'GESTURE' && (
                <Answers2
                  options={questionData.options}
                  answer={questionData.answer}
                  onSelect={handleSelectAnswer}
                  isTimeOut={isTimeOut}
                />
              )}
              {questionData?.type === 'CAMERA' && (
                <Answers3
                  key={`camera-answer-${Index}`}
                  options={questionData.options}
                  answer={questionData.answer}
                  onSelect={handleSelectAnswer}
                  isTimeOut={isTimeOut}
                  questionData={questionData}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Question;
