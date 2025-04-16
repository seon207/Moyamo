import { GestureListResponse, GesturesByCountry } from '../types/dictionaryType';
import apiClient from '@/api/apiClient';

// API 응답에서 받는 제스처 아이템 원본 형태
type GestureApiItem = GestureListResponse['data']['gestures'][0];

/**
 * 국가별 제스처 목록 조회
 * @param countryId
 * @returns 제스처 목록
 */
export const getGesturesByCountry = async (countryId: number): Promise<GesturesByCountry> => {
  const { data } = await apiClient.get<GestureListResponse>('/api/gestures', {
    params: {
      country_id: countryId,
    },
  });
  return {
    countryId: data.data.country_id,
    countryName: data.data.country_name,
    imageUrl: data.data.image_url,
    gestures: data.data.gestures.map((gesture: GestureApiItem) => ({
      meaningId: gesture.meaning_id,
      gestureId: gesture.gesture_id,
      imageUrl: gesture.image_url,
      gestureTitle: gesture.gesture_title,
      gestureLabel: gesture.gesture_label,
      gestureType: gesture.gesture_type,
      multipleGestures: gesture.multiple_gestures,
    })),
  };
};
