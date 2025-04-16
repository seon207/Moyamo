import { GestureSearchResult } from "@/types/searchGestureType";
import { getCountryName } from '@/utils/countryUtils';

interface SearchResultsProps {
  isLoading: boolean;
  searchResults: GestureSearchResult[] | undefined;
  isSmallScreen: boolean;
  onResultClick: (result: GestureSearchResult) => void;
  countryId?: number | null; // null 가능하도록 수정
}

function GestureSearchPreview(props: SearchResultsProps) {
  const { isLoading, searchResults, isSmallScreen, onResultClick, countryId } = props;
  
  // 선택된 국가 이름 가져오기
  const selectedCountry = !countryId || countryId === 0 ? '전체' : getCountryName(countryId);

  return (
    <div
      className="absolute mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg search-results
      w-[66%] sm:w-[80%] md:w-[70%] lg:w-[78%] xl:w-[78%]
      left-20 md:left-30 lg:left-34 xl:left-35
      drop-shadow-basic overflow-hidden"
      style={{ zIndex: 9999 }}
    >
      {isLoading ? (
        <div className="py-4 text-center text-gray-500 dark:text-d-txt-50/70">검색 중...</div>
      ) : searchResults && searchResults.length > 0 ? (
        <div className="max-h-80 overflow-y-auto customScrollbar kr">
          {/* 현재 선택된 국가 표시 */}
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-[NanumSquareRound]">
                선택된 국가: {selectedCountry}
              </span>
            </div>
          
          {searchResults.map((result, index) => (
            <div
              key={result.gestureId || index}
              className="px-4 py-2 
              hover:bg-gray-100 dark:hover:bg-gray-700 
              cursor-pointer"
              onClick={() => onResultClick(result)}
            >
              <div className="flex justify-between items-center">
                <div className="text-sm md:text-base font-[NanumSquareRound]">{result.gestureName}</div>
                {/* 국가 표시 (있는 경우) - 첫 번째 meaning의 countryName 사용 */}
                {result.meanings && result.meanings.length > 0 && (
                  <div className="text-xs text-gray-400 dark:text-gray-500 ml-2">
                    {result.meanings[0].countryName}
                  </div>
                )}
              </div>
              {!isSmallScreen && result.meanings && result.meanings.length > 0 && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {result.meanings[0].meaning}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div
          className="py-4 text-center text-gray-500 dark:text-d-txt-50/70 
          font-[NanumSquareRound] text-sm"
        >
          {countryId && countryId > 0 
            ? `${selectedCountry}에 대한 검색 결과가 없습니다.` 
            : '검색 결과가 없습니다.'}
        </div>
      )}
    </div>
  );
}

export default GestureSearchPreview;