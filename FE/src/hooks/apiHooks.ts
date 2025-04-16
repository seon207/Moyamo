import { useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { searchGestures } from '@/services/searchService';

import { getQuizQuestions, detectGesture } from '@/services/quizService';
import { getGesturesByCountry } from '@/services/dictListService';
import { getGestureDetail } from '@/services/dictDetailService';
import { getCompareGuide } from '@/services/dictCompareService';

import { getTips } from '@/services/tipService';

export function useGestureSearch(
  searchTerm: string,
  countryId?: number,
  options = { enabled: true }
) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // URL에서 카메라 검색 여부 확인
  const isGestureLabel = params.has('gesture_label');
  const gestureLabel = params.get('gesture_label') || '';

  // 일반 검색어 확인
  const gestureName = params.get('gesture_name') || '';
  const isInCameraSearchPath = location.pathname === '/search/camera';

  // URL에서 국가 ID 확인
  const urlCountryId = params.get('country_id');
  // countryId 값이 있으면 우선 사용, 없으면 URL에서 가져오기
  const finalCountryId = countryId !== undefined && countryId !== null 
    ? countryId 
    : (urlCountryId ? parseInt(urlCountryId, 10) : 0);

  // 최종 검색어 결정 (카메라 라벨 우선, 그 다음 URL의 gesture_name, 마지막으로 state의 searchTerm)
  let finalSearchTerm = '';

  if (isGestureLabel && gestureLabel) {
    // 카메라 검색이 우선
    finalSearchTerm = gestureLabel;
  } else if (isInCameraSearchPath && gestureName) {
    // 카메라 검색 경로에서는 gesture_name 사용
    finalSearchTerm = gestureName;
  } else if (location.pathname === '/search' && gestureName) {
    // 검색 페이지에서는 URL의 gesture_name 파라미터 사용
    finalSearchTerm = gestureName;
  } else {
    // 그 외의 경우 state의 searchTerm 사용
    finalSearchTerm = searchTerm.trim();
  }

  const isValidQuery = !!finalSearchTerm;

  return useQuery({
    // 쿼리 키에 검색 유형과 국가 ID 포함
    queryKey: [
      'gestureName',
      finalSearchTerm,
      finalCountryId, // 국가 ID를 쿼리 키에 포함하여 국가 필터 변경 시 자동으로 재요청
      isGestureLabel || isInCameraSearchPath ? 'camera' : 'text',
    ],
    queryFn: () =>
      searchGestures(finalSearchTerm, finalCountryId, isGestureLabel || isInCameraSearchPath),
    // 검색어가 있고 enabled 옵션이 true일 때만 API 호출
    enabled: isValidQuery && options.enabled,
    staleTime: 5 * 60 * 1000,
    // 빈 검색어일 때 빈 배열 반환
    initialData: isValidQuery ? undefined : [],
    // 쿼리가 항상 최신 데이터를 반영하도록 설정
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
}

// 문화적 팁 가져오기
export function useTips() {
  return useQuery({
    queryKey: ['tips'],
    queryFn: getTips,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

/* 딕셔너리 */
// 국가별 제스처 목록 조회
export function useGesturesByCountry(countryId?: number) {
  return useQuery({
    queryKey: ['gesturesByCountry', countryId],
    queryFn: async ({ queryKey }) => {
      const [_, countryIdParam] = queryKey;
      const response = await getGesturesByCountry(countryIdParam as number);
      return response;
    },
    enabled: !!countryId,
    staleTime: 1000 * 60 * 5,
  });
}

// 제스처 상세정보 조회
export function useGestureDetail(gestureId?: number, countryId?: number) {
  return useQuery({
    queryKey: ['gestureDetail', gestureId, countryId],
    queryFn: async ({ queryKey }) => {
      const [_, gestureIdParam, countryIdParam] = queryKey;
      const response = await getGestureDetail(gestureIdParam as number, countryIdParam as number);
      return response;
    },
    enabled: !!gestureId && !!countryId,
    staleTime: 1000 * 60 * 5,
  });
}

// 비교 가이드 조회
export function useCompareGuide(gestureId?: number) {
  return useQuery({
    queryKey: ['compareGuide', gestureId],
    queryFn: async ({ queryKey }) => {
      const [_, gestureIdParam] = queryKey;
      const response = await getCompareGuide(gestureIdParam as number);
      return response;
    },
    enabled: !!gestureId,
    staleTime: 1000 * 60 * 5,
  });
}

//퀴즈 문제 가져오기
export function useQuizQuestions(useCamera: boolean) {
  return useQuery({
    queryKey: ['quizQuestions', useCamera],
    queryFn: () => getQuizQuestions(useCamera),
    staleTime: 0, // 항상 새로운 데이터를 가져오도록 설정
  });
}

//영상 퀴즈 ai 인식 결과 가져오기: 수정예정. (데이터 주고 받는 함수)
export function useGestureDetection() {
  return useMutation({
    mutationFn: (imageData: string) => detectGesture(imageData),
  });
}
