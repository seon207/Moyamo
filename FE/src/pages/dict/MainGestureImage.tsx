import React, { useMemo } from 'react';
import { GestureItem } from '@/types/dictionaryType';
import { useCountryStyles } from '@/hooks/useCountryStyles';
import { GlbViewer } from '@/components/GlbViewer';

// 메인 이미지 컴포넌트 Props 타입
type MainGestureImageProps = {
  gesture: GestureItem;
  countryCode: string;
};

// 메모이제이션 적용 컴포넌트
const MainGestureImage = React.memo(function MainGestureImage({
  gesture,
  countryCode,
}: MainGestureImageProps) {
  const { getColorClass, getBorderColorClass } = useCountryStyles(); //useCountryStyles 훅 사용

  // 클래스 계산을 메모이제이션
  const colorClass = useMemo(() => getColorClass(countryCode), [countryCode, getColorClass]);
  const borderColorClass = useMemo(
    () => getBorderColorClass(countryCode),
    [countryCode, getBorderColorClass]
  );

  // 유효한 이미지 URL인지 확인
  const hasValidImageUrl = useMemo(() => {
    return Boolean(gesture.imageUrl && typeof gesture.imageUrl === 'string');
  }, [gesture.imageUrl]);

  return (
    <div className="rounded-2xl font-[NanumSquareRoundB] w-full h-full max-w-lg mx-auto flex flex-col">
      {/* 컨테이너 전체 */}
      <div className="w-full h-full flex flex-col">
        {/* 이미지 영역 - 비율 유지 */}
        <div
          className={`bg-white rounded-t-2xl flex items-center justify-center border-4 ${borderColorClass} w-full h-[80%] aspect-[16/9]`}
        >
          {hasValidImageUrl ? (
            <GlbViewer url={gesture.imageUrl as string} />
          ) : (
            <div className="text-gray-400 flex items-center justify-center h-full w-full text-center px-4">
              <p className="text-lg sm:text-xl font-[NanumSquareRoundB]">이미지 준비 중</p>
            </div>
          )}
        </div>

        {/* 타이틀 영역 */}
        <div
          className={`${colorClass} py-2 px-4 text-white text-center rounded-b-2xl flex items-center justify-center h-[20%]`}
        >
          <h2 className="text-base sm:text-lg md:text-xl">{gesture.gestureTitle}</h2>
        </div>
      </div>
    </div>
  );
});

export default MainGestureImage;
