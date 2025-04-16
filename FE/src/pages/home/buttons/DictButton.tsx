import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import CountrySelector from '../CountrySelector';
import { getIconImage } from '@/utils/imageUtils';

function DictionaryButton() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleDictionaryClick = (): void => {
    setOpen(true);
  };

  const handleCountrySelect = (countryId: number): void => {
    // 사전 페이지로 라우팅
    navigate(`/dictionary?country_id=${countryId}`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          onClick={handleDictionaryClick}
          className="flex flex-col items-center
          bg-transparent border-none z-5 // z-index를 낮게 설정
          cursor-pointer transform transition-transform duration-300
          hover:scale-105"
        >
          <div
            className="flex items-center justify-center relative
            w-35 h-18 sm:w-48 sm:h-22 md:w-55 md:h-23 lg:w-65 lg:h-26
            bg-inch-worm-500 dark:bg-inch-worm-450
            rounded-full drop-shadow-basic"
          >
            <div
              className="relative mr-4 
            w-38 mb-10 select-none
            sm:w-41 sm:mb-14
            md:w-50 md:mb-16 
            lg:w-60 lg:mb-18"
            >
              {/* 책 이미지 */}
              <img
                src={getIconImage('dict')}
                alt="DictionaryIcon"
                className="drop-shadow-basic"
                draggable="false"
              />
            </div>
          </div>
          <p
            className="select-none font-[NanumSquareRoundEB]
            mt-2 md:mt-2 lg:mt-2
            text-lg md:text-xl lg:text-2xl"
          >
            Dictionary
          </p>
        </button>
      </DialogTrigger>
      <CountrySelector
        title="Dictionary"
        subtitle="제스처를 알아보고 싶은 나라를 선택하세요"
        onSelectCountry={handleCountrySelect}
        onClose={() => setOpen(false)}
      />
    </Dialog>
  );
}

export default DictionaryButton;
