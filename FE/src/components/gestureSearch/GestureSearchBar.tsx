import React, { useState, useEffect } from 'react';
import BaseDropdown from '@/pages/home/dropdowns/BaseDropdown';
import SearchCameraModal from '../cameraModal/SearchCameraModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCountryId, getCountryName } from '@/utils/countryUtils';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface SearchBarProps {
  searchInputRef: React.RefObject<HTMLDivElement | null>;
  isCameraSearch: boolean;
  onSearchTermChange: (newTerm: string) => void;
  onCountryChange: (newCountryId: number) => void; // required로 변경
  initialCountryId: number; // required로 변경
}

function GestureSearchBar({
  searchInputRef,
  isCameraSearch: propIsCameraSearch,
  onSearchTermChange,
  onCountryChange,
  initialCountryId,
}: SearchBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 로컬 상태로 관리
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountryName, setSelectedCountryName] = useState('전체');
  const [countryId, setCountryId] = useState(initialCountryId);
  const [isCameraSearch, setIsCameraSearch] = useState(propIsCameraSearch);
  const [hasShownToast, setHasShownToast] = useState(false); // 중복 알림 방지

  const countries = ['전체', '한국', '미국', '일본', '중국', '이탈리아'];

  // URL에서 검색어와 국가 정보 가져오기
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const gestureLabel = params.get('gesture_label');
    const gestureName = params.get('gesture_name');
    const countryParam = params.get('country_id');

    // 검색어 길이 제한 검사
    if ((gestureLabel && gestureLabel.length > 1000) || (gestureName && gestureName.length > 1000)) {
      console.warn('URL 파라미터의 검색어가 너무 깁니다.');
      navigate('/url-error', { replace: true });
      return;
    }

    // 국가 ID 설정
    const newCountryId = countryParam ? parseInt(countryParam, 10) : initialCountryId;
    setCountryId(newCountryId);
    setSelectedCountryName(getCountryName(newCountryId));

    // 카메라 검색 여부 확인
    const isInCameraPath = location.pathname === '/search/camera';
    const hasCameraLabel = params.has('gesture_label');
    setIsCameraSearch(isInCameraPath || hasCameraLabel);

    // 검색어 설정 - 가장 중요한 부분
    if (gestureLabel) {
      console.log('카메라 검색어 설정:', gestureLabel);
      setSearchTerm(gestureLabel);
    } else if (gestureName) {
      console.log('일반 검색어 설정:', gestureName);
      setSearchTerm(gestureName);
    } else {
      // URL에 검색어가 없으면 빈 문자열로 설정
      setSearchTerm('');
    }
  }, [location.pathname, location.search, navigate, initialCountryId]);

  // 입력 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // 기존 20자 제한 로직
    if (newValue.length > 20) {
      // 20자 제한 알림 표시
      if (!hasShownToast) {
        toast.error('검색어가 너무 깁니다.', {
          description: '정확한 검색을 위해 20자 이하로 입력해주세요.',
          duration: 3000,
          position: 'top-right',
          icon: '⚠️',
        });
        setHasShownToast(true);

        // 일정 시간 후 알림 상태 초기화
        setTimeout(() => setHasShownToast(false), 3000);
      }
      return;
    }

    // 414 에러 대응 검색어 길이 제한 검사 (1000자 제한)
    if (newValue.length > 1000) {
      console.warn('검색어가 너무 깁니다. 414 에러가 발생할 수 있습니다.');
      navigate('/url-error', { replace: true });
      return;
    }

    setSearchTerm(newValue);
    onSearchTermChange(newValue);

    // 카메라 검색에서 일반 검색으로 전환
    if (isCameraSearch) {
      setIsCameraSearch(false);
    }

    // 검색 페이지에서 URL 업데이트
    if (location.pathname.includes('/search')) {
      const params = new URLSearchParams(location.search);

      // 카메라 검색 파라미터 제거
      params.delete('gesture_label');

      if (newValue.trim() !== '') {
        // 새 검색어로 업데이트
        params.set('gesture_name', newValue);
      } else {
        // 검색어가 비어있으면 파라미터 제거
        params.delete('gesture_name');
      }

      // 국가 ID 유지
      if (countryId > 0) {
        params.set('country_id', countryId.toString());
      }

      // URL 업데이트 (히스토리 대체)
      navigate(`/search?${params.toString()}`, { replace: true });

      // 검색 결과 갱신
      queryClient.invalidateQueries({ queryKey: ['gestureName'] });
      queryClient.refetchQueries({ queryKey: ['gestureName'] });
    }
  };

  // 키 입력 핸들러
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      // 엔터 키로 검색 실행
      executeSearch();
    }
  };

  // 국가 선택 핸들러
  const handleCountrySelect = (country: string) => {
    const newCountryId = getCountryId(country);
    setCountryId(newCountryId);
    setSelectedCountryName(country);
    
    // 부모 컴포넌트에 국가 변경 알림
    if (onCountryChange) {
      onCountryChange(newCountryId);
    }

    // 검색 페이지에서 URL 업데이트
    if (location.pathname.includes('/search')) {
      const params = new URLSearchParams(location.search);

      // 카메라 검색에서 일반 검색으로 전환
      if (isCameraSearch) {
        const currentTerm = params.get('gesture_label') || searchTerm;
        params.delete('gesture_label');

        if (currentTerm.trim()) {
          // 검색어 길이 제한 검사
          if (currentTerm.length > 1000) {
            console.warn('검색어가 너무 깁니다.');
            navigate('/url-error', { replace: true });
            return;
          }
          
          params.set('gesture_name', currentTerm);
        }

        setIsCameraSearch(false);
      }

      // 국가 ID 설정
      if (newCountryId > 0) {
        params.set('country_id', newCountryId.toString());
      } else {
        params.delete('country_id');
      }

      // URL 업데이트 (히스토리 대체)
      navigate(`/search?${params.toString()}`, { replace: true });

      // 검색 결과 갱신
      queryClient.invalidateQueries({ queryKey: ['gestureName'] });
      queryClient.refetchQueries({ queryKey: ['gestureName'] });
    }
  };

  // 검색 실행 핸들러
  const executeSearch = () => {
    if (!searchTerm.trim()) return;

    // 검색어 길이 제한 검사
    if (searchTerm.length > 1000) {
      console.warn('검색어가 너무 깁니다.');
      navigate('/url-error', { replace: true });
      return;
    }

    // 카메라 검색에서 일반 검색으로 전환
    if (isCameraSearch) {
      setIsCameraSearch(false);
    }

    // 검색 파라미터 구성
    const params = new URLSearchParams();
    params.set('gesture_name', searchTerm);

    if (countryId > 0) {
      params.set('country_id', countryId.toString());
    }

    // 검색 페이지로 이동
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="flex items-center flex-1">
      <BaseDropdown
        selected={selectedCountryName}
        options={countries}
        label="검색 국가"
        onSelect={handleCountrySelect}
      />

      {/* 검색창 */}
      <div className="flex items-center w-full ml-2">
        <div
          className="relative flex-1 max-w-[880px] min-w-[120px]" // 너비를 제한
          ref={searchInputRef}
        >
          <input
            className="w-full h-10 px-2 
            text-xs sm:text-sm mb:text-base lg:text-md
            border-b border-gray-400 focus:outline-none
            dark:border-d-txt-50/80
            dark:text-d-txt-50/90
            font-[NotoSansKR]"
            placeholder="검색어를 입력하세요"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
          />
          {/* 카메라 검색일 때 표시 */}
          {isCameraSearch && (
            <div className="absolute right-4 top-3 font-[NanumSquareRound] text-xs 
            text-kr-700 dark:text-d-txt-50/70"
            >
              카메라 검색
            </div>
          )}
        </div>
        <div className="ml-1 flex items-center justify-center">
          <SearchCameraModal />
        </div>
      </div>
    </div>
  );
}

export default GestureSearchBar;