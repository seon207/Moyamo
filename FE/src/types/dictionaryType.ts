// API 응답 형태
export type GestureListResponse = {
  status: number;
  data: {
    country_id: number;
    country_name: string;
    image_url: string | null;
    gestures: {
      meaning_id: number;
      gesture_id: number;
      image_url: string | null;
      gesture_title: string;
      gesture_label: string;
      gesture_type: string;
      multiple_gestures: number;
    }[];
  };
};

// gestures API 응답 카멜케이스로 변환
export interface GestureItem {
  meaningId: number;
  gestureId: number;
  imageUrl: string | null;
  gestureTitle: string;
  gestureLabel: string;
  gestureType: string;
  multipleGestures: number;
}

// GestureListResponse 카멜케이스로 변환
export interface GesturesByCountry {
  countryId: number;
  countryName: string;
  imageUrl: string | null;
  gestures: GestureItem[];
}

// 국가 정보 타입
export type Country = {
  code: string;
  name: string;
  id: number;
};

// 제스처 타입 정의
export type Gesture = {
  id: number;
  title: string;
  image_url: string | null;
  meaning_id: number;
  // 상세 정보
  gesture_meaning?: string;
  gesture_situation?: string;
  gesture_others?: string;
  gesture_tmi?: string;
  is_positive?: boolean;
  multiple_gestures?: number;
};

// 국가별 제스쳐 데이터 관리하는 타입
export type CountryGestures = {
  [countryId: number]: {
    country_name: string;
    gestures: Gesture[];
  };
};
