import { useState } from 'react';
import { toast } from 'sonner';
import { GestureSearchResult } from '@/types/searchGestureType';
import { GlbViewer } from '@/components/GlbViewer';

interface SearchResultItemProps {
  result: GestureSearchResult;
  onFlagClick?: (countryId: number, gestureName: string) => void;
  index?: number; // 인덱스 (선택적)
  searchType?: 'text' | 'camera'; // 검색 유형
}

function SearchResultItem({
  result,
  onFlagClick,
  searchType = 'text', // 기본값은 일반 텍스트 검색
}: SearchResultItemProps) {
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  // 5개 국가만 상세 페이지 사용 가능
  const DETAIL_AVAILABLE_COUNTRYS = [1, 2, 3, 4, 5];

  // 제스처 상세 페이지로 이동
  const handleFlagClick = (countryId: number, countryName: string) => {
    // 사용 가능한 국가인지 확인
    const isAvailable = DETAIL_AVAILABLE_COUNTRYS.includes(countryId);

    if (isAvailable) {
      // 같은 국가 클릭시 초기화, 다른 국가 클릭시 해당 국가로 변경
      setSelectedCountryId(selectedCountryId === countryId ? null : countryId);

      // 상위 컴포넌트의 핸들러가 있으면 호출
      if (onFlagClick) {
        onFlagClick(countryId, result.gestureName);
      }
    } else {
      // 비활성화된 국가일 경우 Sonner 토스트 메시지 표시
      toast.warning(`${countryName}의 상세 정보는 현재 제공되지 않습니다.`, {
        description: '다른 국가를 선택해 주세요.',
        position: 'top-right',
        duration: 3000,
        icon: '🌏',
      });
    }
  };

  // GLB 모델인지 확인
  const isGlbModel = result.gestureImage && result.gestureImage.toLowerCase().endsWith('.glb');

  // 카메라 검색 모드일 때의 레이아웃
  if (searchType === 'camera') {
    return (
      <div className="py-5 px-7 bg-white dark:bg-gray-700 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          {/* 제목 대신 첫 번째 의미를 표시 */}
          <h3 className="text-lg md:text-xl font-bold font-[NanumSquareRoundEB] text-gray-900 dark:text-d-txt-50">
            {result.meanings[0]?.meaning || result.gestureName}
          </h3>

          {/* 국가 플래그 */}
          <div className="flex items-center space-x-3">
            {result.meanings.map((meaning) => {
              const isAvailable = DETAIL_AVAILABLE_COUNTRYS.includes(meaning.countryId);

              return (
                <div key={meaning.countryId} className="relative group">
                  <img
                    src={meaning.imageUrl}
                    alt={meaning.countryName}
                    className={`w-6 h-4 md:w-14 md:h-9 object-cover
                      ${
                        isAvailable
                          ? 'drop-shadow-nation hover:scale-110 transition-transform cursor-pointer'
                          : 'cursor-not-allowed'
                      }
                      ${selectedCountryId === meaning.countryId ? 'ring-2 ring-blue-500 scale-110' : ''}`}
                    onClick={() => handleFlagClick(meaning.countryId, meaning.countryName)}
                  />
                  {/* 수정된 툴팁: 오른쪽 1px, 아래로 2px 이동 */}
                  <div className="absolute top-full mt-2 right-0 translate-x-1 opacity-0 group-hover:opacity-100 transition-opacity
                    duration-200 bg-gray-800 text-white text-xs p-1 rounded whitespace-nowrap z-50">
                    {isAvailable
                      ? `${meaning.countryName}의 의미: ${meaning.meaning}`
                      : `${meaning.countryName}의 상세 정보는 현재 제공되지 않습니다.`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 일반 검색 모드일 때의 기존 레이아웃
  return (
    <div className="my-2">
      <div className="flex items-center">
        {/* 이미지 또는 3D 모델 컨테이너 */}
        <div className="flex w-16 h-16 md:w-28 md:h-28 justify-center items-center mr-2 flex-shrink-0 bg-white dark:bg-gray-500 rounded-full overflow-hidden">
          {isGlbModel && result.gestureImage ? (
            // gestureImage가 GLB 파일인 경우 GlbViewer 컴포넌트 표시
            <div className="w-full h-full overflow-hidden">
              <GlbViewer url={result.gestureImage} />
            </div>
          ) : result.gestureImage ? (
            // 일반 이미지인 경우 이미지 태그로 표시
            <img
              src={result.gestureImage}
              alt={result.gestureName}
              className="h-full object-cover rounded-md"
            />
          ) : (
            // 이미지가 없는 경우 기본 placeholder 표시
            <div className="h-full w-full bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-300 text-xs md:text-sm text-center">
                이미지 준비 중
              </span>
            </div>
          )}
        </div>

        {/* 제스처 설명 */}
        <div className="flex-1 ml-4 relative">
          <div
            className="relative rounded-lg shadow-md p-6
            bg-white
            dark:bg-gray-700 drop-shadow-basic
            "
          >
            {/* 말풍선 꼬리 */}
            <div className="absolute left-0 top-2/3 transform -translate-x-full -translate-y-1/2">
              <svg
                width="15"
                height="30"
                viewBox="0 0 15 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M15 5 L0 15 L15 25 Z" fill="white" className="dark:fill-gray-700" />
              </svg>
            </div>

            {/* 제목 */}
            <div className="flex justify-between items-start mb-1 relative z-10">
              <h3
                className="text-xl md:text-xl lg:text-2xl font-bold font-[NanumSquareRoundEB] text-gray-900
                dark:text-d-txt-50"
              >
                {result.gestureName}
              </h3>

              {/* 국가 플래그 영역 */}
              <div className="flex items-center space-x-2">
                {result.meanings.map((meaning) => {
                  const isAvailable = DETAIL_AVAILABLE_COUNTRYS.includes(meaning.countryId);

                  return (
                    <div key={meaning.countryId} className="relative group">
                      <img
                        src={meaning.imageUrl}
                        alt={meaning.countryName}
                        draggable="false"
                        className={`select-none w-6 h-4 md:w-10 md:h-6 lg:w-14 lg:h-9 object-cover 
                          ${
                            isAvailable
                              ? 'drop-shadow-nation hover:scale-110 transition-transform cursor-pointer'
                              : 'opacity-50 grayscale cursor-not-allowed'
                          }
                          ${selectedCountryId === meaning.countryId ? 'ring-2 ring-blue-500 scale-110' : ''}`}
                        onClick={() => handleFlagClick(meaning.countryId, meaning.countryName)}
                      />
                      {/* 수정된 툴팁: 오른쪽 1px, 아래로 2px 이동 */}
                      <div className="absolute top-full mt-2 right-0 translate-x-1 opacity-0 group-hover:opacity-100
                        transition-opacity duration-200 bg-gray-800 text-white text-xs p-1 rounded whitespace-nowrap z-50">
                        {isAvailable
                          ? `${meaning.countryName}의 의미: ${meaning.meaning}`
                          : `${meaning.countryName}의 상세 정보는 현재 제공되지 않습니다.`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 설명 텍스트 */}
            <p
              className="relative z-10 
            text-base md:text- text-gray-700 font-[NanumSquareRound]
            dark:text-d-txt-50"
            >
              {result.meanings[0]?.meaning}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchResultItem;