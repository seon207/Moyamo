import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderBar from '../home/HeaderBar';
import { useTheme } from '@/components/theme-provider';
import SearchResultsList from './SearchResultList';
import SensitiveGestureWarning from '@/components/gestureSearch/SensitiveGestureWarning';
import { useSearchStore } from '../../stores/useSearchStore';
import '@/components/ui/scrollbar.css';
import { useGestureSearch } from '@/hooks/apiHooks';
import { getBackgroundImage } from '@/utils/imageUtils';

function Result() {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const backgroundImageUrl =
    theme === 'dark' ? getBackgroundImage('background-dark') : getBackgroundImage('background');

  // Zustand 스토어에서 가져온 상태와 액션
  const { searchTerm, searchCountry, setSearchTerm, setSearchCountry } = useSearchStore();

  const { data: searchResults, refetch } = useGestureSearch(searchTerm, searchCountry);

  // URL에서 검색어와 국가 파라미터 추출
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('gesture_name') || '';

    // country는 숫자 문자열로 오므로 숫자로 변환
    const countryParam = queryParams.get('country_id');
    const country = countryParam ? parseInt(countryParam, 10) : 0; // 문자열을 숫자로 변환

    // Zustand 스토어 상태 업데이트
    setSearchTerm(query);
    setSearchCountry(country); // 숫자로 변환된 값 전달

    if (query) {
      refetch();
    }
  }, [location.search, setSearchTerm, setSearchCountry]);

  // 제스처 상세 페이지로 이동
  const handleFlagClick = (countryId: number, gestureName: string) => {
    // 선택된 제스처와 국가 ID를 사용하여 상세 페이지로 이동
    if (searchResults) {
      const selectedGesture = searchResults.find((result) => result.gestureName === gestureName);
      if (selectedGesture) {
        // navigate를 사용하여 상세 페이지로 이동
        navigate(
          `/dictionary/detail?gesture_id=${selectedGesture.gestureId}&country_id=${countryId}`
        );
      }
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <SensitiveGestureWarning />
      {/* 기존 HeaderBar는 유지 */}
      <HeaderBar />

      {/* 타이틀 영역 - 고정 부분 */}
      <div
        className="flex items-center justify-center 
        mx-auto w-[70%] md:w-[40%] lg:w-[30%] xl:w-[25%] py-2 pb-5"
      >
        <div className="flex-grow h-0 border-t-2 border-dashed border-gray-400 dark:border-d-txt-50/50 mx-4"></div>
        <h2 className="text-lg md:text-2xl font-[DNFBitBitv2] dark:text-d-txt-50 px-4">RESULTS</h2>
        <div className="flex-grow h-0 border-t-2 border-dashed border-gray-400 dark:border-d-txt-50/50 mx-4"></div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex justify-center">
        <div
          className="customScrollbar kr w-full h-full mx-auto
          max-w-lg md:max-w-xl lg:max-w-4xl xl:max-w-5xl"
          style={{
            maxHeight: 'calc(100vh - 250px)', // height 대신 maxHeight 사용
            overflowY: 'auto',
          }}
        >
          <div>
            <SearchResultsList results={searchResults || []} onFlagClick={handleFlagClick} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Result;
