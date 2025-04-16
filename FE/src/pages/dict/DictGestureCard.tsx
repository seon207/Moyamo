import { useState, useRef, useEffect } from 'react';
import { GestureItem } from '@/types/dictionaryType';
import { cn } from '@/lib/utils';
import { getCarouselGestureImage } from '@/utils/carouselImageUtils'; // 캐러셀 전용 이미지 유틸 임포트

// 제스처 카드 컴포넌트 프롭 타입
interface DictGestureCardProps {
  gesture: GestureItem;
  onClick: () => void;
  hoverBorderClass: string;
  isVisible?: boolean;
  isSelected?: boolean; // 선택된 카드인지 여부
  selectedBorderClass?: string; // 선택된 카드 테두리 클래스
}

export function DictGestureCard({
  gesture,
  onClick,
  hoverBorderClass,
  isVisible = false, // 기본값은 false로 설정
  isSelected = false,
  selectedBorderClass = 'border-gray-500',
}: DictGestureCardProps) {
  const [shouldLoad, setShouldLoad] = useState(isVisible);
  const cardRef = useRef<HTMLDivElement>(null);

  // 주석: GlbViewer 대신 캐러셀 이미지 유틸을 사용하여 이미지 가져오기
  const imageUrl = gesture.gestureLabel ? getCarouselGestureImage(gesture.gestureLabel) : '';

  useEffect(() => {
    // isVisible prop이 true로 변경되면 로딩 시작
    if (isVisible && !shouldLoad) {
      setShouldLoad(true);
    }
  }, [isVisible, shouldLoad]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !shouldLoad) {
          setShouldLoad(true);
        }
      },
      { threshold: 0.1 } // 10%만 보여도 로딩 시작
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [shouldLoad]);

  // 선택 상태에 따른 테두리 클래스 결정
  const borderClass = isSelected ? selectedBorderClass : 'border-gray-300';

  return (
    <div
      ref={cardRef}
      className={cn(
        'h-full w-full rounded-lg overflow-hidden bg-white shadow-sm mx-auto',
        'cursor-pointer transition-all duration-200 group',
        hoverBorderClass,
        // border 스타일을 분리하여 동적으로 적용
        borderClass,
        // 선택된 상태일 때 테두리 두께 증가
        isSelected ? 'border-2' : 'border'
      )}
      onClick={onClick}
    >
      <div className="h-full flex flex-col">
        {/* 이미지 영역 */}
        <div className="flex items-center justify-center sm:p-3 h-[75%]">
          {shouldLoad ? (
            imageUrl ? (
              <img src={imageUrl} alt={gesture.gestureTitle} className="h-80 w-80 object-contain" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400 font-[NanumSquareRoundB]">
                이미지 준비 중
              </div>
            )
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400">
              로딩 중...
            </div>
          )}
        </div>

        {/* 타이틀 영역 */}
        <div
          className={cn(
            'w-full h-[25%] sm:p-[14px] flex justify-center items-center',
            // 선택된 상태일 때 배경색 변경 (선택 사항)
            isSelected ? 'bg-gray-300' : 'bg-gray-200'
          )}
        >
          <p className="text-sm sm:text-md text-center text-gray-500 font-[NanumSquareRoundB] block truncate">
            {gesture.gestureTitle}
          </p>
        </div>
      </div>
    </div>
  );
}
