// src/utils/countryUtils.ts - 국가 관련 유틸리티 함수
export const getCountryId = (country: string): number => {
  const countryMap: Record<string, number> = {
    전체: 0,
    한국: 1,
    미국: 2,
    일본: 3,
    중국: 4,
    이탈리아: 5,
  };

  return countryMap[country] || 0;
};

export const getCountryName = (id: number): string => {
  const idToCountry: Record<number, string> = {
    0: '전체',
    1: '한국',
    2: '미국',
    3: '일본',
    4: '중국',
    5: '이탈리아',
  };

  return idToCountry[id] || '전체';
};

export const countries = ['전체', '한국', '미국', '일본', '중국', '이탈리아'];