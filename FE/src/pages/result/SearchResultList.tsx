import React, { useMemo } from 'react';
import { GestureSearchResult } from '@/types/searchGestureType';
import SearchResultItem from './SearchResultItem';
import { GlbViewer } from '@/components/GlbViewer';

interface SearchResultsListProps {
  results: GestureSearchResult[];
  onFlagClick?: (countryId: number, gestureName: string) => void;
  searchType?: 'text' | 'camera'; // 검색 유형
}

function SearchResultsList({ 
  results, 
  onFlagClick,
  searchType = 'text' // 기본값은 텍스트 검색
}: SearchResultsListProps) {
  // URL을 확인하여 카메라 검색 페이지인지 자동으로 감지
  const isCameraSearch = searchType === 'camera' || window.location.pathname.includes('/search/camera');
  const finalSearchType = isCameraSearch ? 'camera' : 'text';
  
  // 카메라 검색 모드일 때 첫 번째 GLB 모델 찾기
  const firstGlbModel = useMemo(() => {
    if (finalSearchType === 'camera' && results.length > 0) {
      // 모든 결과에서 첫 번째 GLB 모델 찾기
      for (const result of results) {
        if (result.gestureImage && result.gestureImage.toLowerCase().endsWith('.glb')) {
          return result.gestureImage;
        }
      }
    }
    return null;
  }, [results, finalSearchType]);
  
  return (
    <div className="flex flex-col flex-1 overflow-auto">
      {/* 카메라 검색 모드이고 GLB 모델이 있을 때만 상단에 GLB 표시 */}
      {finalSearchType === 'camera' && firstGlbModel && (
        <div className="flex justify-center py-6 mb-4">
          <div className="w-32 h-32 md:w-50 md:h-50 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-600 flex items-center justify-center shadow-lg">
            <GlbViewer url={firstGlbModel} />
          </div>
        </div>
      )}
      
      {/* 결과 리스트 컨테이너 (스크롤) */}
      <div className="flex-1 overflow-y-auto">
        {results.length === 0 ? (
          <div className="text-center">
            <p className="text-base md:text-lg font-[NanumSquareRound]
            text-gray-600 dark:text-d-txt-50/70">
              검색 결과가 없습니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 pb-4 px-4">
            {results.map((result, index) => (
              <SearchResultItem 
                key={`${result.gestureId}-${index}`}
                result={result} 
                onFlagClick={onFlagClick} 
                index={index}
                searchType={finalSearchType}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResultsList;