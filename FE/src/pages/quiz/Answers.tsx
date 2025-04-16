/**
 * 섞인 답변의 목록을 출력하는 목적의 컴포넌트입니다.
 * 정답인 부분은 초록 색으로 바꾸기
 */
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { GlbViewer } from '@/components/GlbViewer';
import { FrontendQuestionData } from '@/types/quizTypes';

interface AnswersProps {
  options: FrontendQuestionData['options'];
  answer: FrontendQuestionData['answer'];
  onSelect: (answer: boolean) => void;
  quizImage: string | null;
  isTimeOut?: boolean;
  isButtonDisabled?: boolean; // 마지막 1초에 버튼 비활성화 여부
}

const Answers: React.FC<AnswersProps> = ({
  options,
  answer,
  onSelect,
  quizImage,
  isTimeOut = false,
  isButtonDisabled = false,
}) => {
  const shuffledAnswers = useMemo(() => {
    return [...options].sort(() => Math.random() - 0.5);
  }, [options]);

  const [clicked, setClicked] = useState<boolean>(false);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const answerProcessedRef = useRef(false);

  const baseButtonClass =
    'flex items-center p-[2vh] w-full h-[22%] mb-[2vh] rounded-xl drop-shadow-quiz-box sm:text-sm md:text-3xl lg:text-4xl font-[NanumSquareRoundB] cursor-pointer';

  // 새로운 문제가 로드될 때마다 상태 초기화
  useEffect(() => {
    if (!isTimeOut) {
      setClicked(false);
      setSelectedOptionId(null);
      answerProcessedRef.current = false;
    }
  }, [options, isTimeOut]);

  // 타임아웃 처리
  useEffect(() => {
    if (isTimeOut && !clicked && !answerProcessedRef.current) {
      answerProcessedRef.current = true;
      setClicked(true);
      // 부모 컴포넌트에 타임아웃 알림 (오답으로 처리)
      onSelect(false);
    }
  }, [isTimeOut, clicked, onSelect]);

  const getButtonColor = (optionId: number): string => {
    // 타임아웃인 경우
    if (isTimeOut) {
      if (answer?.correctOptionId === optionId) {
        return 'bg-[var(--color-correct-300)] text-white';
      }
      return 'bg-gray-200';
    }

    // 클릭한 경우
    if (clicked) {
      const isCorrect = answer?.correctOptionId === optionId;

      // 정답은 항상 초록색으로 표시
      if (isCorrect) {
        return 'bg-[var(--color-correct-300)] text-white';
      }

      // 사용자가 선택한 오답은 빨간색으로 표시
      if (selectedOptionId === optionId) {
        return 'bg-[var(--color-wrong-300)] text-white';
      }

      // 나머지는 회색으로 표시
      return 'bg-gray-200';
    }

    // 기본 상태 (선택되지 않음)
    return 'bg-[var(--color-unselected-300)]';
  };

  const handleClick = (optionId: number): void => {
    // 이미 클릭되었거나 타임아웃이거나 마지막 1초인 경우 처리하지 않음
    if (clicked || isTimeOut || answerProcessedRef.current || isButtonDisabled) return;

    answerProcessedRef.current = true;
    const isCorrect = answer?.correctOptionId === optionId;
    setClicked(true);
    setSelectedOptionId(optionId);
    onSelect(isCorrect);
  };

  return (
    <>
      <div className="h-100 flex flex-row justify-around my-3">
        <p className="sm:text-sm md:text-3xl lg:text-4xl font-[NanumSquareRoundB] cursor-pointer">
          {answer.correctGestureName}
        </p>
        {/* 문제 이미지 부분 */}
        <div className="bg-white w-[44%] h-full rounded-xl drop-shadow-quiz-box flex justify-center items-center">
          {quizImage && <GlbViewer url={quizImage} />}
        </div>
        {/* 퀴즈 보기 */}
        <div className="w-[44%] h-full flex flex-col justify-between">
          {shuffledAnswers.map((option, index) => (
            <button
              key={option.id}
              type="button"
              className={`${baseButtonClass} ${getButtonColor(option.id)} ${
                isButtonDisabled && !clicked && !isTimeOut ? 'opacity-70' : ''
              }`}
              onClick={() => handleClick(option.id)}
              disabled={clicked || isTimeOut || isButtonDisabled}
            >
              <p className="mr-5">{['①', '②', '③', '④'][index]}</p>
              <p>{option.meaning}</p>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Answers;
