import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearchStore } from '@/stores/useSearchStore';
import { useGestureSearch } from '@/hooks/apiHooks';
import { GestureSearchResult } from '@/types/searchGestureType';

export const useSearchInputLogic = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, searchCountry } = useSearchStore();

  // 홈 페이지 여부 확인
  const isHomePage = location.pathname === '/' || location.pathname === '/home';

  // 검색 결과 표시 영역의 ref
  const searchInputRef = useRef<HTMLDivElement>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isCameraSearch, setIsCameraSearch] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const {
    data: searchResults,
    isLoading,
    refetch,
  } = useGestureSearch(searchTerm, searchCountry, {
    // 홈 페이지이고 검색어가 있을 때만 자동으로 요청하도록 설정
    enabled: isHomePage && searchTerm !== '',
  });

  // URL에서 gesture_label 파라미터 확인 및 검색어 설정
  useEffect(() => {
    const url = new URL(window.location.href);
    const gestureLabel = url.searchParams.get('gesture_label');
    const gestureName = url.searchParams.get('gesture_name');

    // 검색어 길이 제한 검사
    if ((gestureLabel && gestureLabel.length > 1000) || (gestureName && gestureName.length > 1000)) {
      console.warn('URL 파라미터의 검색어가 너무 깁니다.');
      navigate('/url-error', { replace: true });
      return;
    }

    if (gestureLabel) {
      // 문제 1 해결: 카메라 검색어를 검색창에 설정
      setSearchTerm(gestureLabel);
      setIsCameraSearch(true);
    } else {
      // 카메라 검색이 아닌 경우 gesture_name 파라미터 확인
      if (gestureName) {
        setSearchTerm(gestureName);
      }
      setIsCameraSearch(false);
    }
  }, [location.search, setSearchTerm, navigate]);

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

  // 검색 결과 표시 여부 결정
  useEffect(() => {
    // 홈 페이지에서만 검색 결과를 표시
    setShowResults(isHomePage && searchTerm !== '');
  }, [searchTerm, isHomePage]);

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

  // 검색 실행 핸들러
  const handleSearch = () => {
    // 검색어 길이 제한 검사
    if (searchTerm.length > 1000) {
      console.warn('검색어가 너무 깁니다.');
      navigate('/url-error', { replace: true });
      return;
    }

    if (!searchTerm.trim()) return;
    
    // 카메라 검색 모드 해제
    setIsCameraSearch(false);
    navigate(`/search?gesture_name=${encodeURIComponent(searchTerm)}`);
  };

  // 검색 결과 클릭 핸들러
  const handleResultClick = (result: GestureSearchResult) => {
    setSearchTerm(result.gestureName);
    setShowResults(false);
    // 카메라 검색 모드 해제
    setIsCameraSearch(false);
    navigate(`/search?gesture_name=${encodeURIComponent(result.gestureName)}`);
  };

  return {
    searchInputRef,
    showResults,
    isLoading,
    searchResults,
    searchTerm,
    isCameraSearch,
    isSmallScreen,
    handleSearchTermChange,
    handleSearch,
    handleResultClick,
    refetch,
  };
};