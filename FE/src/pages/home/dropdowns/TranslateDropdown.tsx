import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import BaseDropdown from './BaseDropdown';
import { LanguageFlag } from '@/components/ui/LanguageFlag';
import { languageCodes, translationLanguages } from '@/types/translation';
import type { LanguageCode } from '@/types/translation';

interface TranslationDropdownProps {
  initialLanguage?: LanguageCode;
  onLanguageChange?: (language: LanguageCode) => void;
}

function TranslationDropdown({
  initialLanguage = 'KOR',
  onLanguageChange,
}: TranslationDropdownProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(initialLanguage);

  const handleLanguageSelect = (language: string) => {
    const typedLanguage = language as LanguageCode;
    setSelectedLanguage(typedLanguage);

    if (onLanguageChange) {
      onLanguageChange(typedLanguage);
    }

    console.log(`언어 상태: ${language}`);
  };

  return (
    <BaseDropdown
      selected={selectedLanguage}
      options={languageCodes}
      onSelect={handleLanguageSelect}
    >
      <div className="flex items-center cursor-pointer dark:text-d-txt-50">
        <LanguageFlag
          flagUrl={translationLanguages[selectedLanguage].flagUrl}
          name={translationLanguages[selectedLanguage].name}
          className="mr-2"
        />
        <span className="font-[NanumSquareRoundB] text-lg">{selectedLanguage}</span>
        <ChevronDown size={18} className="ml-1" />
      </div>
    </BaseDropdown>
  );
}

export default TranslationDropdown;
