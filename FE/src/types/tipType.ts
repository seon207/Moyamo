export interface TipData {
  tipId: number;
  countryId: number;
  content: string;
}

export interface TipResponse {
  tip_id: number;
  country_id: number;
  content: string;
}

export interface ApiResponse<T> {
  status: number;
  data: T[];
}