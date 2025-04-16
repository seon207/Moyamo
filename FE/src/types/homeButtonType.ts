// 버튼 타입
export type ButtonType = 'Dict' | 'Quiz';

// 국가 정보 인터페이스
export interface Country {
  id: number;
  code: string;
  name: string;
  flagSrc: string;
}

// 국가 데이터
export const countries: Country[] = [
  {
    id: 1,
    code: 'kr',
    name: '한국',
    flagSrc: 'kr',
  },
  {
    id: 2,
    code: 'us',
    name: '미국',
    flagSrc: 'us',
  },
  {
    id: 3,
    code: 'jp',
    name: '일본',
    flagSrc: 'jp',
  },
  {
    id: 4,
    code: 'cn',
    name: '중국',
    flagSrc: 'cn',
  },
  {
    id: 5,
    code: 'ita',
    name: '이탈리아',
    flagSrc: 'it',
  },
];
