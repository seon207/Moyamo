import { SearchResponse, GestureSearchResult, ApiMeaning } from '@/types/searchGestureType';
import apiClient from '@/api/apiClient';
import { searchResultMock } from '@/data/resultMock';

// 개발 환경 확인
const isDevelopment = import.meta.env.MODE === 'development';

// 목 데이터 사용 여부를 결정하는 함수
// 배포 환경에서는 항상 false 반환 (실제 API 사용)
const useMockData = () => {
  // 배포 환경에서는 목 데이터를 사용하지 않음
  if (!isDevelopment) {
    return false;
  }

  // 개발 환경에서만 localStorage 값 확인
  try {
    const storedValue = localStorage.getItem('useMockData');
    // localStorage에 값이 명시적으로 있으면 그 값을 사용
    if (storedValue !== null) {
      return storedValue === 'true';
    }
    // 개발 환경이면서 localStorage에 값이 없으면 기본적으로 목 데이터 사용
    return true;
  } catch {
    // localStorage 접근 실패 시 개발 환경이면 목 데이터 사용
    return isDevelopment;
  }
};

// 목 데이터로 검색 결과 필터링하는 함수
const getMockSearchResults = (gestureName: string, countryId?: number): GestureSearchResult[] => {
  // 검색어가 없으면 빈 배열 반환
  if (!gestureName.trim()) return [];

  return searchResultMock.filter((item) => {
    // 제스처 이름으로 검색
    const nameMatch = item.gestureName.includes(gestureName);

    // 국가별 필터링
    const countryMatch =
      !countryId || item.meanings.some((meaning) => meaning.countryId === countryId);

    return nameMatch && countryMatch;
  });
};

//검색 API 호출 함수
export const searchGestures = async (
  gestureName: string,
  countryId?: number,
  isCameraSearch?: boolean
): Promise<GestureSearchResult[]> => {
  // 파라미터로 받은 카메라 검색 여부가 없으면 URL에서 확인
  if (isCameraSearch === undefined) {
    const url = new URL(window.location.href);
    const hasGestureLabel = url.searchParams.has('gesture_label');
    const gestureLabel = url.searchParams.get('gesture_label') || '';
    isCameraSearch = hasGestureLabel && gestureLabel.trim() !== '';
  }

  // 검색 파라미터 결정
  let searchQuery = gestureName;
  if (isCameraSearch) {
    // URL에서 gesture_label 값을 가져와서 사용
    const url = new URL(window.location.href);
    const gestureLabel = url.searchParams.get('gesture_label') || '';
    searchQuery = gestureLabel || gestureName;
  }

  // 검색어가 비어있으면 빈 배열 반환
  if (!searchQuery.trim()) {
    console.log('검색어가 비어있어 결과를 반환하지 않습니다.');
    return [];
  }

  // 검색어 길이 제한 검사 (1000자 초과 시 414 에러 페이지로 리다이렉트)
  if (searchQuery.length > 1000) {
    console.warn('검색어가 너무 깁니다. 검색을 수행하지 않습니다.');
    window.location.href = '/url-error';
    return [];
  }

  // 목 데이터 사용 여부 확인
  if (useMockData()) {
    console.log(
      `[개발 환경] 목 데이터 사용 중... ${isCameraSearch ? '(카메라 검색)' : '(일반 검색)'}`
    );
    // API 응답 딜레이 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 300));
    // 카메라 검색에 맞게 목 데이터 필터링
    const mockResults = getMockSearchResults(searchQuery, countryId);

    return mockResults;
  }

  // 실제 API 호출
  console.log(
    `[프로덕션 환경] 실제 API 호출 중... ${isCameraSearch ? '(카메라 검색)' : '(일반 검색)'}`
  );
  try {
    let endpoint = '/api/search';
    let params: Record<string, string | number | undefined> = {};

    if (isCameraSearch) {
      // 카메라 검색 API - countryId 전달하지 않음
      endpoint = '/api/search/camera';
      params = {
        gesture_label: searchQuery,
      };
    } else {
      // 일반 검색 API - countryId 전달
      params = {
        gesture_name: searchQuery,
        country_id: countryId,
      };
    }

    // API 호출
    const { data } = await apiClient.get<SearchResponse>(endpoint, { params });

    // 데이터 유효성 검사
    if (!data || !data.data || !Array.isArray(data.data)) {
      console.log('유효한 검색 결과가 없습니다.');
      return [];
    }

    // API 응답 데이터 변환
    const results: GestureSearchResult[] = [];

    for (const item of data.data) {
      if (!item) continue;

      try {
        const meanings = Array.isArray(item.meanings)
          ? item.meanings.map((m: ApiMeaning) => ({
              countryId: m.country_id,
              imageUrl: m.image_url,
              countryName: m.country_name,
              meaning: m.meaning,
            }))
          : [];

        results.push({
          gestureId: item.gesture_id,
          gestureName: item.gesture_name,
          gestureImage: item.gesture_image,
          meanings: meanings,
        });
      } catch (err) {
        console.error('API 응답 항목 변환 중 오류:', err);
        // 오류 발생 시 해당 항목 건너뛰기
      }
    }
    return results;
  } catch (error) {
    console.error('API 호출 실패:', error);

    // 배포 환경에서는 API 오류 시 빈 배열 반환
    if (!isDevelopment) {
      return [];
    }

    // 개발 환경에서만 API 오류 시 목 데이터로 대체
    console.log('개발 환경에서 목 데이터로 대체합니다.');
    return getMockSearchResults(searchQuery, countryId);
  }
};

// 목 데이터와 API 사용 모드 전환 함수 (개발 편의용)
export const toggleMockDataMode = (useMock: boolean) => {
  // 배포 환경에서는 전환 불가능
  if (!isDevelopment) {
    console.warn('배포 환경에서는 데이터 모드를 변경할 수 없습니다.');
    return false;
  }

  try {
    localStorage.setItem('useMockData', useMock ? 'true' : 'false');
    console.log(`데이터 소스 변경: ${useMock ? '목 데이터' : '실제 API'} 사용 모드`);
    return true;
  } catch {
    console.warn('데이터 모드 설정 실패');
    return false;
  }
};

// 현재 데이터 모드 확인
export const isMockDataMode = () => {
  return useMockData();
};