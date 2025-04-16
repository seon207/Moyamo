import React, { useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleList } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft, faHouse } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import DictCountrySelector from './DictCountrySelector';
import { Country } from '@/types/dictionaryType';
import { getFlagImage } from '@/utils/imageUtils';
import { useCountryCode } from '@/hooks/useCountryCode';
import { GestureDetail } from '@/types/dictDetailType';

// DictHeader 컴포넌트 prop 타입
interface DictHeaderProps {
  title?: string; // 제목
  gestureCompareInfo?: GestureDetail; // 국가 관련 정보
  showCompareGuide?: boolean; // 비교 가이드 버튼 표시 여부
  className?: string; // 드롭다운 관련 속성
  showCountrySelector?: boolean; // 국가 선택 드롭다운 표시 여부
  selectedCountry?: Country;
  onSelectCountry?: (country: Country) => void;
  countryOptions?: Country[];
}

// 메모이제이션된 컴포넌트
const DictHeader = React.memo(function DictHeader({
  title,
  gestureCompareInfo,
  showCompareGuide = false,
  className,
  showCountrySelector = false,
  selectedCountry,
  onSelectCountry,
  countryOptions = [],
}: DictHeaderProps) {
  const navigate = useNavigate();
  const getCountryCode = useCountryCode();
  const countryCode = useMemo(
    () => getCountryCode(gestureCompareInfo?.countryName),
    [getCountryCode, gestureCompareInfo?.countryName]
  );

  // 국가 선택 핸들러 - useCallback으로 최적화
  const handleCountrySelect = useCallback(
    (country: Country) => {
      if (onSelectCountry) {
        onSelectCountry(country);
      }
    },
    [onSelectCountry]
  );

  // 뒤로가기 - useCallback으로 최적화
  const handleGoBack = useCallback(() => {
    const currentPath = window.location.pathname;

    if (currentPath === '/dictionary') {
      navigate('/');
    } else {
      window.history.back();
    }
  }, [navigate]);

  // 비교 가이드 페이지로 이동 - useCallback으로 최적화
  const handleGuideClick = useCallback(() => {
    if (gestureCompareInfo?.gestureId) {
      navigate(`/dictionary/compare?gesture_id=${gestureCompareInfo.gestureId}`);
    }
  }, [navigate, gestureCompareInfo?.gestureId]);

  // 로고 클릭 시 홈으로 이동 - useCallback으로 최적화
  const handleLogoClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <header
      className={`w-[95%] h-[65px] mx-auto mt-[24px] px-[24px] grid grid-cols-3 gap-1 bg-white rounded-lg drop-shadow-basic dark:bg-gray-500 dark:text-d-txt-50 overflow-hidden ${className || ''}`}
      style={{ height: '65px' }}
    >
      <div className="col-span-1 flex justify-start items-center">
        <button className="cursor-pointer" onClick={handleGoBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      </div>

      {/* 가운데 - 제목 또는 국가 선택 드롭다운 */}
      <div className="flex justify-center items-center col-span-1">
        {/* 제목 표시할 때 */}
        {!showCountrySelector && (
          <div className="flex items-center w-full justify-center h-[40px] min-w-[210px] text-[18px] md:text-[24px] xl:text-[32px] ">
            {gestureCompareInfo && (
              <img
                src={getFlagImage(countryCode)}
                alt={`${gestureCompareInfo.countryName} flag`}
                className="w-[65px] h-[40px] mr-4 object-cover drop-shadow-nation"
                draggable="false"
                loading="eager"
              />
            )}
            <h1 className="text-[18px] md:text-[24px] xl:text-[32px] font-[NanumSquareRoundEB] text-center">
              {title}
            </h1>
          </div>
        )}

        {/* 국가 선택 드롭다운 표시*/}
        {showCountrySelector && selectedCountry && (
          <div className="flex justify-center items-center cursor-pointer py-0">
            <DictCountrySelector
              selectedCountry={selectedCountry}
              onSelectCountry={handleCountrySelect}
              countryOptions={countryOptions}
            />
          </div>
        )}
      </div>

      {/* 오른쪽 - 비교 가이드 버튼 있을 때 */}
      <div className="flex col-span-1 justify-end items-center gap-1">
        {showCompareGuide && (
          <button
            className="flex items-center right-4 px-3 py-2 text-[13px] sm:text-[15px] bg-gray-200 text-gray-600
           hover:bg-gray-300 transition-colors rounded-xl cursor-pointer mr-3 lg:mr-3"
            onClick={handleGuideClick}
          >
            <FontAwesomeIcon icon={faRectangleList} className="mr-0.5 sm:mr-1.5" />
            <span className="hidden sm:inline font-[NanumSquareRound]">비교 가이드</span>
          </button>
        )}
        <div className="text-xl md:text-2xl lg:text-3xl flex items-center">
          <FontAwesomeIcon icon={faHouse} onClick={handleLogoClick} />
        </div>
      </div>
    </header>
  );
});

// 디스플레이 이름 설정
DictHeader.displayName = 'DictHeader';

export default DictHeader;
