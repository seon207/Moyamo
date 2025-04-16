import { GestureDetailResponse, GestureDetail } from '../types/dictDetailType';
import apiClient from '@/api/apiClient';

/**
 * 제스처 디테일 조회
 * @param gestureId
 * @param countryId
 * @return 제스처 디테일
 */
export const getGestureDetail = async (
  gestureId: number,
  countryId: number
): Promise<GestureDetail> => {
  const { data } = await apiClient.get<GestureDetailResponse>('/api/gestures/detail', {
    params: {
      gesture_id: gestureId,
      country_id: countryId,
    },
  });
  return {
    countryId: data.data.country_id,
    countryName: data.data.country_name,
    imageUrl: data.data.image_url,
    gestureLabel: data.data.gesture_label,
    gestureType: data.data.gesture_type,
    meaningId: data.data.meaning_id,
    gestureId: data.data.gesture_id,
    gestureImage: data.data.gesture_image,
    gestureTitle: data.data.gesture_title,
    gestureMeaning: data.data.gesture_meaning,
    gestureSituation: data.data.gesture_situation,
    gestureOthers: data.data.gesture_others,
    gestureTmi: data.data.gesture_tmi,
    isPositive: data.data.is_positive,
    multipleGestures: data.data.multiple_gestures,
  };
};
