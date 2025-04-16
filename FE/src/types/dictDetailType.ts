// API 응답 형태
export type GestureDetailResponse = {
  status: number;
  data: {
    country_id: number;
    country_name: string;
    image_url: string | null;
    gesture_label: string;
    gesture_type: string;
    meaning_id: number;
    gesture_id: number;
    gesture_image: string | null;
    gesture_title: string;
    gesture_meaning: string;
    gesture_situation: string;
    gesture_others: string;
    gesture_tmi: string;
    is_positive: boolean;
    multiple_gestures: number;
  };
};

// 제스처 디테일 목록 반환 타입
export interface GestureDetail {
  countryId: number;
  countryName: string;
  imageUrl: string | null;
  gestureLabel: string;
  gestureType: string;
  meaningId: number;
  gestureId: number;
  gestureImage: string | null;
  gestureTitle: string;
  gestureMeaning: string;
  gestureSituation: string;
  gestureOthers: string;
  gestureTmi: string;
  isPositive: boolean;
  multipleGestures: number;
}
