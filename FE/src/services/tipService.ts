import { TipData, TipResponse, ApiResponse } from "@/types/tipType";
import apiClient from "@/api/apiClient";
import { tipsMockData } from "@/data/tipMock";

const isDevelopment = import.meta.env.MODE === 'development';

const useMockData = () => {
  try {
    const storedValue = localStorage.getItem('useMockData');
    if (storedValue !== null) {
      return storedValue === 'true';
    }
    return isDevelopment;
  } catch {
    return isDevelopment;
  }
};

const getMockTips = (): Promise<TipData[]> => {
  return Promise.resolve(tipsMockData);
};

const fetchTips = async (): Promise<TipData[]> => {
  try {
    const response = await apiClient.get<ApiResponse<TipResponse>>('/api/tips');
    
    // 백엔드 데이터를 프론트엔드 형식으로 변환 (스네이크케이스 -> 카멜케이스)
    return response.data.data.map((item) => ({
      tipId: item.tip_id,
      countryId: item.country_id,
      content: item.content,
    }));
  } catch (error) {
    console.error('팁 데이터를 가져오는 중 오류 발생:', error);
    throw error;
  }
};

export const getTips = async (): Promise<TipData[]> => {
  return useMockData() ? getMockTips() : fetchTips();
}