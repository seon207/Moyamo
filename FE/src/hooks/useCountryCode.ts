import { useMemo } from 'react';

// 국가 코드 관련 타입 정의
export type CountryCodeMap = {
  [key: string]: string;
};

// 국가 이름을 국가 코드로 변환하는 맵
export const countryCodeMap: CountryCodeMap = {
  미국: 'us',
  영국: 'uk',
  호주: 'au',
  뉴질랜드: 'nz',
  그리스: 'gr',
  터키: 'tr',
  베트남: 'vn',
  중국: 'cn',
  일본: 'jp',
  한국: 'kr',
  브라질: 'br',
  스페인: 'es',
  프랑스: 'fr',
  태국: 'th',
  이스라엘: 'il',
  이탈리아: 'it',
};

/**
 * 국가 이름을 국가 코드로 변환하는 훅
 * @returns 국가 이름을 국가 코드로 변환하는 함수
 */
export function useCountryCode() {
  const getCountryCode = useMemo(() => {
    return (countryName: string | undefined | null): string => {
      if (!countryName) return '';

      return countryCodeMap[countryName] || '';
    };
  }, []);

  return getCountryCode;
}
