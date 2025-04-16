import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchStore } from '@/stores/useSearchStore';
import { getCountryName } from '@/utils/countryUtils';

export const useSearchNavigation = (setSelectedCountryName: (name: string) => void) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { searchTerm, setSearchTerm, searchCountry, setSearchCountry, resetSearchTerm } =
    useSearchStore();

  // URL에서 검색 파라미터 업데이트
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const gestureName = params.get('gesture_name') || '';
    const gestureLabel = params.get('gesture_label') || '';
    const countryParam = params.get('country_id');

    // URL의 검색어가 너무 길면 에러 페이지로 리다이렉트
    if ((gestureName.length > 1000) || (gestureLabel.length > 1000)) {
      console.warn('URL 파라미터의 검색어가 너무 깁니다.');
      navigate('/url-error', { replace: true });
      return;
    }

    // URL에 아무 검색어도 없는 경우 초기화
    if (!params.has('gesture_name') && !params.has('gesture_label')) {
      resetSearchTerm();
      queryClient.invalidateQueries({ queryKey: ['gestureName'] });
      return;
    }

    // 국가 ID 설정
    const countryId = countryParam ? parseInt(countryParam, 10) : 0;
    setSelectedCountryName(getCountryName(countryId));
    setSearchCountry(countryId);

    // 검색어 설정 (카메라 라벨이 있으면 우선 사용)
    const finalSearchTerm = gestureLabel || gestureName;
    setSearchTerm(finalSearchTerm);

    // 디버깅용: 로그 출력
    console.log(
      `[🔍 검색 파라미터] 이름: ${gestureName}, 라벨: ${gestureLabel}, 국가: ${countryId}`
    );
    console.log(`[🔍 최종 검색어] ${finalSearchTerm}`);
  }, [
    location.search,
    setSearchTerm,
    setSearchCountry,
    resetSearchTerm,
    queryClient,
    setSelectedCountryName,
    navigate
  ]);

  // 검색 처리 (일반 검색 버튼 클릭 시)
  const handleSearch = () => {
    // 검색어 길이 제한 검사
    if (searchTerm.length > 1000) {
      console.warn('검색어가 너무 깁니다.');
      navigate('/url-error', { replace: true });
      return;
    }

    if (!searchTerm.trim()) {
      const params = new URLSearchParams();
      if (searchCountry !== 0) {
        params.set('country_id', searchCountry.toString());
      }
      navigate(params.toString() ? `/search?${params.toString()}` : '/search', { replace: true });
      return;
    }

    // 일반 검색은 항상 gesture_name 사용
    navigate(
      `/search?gesture_name=${encodeURIComponent(searchTerm)}${
        searchCountry !== 0 ? `&country_id=${searchCountry}` : ''
      }`
    );
  };

  // 입력 변경 시 URL 업데이트
  const updateUrlOnInputChange = (newValue: string) => {
    // 검색어 길이 제한 검사
    if (newValue.length > 1000) {
      console.warn('검색어가 너무 깁니다.');
      navigate('/url-error', { replace: true });
      return;
    }

    // 현재 URL 파라미터 가져오기
    const params = new URLSearchParams(location.search);
    const hasGestureLabel = params.has('gesture_label');
    const isInCameraSearch = location.pathname === '/search/camera';

    // 카메라 검색 모드에서 사용자 입력 있을 때 자동 전환
    if ((hasGestureLabel || isInCameraSearch) && newValue.trim() !== '') {
      // 카메라 라벨 제거하고 일반 검색으로 전환
      params.delete('gesture_label');
      params.set('gesture_name', newValue);

      // search로 리다이렉트
      if (location.pathname.includes('/search')) {
        navigate(`/search?${params.toString()}`, { replace: true });
        // 쿼리 무효화하여 새로운 검색 결과 가져오기
        queryClient.invalidateQueries({ queryKey: ['gestureName'] });
        queryClient.refetchQueries({ queryKey: ['gestureName'] });
        return;
      }
    }

    // 일반 검색 모드에서 입력값이 비었을 때
    if (newValue === '') {
      params.delete('gesture_name');
      // 카메라 검색 모드가 아닐 때만 gesture_label도 함께 삭제
      if (!hasGestureLabel) {
        params.delete('gesture_label');
      }
      const newSearch = params.toString();

      if (location.pathname === '/search') {
        navigate(newSearch ? `/search?${newSearch}` : '/search', { replace: true });
      }
    }
    // 일반 검색 모드이고 검색 페이지에 있을 때 실시간 URL 업데이트
    else if (location.pathname === '/search' && !hasGestureLabel) {
      params.set('gesture_name', newValue);
      window.history.replaceState({}, '', `${location.pathname}?${params.toString()}`);
      // 쿼리 무효화하여 새로운 검색 결과 가져오기
      queryClient.invalidateQueries({ queryKey: ['gestureName'] });
      queryClient.refetchQueries({ queryKey: ['gestureName'] });
    }
  };

  // 국가 선택 시 URL 업데이트
  const updateUrlOnCountrySelect = (countryId: number) => {
    if (location.pathname === '/search') {
      const params = new URLSearchParams(location.search);
      const hasGestureLabel = params.has('gesture_label');

      // 국가 ID 설정
      if (countryId === 0) {
        params.delete('country_id');
      } else {
        params.set('country_id', countryId.toString());
      }

      // 카메라 검색 모드에서 국가 변경 시 일반 검색으로 전환
      if (hasGestureLabel) {
        const gestureLabel = params.get('gesture_label') || '';
        params.delete('gesture_label');

        // 카메라 검색어가 있으면 일반 검색어로 설정
        if (gestureLabel) {
          params.set('gesture_name', gestureLabel);
        } else if (searchTerm.trim()) {
          // 카메라 검색어가 없지만 state에 검색어가 있으면 사용
          params.set('gesture_name', searchTerm);
        }
      }
      // 일반 검색 모드이고 검색어가 있지만 URL에 없을 때
      else if (searchTerm.trim() && !params.has('gesture_name')) {
        params.set('gesture_name', searchTerm);
      }

      navigate(`/search?${params.toString()}`, { replace: true });
      // 쿼리 무효화하여 새로운 검색 결과 가져오기
      queryClient.invalidateQueries({ queryKey: ['gestureName'] });
    }
  };

  return {
    handleSearch,
    updateUrlOnInputChange,
    updateUrlOnCountrySelect,
  };
};