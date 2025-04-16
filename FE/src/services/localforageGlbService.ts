import localforage from 'localforage';

// LocalForage 설정
const configureStorage = () => {
  localforage.config({
    name: 'glbModelsCache',
    storeName: 'models',
    description: 'GLB 모델 파일 캐시 저장소'
  });
};

// 초기화
configureStorage();

// GLB 모델 저장
export const storeGlbModel = async (url: string, blob: Blob): Promise<void> => {
  try {
    // 저장 시간 기록과 함께 저장
    await localforage.setItem(url, {
      blob,
      timestamp: Date.now()
    });
    console.log(`모델 저장 완료: ${url}`);
  } catch (error) {
    console.error(`모델 저장 오류: ${url}`, error);
    throw error;
  }
};

// GLB 모델 가져오기
export const getGlbModel = async (url: string): Promise<Blob | null> => {
  try {
    const item = await localforage.getItem<{ blob: Blob; timestamp: number }>(url);
    
    if (item && item.blob) {
      console.log(`캐시에서 모델 로드: ${url}`);
      return item.blob;
    }
    
    return null;
  } catch (error) {
    console.error(`캐시에서 모델 로드 오류: ${url}`, error);
    return null;
  }
};

// GLB 모델 로드 (캐시 또는 네트워크)
export const loadGlbModel = async (url: string): Promise<string> => {
  try {
    // 먼저 캐시에서 확인
    const cachedBlob = await getGlbModel(url);
    
    if (cachedBlob) {
      // 캐시에 있으면 Blob URL 생성
      return URL.createObjectURL(cachedBlob);
    }
    
    // 캐시에 없으면 네트워크에서 가져오기
    console.log(`네트워크에서 모델 가져오기: ${url}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`모델 로드 실패: ${url} (${response.status})`);
    }
    
    const blob = await response.blob();
    
    // 캐시에 저장
    storeGlbModel(url, blob);
    
    // Blob URL 반환
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error(`모델 로드 오류: ${url}`, error);
    throw error;
  }
};

// 여러 GLB 모델 미리 로드 (백그라운드에서)
export const prefetchGlbModels = async (urls: string[]): Promise<void> => {
  for (const url of urls) {
    try {
      // 이미 캐시에 있는지 확인
      const cachedModel = await getGlbModel(url);
      
      if (!cachedModel) {
        // 없으면 백그라운드로 가져오기
        fetchInBackground(url);
      }
    } catch (error) {
      console.error(`모델 미리 로드 오류: ${url}`, error);
    }
  }
};

// 백그라운드에서 모델 가져오기 (프로미스 대기하지 않음)
const fetchInBackground = (url: string): void => {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`모델 로드 실패: ${url} (${response.status})`);
      }
      return response.blob();
    })
    .then(blob => {
      storeGlbModel(url, blob);
      console.log(`백그라운드 로드 및 캐싱 완료: ${url}`);
    })
    .catch(error => {
      console.error(`백그라운드 로드 오류: ${url}`, error);
    });
};

// 오래된 캐시 항목 정리 (저장 공간 관리)
export const cleanupOldCache = async (maxAgeInDays: number = 7): Promise<void> => {
  try {
    const keys = await localforage.keys();
    const maxAge = maxAgeInDays * 24 * 60 * 60 * 1000; // 일 -> 밀리초
    const now = Date.now();
    
    for (const key of keys) {
      const item = await localforage.getItem<{ timestamp: number }>(key);
      
      if (item && now - item.timestamp > maxAge) {
        await localforage.removeItem(key);
        console.log(`오래된 캐시 항목 삭제: ${key}`);
      }
    }
  } catch (error) {
    console.error('캐시 정리 오류:', error);
  }
};

// 캐시된 모델의 총 용량 확인 (바이트 단위)
export const getCacheSize = async (): Promise<number> => {
  try {
    const keys = await localforage.keys();
    let totalSize = 0;
    
    for (const key of keys) {
      const item = await localforage.getItem<{ blob: Blob }>(key);
      if (item && item.blob) {
        totalSize += item.blob.size;
      }
    }
    
    return totalSize;
  } catch (error) {
    console.error('캐시 크기 확인 오류:', error);
    return 0;
  }
};