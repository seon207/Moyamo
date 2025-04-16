import { CompareGuideResponse, CompareGuide } from '../types/dictCompareType';
import apiClient from '@/api/apiClient';

// API 응답에서 받는 meanings 아이템 원본 형태
type MeaningApiItem = CompareGuideResponse['data']['meanings'][0];

/**
 * 제스처 비교 가이드 조회
 * @param gestureId
 * @returns 제스처 비교 가이드
 */

export const getCompareGuide = async (gestureId: number): Promise<CompareGuide> => {
  const { data } = await apiClient.get<CompareGuideResponse>('/api/gestures/compare', {
    params: {
      gesture_id: gestureId,
    },
  });
  return {
    gestureId: data.data.gesture_id,
    imageUrl: data.data.image_url,
    meanings: data.data.meanings.map((meaning: MeaningApiItem) => ({
      countryId: meaning.country_id,
      countryName: meaning.country_name,
      countryImageUrl: meaning.country_image_url,
      gestureMeaning: meaning.gesture_meaning,
      gestureSituation: meaning.gesture_situation,
      isPositive: meaning.is_positive,
    })),
  };
};
