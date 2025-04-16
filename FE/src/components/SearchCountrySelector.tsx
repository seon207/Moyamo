import BaseDropdown from '@/pages/home/dropdowns/BaseDropdown';
import { countries } from '@/utils/countryUtils';

interface CountrySelectorProps {
  selectedCountry: string;
  onCountrySelect: (country: string) => void;
}

function SearchCountrySelector ({
  selectedCountry,
  onCountrySelect,
}: CountrySelectorProps){
  return (
    <BaseDropdown
      selected={selectedCountry}
      options={countries}
      label="검색 국가"
      onSelect={onCountrySelect}
    />
  );
};

export default SearchCountrySelector;