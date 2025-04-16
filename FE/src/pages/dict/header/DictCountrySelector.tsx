import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Country } from '@/types/dictionaryType';
import { getFlagImage } from '@/utils/imageUtils';
import { memo } from 'react';

type CountrySelectorProps = {
  selectedCountry: Country;
  onSelectCountry: (country: Country) => void;
  countryOptions: Country[];
};

// 메모이제이션된 컴포넌트
const DictCountrySelector = memo(
  ({ selectedCountry, onSelectCountry, countryOptions }: CountrySelectorProps) => {
    // 국가 코드를 Country 객체로 변환
    const getCountryByCode = (code: string) => {
      return countryOptions.find((country) => country.code === code) || selectedCountry;
    };

    // 값 변경 핸들러
    const handleValueChange = (code: string) => {
      const country = getCountryByCode(code);
      onSelectCountry(country);
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="flex justify-center items-center gap-3 min-w-[200px] max-w-[250px] h-16 px-4 py-2 bg-white focus:outline-none cursor-pointer dark:bg-gray-500 dark:text-d-txt-50">
          <div className="flex items-center w-full justify-center">
            <img
              src={getFlagImage(selectedCountry.code)}
              alt={`${selectedCountry.name} 국기`}
              className="w-[65px] h-[40px] mr-4 object-cover drop-shadow-nation"
              draggable="false"
              loading="eager"
            />
            <span className="text-[18px] md:text-[24px] xl:text-[32px] font-[NanumSquareRoundEB] text-center">
              {selectedCountry.name}
            </span>
            <FontAwesomeIcon icon={faCaretDown} className="ml-2" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex justify-center w-full bg-white border-gray-400 dark:bg-gray-500 dark:text-d-txt-50 rounded-xl border shadow-md mt-2">
          <DropdownMenuRadioGroup
            value={selectedCountry.code}
            onValueChange={handleValueChange}
            className="w-full"
          >
            {countryOptions.map((country) => (
              <DropdownMenuRadioItem
                key={country.code}
                value={country.code}
                className="flex items-center gap-3 py-3 hover:bg-gray-200 dark:hover:bg-gray-400 cursor-pointer w-full"
              >
                <img
                  src={getFlagImage(country.code)}
                  alt={`${country.name} 국기`}
                  className="w-15% min-w-[20px] max-w-[35px] h-auto aspect-[10/7] object-cover drop-shadow-nation select-none"
                  draggable="false"
                  loading="lazy"
                />
                <span className="text-[calc(13px+0.3vw)] max-text-[16px] font-[NanumSquareRound] truncate">
                  {country.name}
                </span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

// 디스플레이 이름 설정
DictCountrySelector.displayName = 'DictCountrySelector';

export default DictCountrySelector;
