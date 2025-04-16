import { useQuery } from '@tanstack/react-query';

// GLB 파일을 로드하고 URL을 반환하는 함수
export const fetchGLBModel = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`모델 로드 실패: ${url}`);
    }
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('GLB 모델 로드 오류:', error);
    throw error;
  }
};

// GLB 모델을 로드하고 캐싱하는 커스텀 훅
export const useGLBModel = (modelUrl: string) => {
  return useQuery({
    queryKey: ['glbModel', modelUrl],
    queryFn: () => fetchGLBModel(modelUrl),
    staleTime: Infinity, // 데이터가 만료되지 않음
    gcTime: 1000 * 60 * 60, // 1시간 동안 캐시 유지
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

// 여러 모델을 미리 로드하는 함수
export const prefetchGLBModels = async (queryClient: any, modelUrls: string[]) => {
  try {
    for (const url of modelUrls) {
      queryClient.prefetchQuery({
        queryKey: ['glbModel', url],
        queryFn: () => fetchGLBModel(url),
        staleTime: Infinity,
      });
    }
  } catch (error) {
    console.error('모델 미리 로드 오류:', error);
  }
};
