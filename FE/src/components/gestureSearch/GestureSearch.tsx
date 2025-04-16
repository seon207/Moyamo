import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GestureSearchBar from './GestureSearchBar';
import GestureSearchPreview from './GestureSearchPreview';
import { useGestureSearch } from '@/hooks/apiHooks';
import { GestureSearchResult } from '@/types/searchGestureType';

function GestureSearchInput() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // 로컬 상태 관리
  const [showResults, setShowResults] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isCameraSearch, setIsCameraSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // searchTerm을 상태로 관리
  const [currentCountryId, setCurrentCountryId] = useState(0); // 현재 국가 ID 상태 추가

  // URL에서 검색어와 카메라 검색 여부 확인
  const params = new URLSearchParams(location.search);
  const gestureName = params.get('gesture_name') || '';
  const gestureLabel = params.get('gesture_label') || '';
  const countryIdParam = params.get('country_id');
  const countryId = countryIdParam ? parseInt(countryIdParam, 10) : 0;

  // 검색어 길이 확인 및 필요시 에러 페이지로 리다이렉트
  useEffect(() => {
    if ((gestureName && gestureName.length > 1000) || (gestureLabel && gestureLabel.length > 1000)) {
      console.warn('URL 파라미터의 검색어가 너무 깁니다.');
      navigate('/url-error', { replace: true });
    }
  }, [gestureName, gestureLabel, navigate]);

  // 홈 페이지 여부 확인
  const isHomePage = location.pathname === '/' || location.pathname === '/home';

  // URL 파라미터 변경 시 검색어와 국가 ID 상태 업데이트
  useEffect(() => {
    if (gestureLabel) {
      setSearchTerm(gestureLabel);
    } else if (gestureName) {
      setSearchTerm(gestureName);
    } else {
      setSearchTerm('');
    }
    
    // 국가 ID 업데이트
    setCurrentCountryId(countryId);
  }, [gestureLabel, gestureName, countryId]);

  // 검색 쿼리 실행 - 국가 ID 포함
  const { data: searchResults, isLoading } = useGestureSearch(
    searchTerm || gestureLabel || gestureName,
    currentCountryId, // currentCountryId 사용
    {
      enabled: isHomePage && (searchTerm || gestureLabel || gestureName) !== '',
    }
  );

  // 화면 크기에 따라 작은 화면 여부 감지
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 500);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // URL에서 카메라 검색 여부 확인
  useEffect(() => {
    const isInCameraPath = location.pathname === '/search/camera';
    const hasCameraLabel = params.has('gesture_label');
    setIsCameraSearch(isInCameraPath || hasCameraLabel);
  }, [location.pathname, location.search]);

  // 검색 결과 표시 여부 결정
  useEffect(() => {
    console.log('useEffect triggered:', { isHomePage, searchTerm });
    setShowResults(isHomePage && searchTerm !== '');
  }, [searchTerm, isHomePage]);

  // 검색 결과 바깥 영역 클릭 이벤트 핸들링
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    // 검색 결과가 표시되고 있을 때만 이벤트 리스너 추가
    if (showResults) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showResults]);

  // 검색 결과 클릭 핸들러 - 국가 ID 유지하도록 수정
  const handleResultClick = (result: GestureSearchResult) => {
    if (result.gestureName.length > 1000) {
      console.warn('검색어가 너무 깁니다.');
      navigate('/url-error', { replace: true });
      return;
    }
    
    // URL 파라미터 구성 (국가 ID 포함)
    const params = new URLSearchParams();
    params.set('gesture_name', result.gestureName);
    
    // 현재 선택된 국가 ID가 있으면 유지
    if (currentCountryId > 0) {
      params.set('country_id', currentCountryId.toString());
    }
    
    navigate(`/search?${params.toString()}`);
  };

  // 검색어 변경 핸들러
  const handleSearchTermChange = (newTerm: string) => {
    // 검색어 길이 제한 검사
    if (newTerm.length > 1000) {
      console.warn('검색어가 너무 깁니다.');
      navigate('/url-error', { replace: true });
      return;
    }
    
    setSearchTerm(newTerm);
  };

  // 국가 ID 변경 핸들러 추가
  const handleCountryChange = (newCountryId: number) => {
    setCurrentCountryId(newCountryId);
  };

  return (
    <div className="search-container relative" ref={searchContainerRef}>
      <GestureSearchBar
        searchInputRef={searchInputRef}
        isCameraSearch={isCameraSearch}
        onSearchTermChange={handleSearchTermChange}
        onCountryChange={handleCountryChange} // 국가 변경 핸들러 전달
        initialCountryId={currentCountryId} // 초기 국가 ID 전달
      />

      {showResults && (
        <GestureSearchPreview
          isLoading={isLoading}
          searchResults={searchResults}
          isSmallScreen={isSmallScreen}
          onResultClick={handleResultClick}
          countryId={currentCountryId} // 현재 국가 ID 전달
        />
      )}
    </div>
  );
}

export default GestureSearchInput;