export interface Meanings {
  countryId: number;
  imageUrl?: string;
  countryName: string;
  meaning: string;
}
export interface ApiMeaning {
  country_id: number;
  image_url?: string;
  country_name: string;
  meaning: string;
}
export interface GestureSearchResult {
  gestureId: number;
  gestureName: string;
  gestureImage: string | null;
  meanings: Meanings[];
}

// 검색 결과 API 응답 형태
// 서비스 레이어를 통해 카멜 케이스로 변환 예정
export interface SearchResponse {
  status: number;
  data: {
    gesture_id: number;
    gesture_name: string;
    gesture_image: string;
    meanings: ApiMeaning[];
  }[];
}

export interface SearchResponseSingle {
  status: number;
  data: {
    gesture_id: number;
    gesture_name: string;
    gesture_image: string | null;
    meanings: ApiMeaning[];
  };
}
