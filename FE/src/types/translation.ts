export type LanguageCode = 'KOR' | 'EN-US' | 'CN' | 'JPN';

export interface TranslationLanguage {
  code: string;
  name: string;
  flagUrl: string;
  isoLangCode: string; // ISO 639 언어 코드 (참조용)
}

export const translationLanguages: Record<LanguageCode, TranslationLanguage> = {
  KOR: {
    code: 'kr', // 이미지 경로 유지 위해 그대로 둡니다
    name: 'KOR',
    flagUrl: '/images/flags/kr.webp',
    isoLangCode: 'ko', // 실제 번역에 사용
  },
  'EN-US': {
    code: 'us',
    name: 'EN-US',
    flagUrl: '/images/flags/us.webp',
    isoLangCode: 'en-us',
  },
  CN: {
    code: 'cn',
    name: 'CN',
    flagUrl: '/images/flags/cn.webp',
    isoLangCode: 'zh',
  },
  JPN: {
    code: 'jp',
    name: 'JPN',
    flagUrl: '/images/flags/jp.webp',
    isoLangCode: 'ja',
  },
};

export const languageCodes = Object.keys(translationLanguages) as LanguageCode[];

// 번역 KEY & VALUE
export interface TranslationEntry {
  key: string;
  text: string;
}

export interface TranslationData {
  [key: string]: string;
}

export interface Translations {
  [languageCode: string]: TranslationData;
}

export interface TranlationContextType {
  currentLanguage: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string, params?: Record<string, string>) => string;
  availableLanguages: { code: LanguageCode; name: string }[];
}