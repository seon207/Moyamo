import * as React from 'react';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { GestureItem } from '@/types/dictionaryType';
import { useCountryStyles } from '@/hooks/useCountryStyles';
import { DictGestureCard } from './DictGestureCard';

// 캐러셀 컴포넌트 프롭 타입
interface DictListCarouselProps {
  gestures?: GestureItem[];
  onSelectGesture?: (gestureId: number) => void;
  selectedCountry?: string;
  selectedGestureId?: number; // 현재 선택된 제스처 ID 추가
}

export function DictListCarousel({
  gestures = [],
  onSelectGesture,
  selectedCountry,
  selectedGestureId, // 선택된 제스처 ID 받기
}: DictListCarouselProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { getHoverBorderClass, getBorderColorClass } = useCountryStyles();

  // 현재 보이는 카드 인덱스 범위
  const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);
  // 스크롤 위치 상태 추가
  const [isAtStart, setIsAtStart] = useState<boolean>(true);
  const [isAtEnd, setIsAtEnd] = useState<boolean>(false);

  // 초기에 처음 보이는 카드들 로드 (기본으로 0, 1, 2 인덱스)
  useEffect(() => {
    // 기본 화면에 보이는 카드 인덱스 설정
    const initialVisible = [];
    const viewportWidth = window.innerWidth;
    let visibleCount = 1;

    if (viewportWidth >= 1024) {
      visibleCount = 3;
    } else if (viewportWidth >= 640) {
      visibleCount = 2;
    }

    for (let i = 0; i < Math.min(visibleCount, gestures.length); i++) {
      initialVisible.push(i);
    }
    setVisibleIndexes(initialVisible);

    // 선택된 제스처로 스크롤 (약간의 지연을 두어 컴포넌트가 렌더링된 후 실행)
    if (selectedGestureId && scrollRef.current) {
      setTimeout(() => {
        scrollToSelectedGesture();
      }, 100);
    }

    // 초기 스크롤 상태 설정
    setIsAtStart(true);
    setIsAtEnd(gestures.length <= visibleCount);
  }, [gestures.length, selectedGestureId]);

  // 선택된 제스처로 스크롤하는 함수
  const scrollToSelectedGesture = () => {
    if (!scrollRef.current || !selectedGestureId) return;

    // 선택된 제스처의 인덱스 찾기
    const selectedIndex = gestures.findIndex((g) => g.gestureId === selectedGestureId);
    if (selectedIndex === -1) return;

    // 카드 너비 계산
    const containerWidth = scrollRef.current.clientWidth;
    let cardWidth = containerWidth / 2; // 기본값: 화면의 절반
    const viewportWidth = window.innerWidth;

    if (viewportWidth >= 1024) {
      cardWidth = containerWidth / 3;
    } else {
      cardWidth = containerWidth / 2;
    }

    // 선택된 제스처가 맨 앞에 오도록 스크롤 위치 계산
    const scrollPosition = selectedIndex * cardWidth;
    scrollRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });

    // 스크롤 후 보이는 카드 업데이트
    setTimeout(() => {
      updateVisibleCards();
      updateScrollPosition();
    }, 500);
  };

  // 스크롤 위치 확인 함수 추가
  const updateScrollPosition = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    // 시작 위치인지 확인 (좌측 끝)
    setIsAtStart(scrollLeft <= 10);

    // 끝 위치인지 확인 (우측 끝)
    setIsAtEnd(Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 10);
  };

  // 스크롤 위치에 따라 보이는 카드 업데이트
  const updateVisibleCards = () => {
    if (!scrollRef.current) return;

    const scrollLeft = scrollRef.current.scrollLeft;
    const containerWidth = scrollRef.current.clientWidth;

    // 카드 너비 계산
    let cardWidth = containerWidth / 2; // 기본값: 화면의 절반
    const viewportWidth = window.innerWidth;

    if (viewportWidth >= 1024) {
      cardWidth = containerWidth / 3;
    } else {
      cardWidth = containerWidth / 2;
    }

    // 현재 보이는 첫 번째 카드 인덱스 계산
    const firstVisibleIndex = Math.floor(scrollLeft / cardWidth);

    // 보이는 카드 개수 계산
    let visibleCount = 1;
    if (viewportWidth >= 1024) {
      visibleCount = 3;
    } else if (viewportWidth >= 640) {
      visibleCount = 2;
    }

    // 미리 로딩할 추가 카드 설정 (앞뒤로 1개씩)
    const newVisibleIndexes: number[] = []; // 명시적으로 number[] 타입 지정
    for (
      let i = Math.max(0, firstVisibleIndex - 1);
      i < Math.min(firstVisibleIndex + visibleCount + 1, gestures.length);
      i++
    ) {
      newVisibleIndexes.push(i);
    }

    setVisibleIndexes((prev) => {
      // 이전에 보이지 않던 새로운 인덱스만 추가
      const combined = [...new Set([...prev, ...newVisibleIndexes])];
      return combined;
    });

    // 스크롤 위치 업데이트
    updateScrollPosition();
  };

  // 왼쪽으로 스크롤
  const scrollToPrev = () => {
    if (scrollRef.current) {
      // 화면 크기에 따라 스크롤할 카드 수 조정
      const viewportWidth = window.innerWidth;
      let cardCount = 1; // 기본값: 1개 카드 스크롤

      if (viewportWidth >= 1024) {
        // lg 이상
        cardCount = 3;
      } else if (viewportWidth >= 640) {
        // sm 이상
        cardCount = 2;
      }

      const scrollAmount = scrollRef.current.clientWidth / cardCount;
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });

      // 스크롤 완료 후 보이는 카드 업데이트
      setTimeout(() => {
        updateVisibleCards();
        updateScrollPosition();
      }, 500);
    }
  };

  // 오른쪽으로 스크롤
  const scrollToNext = () => {
    if (scrollRef.current) {
      // 화면 크기에 따라 스크롤할 카드 수 조정
      const viewportWidth = window.innerWidth;
      let cardCount = 1; // 기본값: 1개 카드 스크롤

      if (viewportWidth >= 1024) {
        // lg 이상
        cardCount = 3;
      } else if (viewportWidth >= 640) {
        // sm 이상
        cardCount = 2;
      }

      const scrollAmount = scrollRef.current.clientWidth / cardCount;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });

      // 스크롤 완료 후 보이는 카드 업데이트
      setTimeout(() => {
        updateVisibleCards();
        updateScrollPosition();
      }, 500);
    }
  };

  // 스크롤 이벤트 리스너 추가
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      const handleScroll = () => {
        updateVisibleCards();
        updateScrollPosition();
      };

      scrollElement.addEventListener('scroll', handleScroll);
      // 초기 로드 시 보이는 카드 업데이트
      handleScroll();
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', updateVisibleCards);
      }
    };
  }, []);

  // 제스처 클릭 핸들러
  const handleGestureClick = (gestureId: number) => {
    if (onSelectGesture) {
      onSelectGesture(gestureId);
    }
  };

  return (
    <div className="w-full h-full flex justify-center font-[NanumSquareRound]">
      <div ref={containerRef} className="w-full h-full flex items-center relative px-6">
        {/* 이전 버튼 - 시작 위치가 아닐 때만 표시 */}
        {!isAtStart && (
          <button
            onClick={scrollToPrev}
            className="absolute -left-1 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-8 h-8 bg-white rounded-full shadow-md text-gray-600 cursor-pointer"
            aria-label="이전"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        )}

        {/* 카드 컨테이너 */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x scrollbar-hide w-full h-full"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* 카드 관련 */}
          {gestures.map((gesture, index) => (
            <div
              key={`gesture-${gesture.gestureId || index}`}
              className="flex-shrink-0 w-[50%] lg:w-[33.333%] snap-start px-2 h-full"
            >
              <DictGestureCard
                gesture={gesture}
                onClick={() => handleGestureClick(gesture.gestureId)}
                hoverBorderClass={getHoverBorderClass(selectedCountry)}
                isVisible={visibleIndexes.includes(index)} // 현재 보이는지 여부 전달
                isSelected={gesture.gestureId === selectedGestureId} // 선택된 제스처인지 전달
                selectedBorderClass={getBorderColorClass(selectedCountry)} // 선택된 테두리 클래스 전달
              />
            </div>
          ))}
        </div>

        {/* 다음 버튼 - 끝 위치가 아닐 때만 표시 */}
        {!isAtEnd && (
          <button
            onClick={scrollToNext}
            className="absolute -right-1 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-8 h-8 bg-white rounded-full shadow-md text-gray-600 cursor-pointer"
            aria-label="다음"
          >
            <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
