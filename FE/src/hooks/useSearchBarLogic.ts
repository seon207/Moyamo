// hooks/useSearchBarLogic.ts
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSearchStore } from '../stores/useSearchStore';
import { getCountryId } from '@/utils/countryUtils';
import { useSearchNavigation } from './useSearchNavigation';
import { useGestureSearch } from './apiHooks';
import { useQueryClient } from '@tanstack/react-query';

export const useSearchBarLogic = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const { searchTerm, setSearchTerm, searchCountry, setSearchCountry } = useSearchStore();

  const [selectedCountryName, setSelectedCountryName] = useState('전체');
  const [isMobile, setIsMobile] = useState(false);
  const [isCameraSearch, setIsCameraSearch] = useState(false);

  const { refetch } = useGestureSearch(searchTerm, searchCountry, {
    enabled: false, // 수동으로 refetch 호출할 때만 요청
  });

  const countries = ['전체', '한국', '미국', '일본', '중국', '이탈리아'];

  const { handleSearch, updateUrlOnInputChange, updateUrlOnCountrySelect } =
    useSearchNavigation(setSelectedCountryName);

  // URL에서 제스처 검색 모드 확인 및 검색어 설정
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const gestureLabel = params.get('gesture_label');
    const gestureName = params.get('gesture_name');
    const isInCameraSearchPath = location.pathname === '/search/camera';

    // 카메라 검색 모드 확인 (URL 경로 또는 gesture_label 파라미터)
    if (isInCameraSearchPath || gestureLabel) {
      // 카메라 검색 모드 설정
      setIsCameraSearch(true);

      // 검색어 설정 (gesture_label 또는 gesture_name)
      if (gestureLabel) {
        setSearchTerm(gestureLabel);
      } else if (gestureName) {
        setSearchTerm(gestureName);
      }
    } else {
      // 일반 검색 모드
      setIsCameraSearch(false);

      // 검색어 설정 (gesture_name)
      if (gestureName) {
        setSearchTerm(gestureName);
      }
    }
  }, [location.pathname, location.search, setSearchTerm]);

  // 화면 크기에 따라 모바일 여부 감지
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // 입력 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);

    // 카메라 검색 모드 확인
    const params = new URLSearchParams(location.search);
    const hasCameraParam = params.has('gesture_label');
    const isInCameraSearchPath = location.pathname === '/search/camera';

    // 카메라 검색 모드에서 사용자 직접 입력 시
    if (hasCameraParam || isInCameraSearchPath || isCameraSearch) {
      // 카메라 검색 모드 해제 상태로 설정 (UI 상태만 변경)
      setIsCameraSearch(false);
    }

    // URL 업데이트 및 필요시 쿼리 무효화
    updateUrlOnInputChange(newValue);

    // 자동 검색 실행 (실시간 검색) - 명시적인 refetch 추가
  if (newValue.trim() !== '') {
    // refetch 직접 호출
    refetch();
  }
};


  // 키 입력 핸들러
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // 검색어가 있을 때만 검색 실행
      if (searchTerm.trim()) {
        // 검색 실행 (항상 /search 경로로 이동)
        handleSearch();
      }
    }
  };

  // 국가 선택 핸들러
  const handleCountrySelect = (country: string) => {
    const countryId = getCountryId(country);
    setSearchCountry(countryId);
    setSelectedCountryName(country);

    // 국가 선택 시 URL 업데이트
    updateUrlOnCountrySelect(countryId);

    // 카메라 검색 모드였다면 해제 (UI 상태만 변경)
    if (isCameraSearch) {
      setIsCameraSearch(false);
    }

    // 검색어가 있을 때 자동으로 검색 실행
    if (searchTerm.trim() !== '') {
      refetch();
    }
  };

  // 검색 실행 핸들러
  const executeSearch = () => {
    // 카메라 검색 모드였다면 해제
    if (isCameraSearch) {
      setIsCameraSearch(false);
    }

    // 검색어가 있을 때만 검색 실행
    if (searchTerm.trim()) {
      handleSearch();
    }
  };

  return {
    isMobile,
    searchTerm,
    selectedCountryName,
    countries,
    handleInputChange,
    handleInputKeyDown,
    handleCountrySelect,
    executeSearch,
    isCameraSearch,
  };
};
