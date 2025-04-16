/**
 * 섞인 답변의 목록을 출력하는 목적의 컴포넌트입니다.
 * 정답인 부분은 초록 색으로 바꾸기
 */
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { GlbViewer } from '@/components/GlbViewer';
import { FrontendQuestionData } from '@/types/quizTypes';
import { getQuizImage, hasQuizImage } from '@/utils/quizImagesUtils';

// 정적 제스처 ID 목록 - 이 목록에 있는 ID는 정적 이미지로 처리됩니다
const staticGestureIds = [
  1, 2, 4, 7, 8, 12, 15, 16, 19, 20, 22, 23, 24, 25, 26, 29, 30, 31, 32
];

// 제스처가 정적인지 확인하는 함수
const isStaticGesture = (gestureId: number | null): boolean => {
  if (!gestureId) return false;
  return staticGestureIds.includes(gestureId);
};

interface Answers2Props {
  options: FrontendQuestionData['options'];
  answer: FrontendQuestionData['answer'];
  onSelect: (answer: boolean) => void;
  isTimeOut?: boolean;
  isButtonDisabled?: boolean; // 마지막 1초에 버튼 비활성화 여부
  gestureType?: 'STATIC' | 'DYNAMIC'; // 제스처 타입 추가
}

const Answers2: React.FC<Answers2Props> = ({
  options,
  answer,
  onSelect,
  isTimeOut = false,
  isButtonDisabled = false,
  gestureType = 'STATIC', // 기본값은 STATIC으로 설정
}) => {
  const shuffledAnswers = useMemo(() => {
    return [...options].sort(() => Math.random() - 0.5);
  }, [options]);

  const [clicked, setClicked] = useState<boolean>(false);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const answerProcessedRef = useRef(false);

  const baseButtonClass =
    'flex items-center justify-center w-full h-full rounded-xl drop-shadow-quiz-box sm:text-sm md:text-xl lg:text-2xl font-[NanumSquareRoundB] cursor-pointer hover:brightness-95 transition-all';

  // 컴포넌트 마운트 시 초기화 및 로그 출력
  useEffect(() => {
    console.log('Answers2 컴포넌트 마운트/업데이트:', { 
      optionsCount: options.length,
      gestureType,
      options: options.map(o => ({
        id: o.id,
        meaning: o.meaning,
        gestureId: o.gestureId,
        gestureImage: o.gestureImage,
        hasImage: hasQuizImage(o.gestureId),
        isStatic: isStaticGesture(o.gestureId)
      }))
    });
    
    if (!isTimeOut) {
      setClicked(false);
      setSelectedOptionId(null);
      answerProcessedRef.current = false;
    }
  }, [options, isTimeOut, gestureType]);

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
      // 정답은 초록색으로 표시
      if (answer?.correctOptionId === optionId) {
        return 'bg-[var(--color-correct-300)] text-white';
      }
      // 나머지는 회색으로 표시
      return 'bg-gray-200';
    }

    // 사용자가 답을 선택한 경우
    if (clicked) {
      // 정답은 항상 초록색으로 표시
      if (answer?.correctOptionId === optionId) {
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
    // 이미 클릭되었거나 타임아웃이거나 1초 남은 경우 처리하지 않음
    if (clicked || isTimeOut || answerProcessedRef.current || isButtonDisabled) return;

    answerProcessedRef.current = true;
    const isCorrect = answer?.correctOptionId === optionId;
    setClicked(true);
    setSelectedOptionId(optionId);
    onSelect(isCorrect);
  };

  return (
    <div className="w-full h-[50vh] p-4">
      <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full h-full">
        {shuffledAnswers.map((option, index) => {
          // 각 옵션마다 해당하는 이미지 경로 가져오기
          const imagePath = getQuizImage(option.gestureId);
          
          const isStatic = gestureType === 'STATIC' && isStaticGesture(option.gestureId);
          const isDynamic = gestureType === 'DYNAMIC' || !isStatic;
          
          console.log(`옵션 ${index+1} 정보:`, {
            id: option.id,
            meaning: option.meaning,
            gestureId: option.gestureId,
            gestureImage: option.gestureImage,
            imagePath,
            isStatic,
            isDynamic,
            hasImage: hasQuizImage(option.gestureId)
          });

          return (
            <button
              key={option.id}
              type="button"
              className={`${baseButtonClass} ${getButtonColor(option.id)} ${
                isButtonDisabled && !clicked && !isTimeOut ? 'opacity-70' : ''
              }`}
              onClick={() => handleClick(option.id)}
              disabled={clicked || isTimeOut || isButtonDisabled}
            >
              <div className="flex flex-col items-center justify-center w-full h-full p-2">
                <p className="text-2xl mb-2">{['①', '②', '③', '④'][index]}</p>
                <div className="w-full h-[80%] flex items-center justify-center">
                  {isDynamic ? (
                    option.gestureImage ? (
                      <div className="h-full w-full flex items-center justify-center">
                        <GlbViewer url={option.gestureImage} />
                        {/* <div className="absolute inset-0 bg-transparent z-10"></div> //클릭에러*/}
                      </div>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 font-[NanumSquareRoundB]">
                        동적 제스처 준비 중
                      </div>
                    )
                  ) : (
                    imagePath ? (
                      <img 
                        src={imagePath} 
                        alt={option.meaning || "퀴즈 이미지"} 
                        className="h-80 w-80 object-contain" 
                        onError={(e) => {
                            // 이미지 로드 실패 시 대체 텍스트 표시
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = `<div class="text-center text-gray-400 font-[NanumSquareRoundB]">이미지 로드 실패<br>${option.meaning || ''}</div>`;
                        }}
                      />
                      
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 font-[NanumSquareRoundB]">
                        이미지 준비 중
                      </div>
                    )
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Answers2;