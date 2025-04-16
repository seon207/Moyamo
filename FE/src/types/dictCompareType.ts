// 비교 가이드 API 응답
export type CompareGuideResponse = {
  status: number;
  data: {
    gesture_id: number;
    image_url: string | null;
    meanings: {
      country_id: number;
      country_name: string;
      country_image_url: string;
      gesture_meaning: string;
      gesture_situation: string;
      is_positive: boolean;
    }[];
  };
};

// meanings API 응답 카멜 케이스로 변환
export interface MeaningItem {
  countryId: number;
  countryName: string;
  countryImageUrl: string;
  gestureMeaning: string;
  gestureSituation: string;
  isPositive: boolean;
}

// CompareGuideResponse 카멜케이스로 변환
export type CompareGuide = {
  gestureId: number;
  imageUrl: string | null;
  meanings: MeaningItem[];
};
