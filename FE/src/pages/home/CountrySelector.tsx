import { countries } from '@/types/homeButtonType';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getFlagImage } from "@/utils/imageUtils";

interface CountrySelectorProps {
  title: string;
  subtitle: string;
  onSelectCountry: (countryId: number) => void;
  onClose: () => void;
}

function CountrySelector({
  title,
  subtitle, 
  onSelectCountry, 
  onClose
}: CountrySelectorProps) {
  return(
    <DialogContent 
      className="p-0 sm:max-w-md rounded-2xl border-none
      bg-white
      dark:bg-gray-800 dark:text-d-txt-50"
    >
      <div className="p-2 rounded-t-2xl bg-gray-200 dark:bg-gray-700">
        <DialogHeader className="relative my-1">
          <button 
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
            onClick={onClose}
          >
            <span className="sr-only">닫기</span>
          </button>
          
          <DialogTitle className="select-none text-center text-2xl md:text-3xl font-[NanumSquareRoundEB] mt-2">
            {title}
            <p className="text-sm md:text-base font-[NanumSquareRound] mt-2">{subtitle}</p>
          </DialogTitle>
        </DialogHeader>
      </div>
      
      <div className="flex flex-col px-2 mb-4">
        {countries.map((country) => (
          <button
            key={country.id}
            className="flex justify-center items-center py-4 px-6
              rounded-xl transition-colors font-[NanumSquareRoundB]
              hover:bg-kr-200 dark:hover:bg-d-kr-200/40 cursor-pointer"
            onClick={() => onSelectCountry(country.id)}
          >
            <div className="w-12 h-8 flex items-center justify-center mr-4 overflow-hidden drop-shadow-nation">
              <img 
                src={getFlagImage(country.flagSrc)} 
                alt={`${country.name} 국기`} 
                className="max-w-full max-h-full object-contain"
                draggable="false"
              />
            </div>
            <span className="text-xl font-medium">{country.name}</span>
          </button>
        ))}
      </div>
    </DialogContent>
  );
}

export default CountrySelector;