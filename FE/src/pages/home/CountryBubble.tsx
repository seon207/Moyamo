import { useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { useTips } from '@/hooks/apiHooks';
import { getAttractionImage } from '@/utils/imageUtils';

// 툴팁 위치 정보 타입
interface TooltipPosition {
  side: 'top' | 'right' | 'bottom' | 'left';
  align: 'start' | 'center' | 'end';
  sideOffset: number;
  alignOffset: number;
}

// 툴팁 관련 인터페이스
interface CountryData {
  id: string;
  countryId: number;
  name: string;
  image: string;
  position: string;
  labelPosition: string;
  labelBackground: string;
  tooltipBackground: string;
  labelDirection: 'left' | 'right';
  tooltipPosition: TooltipPosition;
}

// 디바이스 타입 정의
type DeviceType = 'desktop' | 'landscape-tablet' | 'portrait-tablet' | 'mobile';

// 오리엔테이션 타입 정의
type Orientation = 'portrait' | 'landscape';

// 툴팁 세팅 - 원본 코드 그대로
const countrySetup: CountryData[] = [
  {
    id: 'korea',
    countryId: 1,
    name: 'Korea',
    image: 'korea',
    position: 'absolute top-[20%] left-[10%]',
    labelPosition: 'absolute bottom-13 -right-5 transform translate-x-1/4 translate-y-1/4',
    labelBackground: 'bg-kr-500 dark:bg-d-kr-600',
    tooltipBackground: 'bg-kr-100 dark:bg-d-kr-900 dark:text-d-txt-50',
    labelDirection: 'right',
    tooltipPosition: {
      side: 'top',
      align: 'start',
      sideOffset: -45,
      alignOffset: 100,
    },
  },
  {
    id: 'usa',
    countryId: 2,
    name: 'USA',
    image: 'usa',
    position: 'absolute top-[20%] right-[10%]',
    labelPosition: 'absolute bottom-13 -left-3 transform -translate-x-1/4 translate-y-1/4',
    labelBackground: 'bg-us-600 dark:bg-d-us-500',
    tooltipBackground: 'bg-us-100 dark:bg-d-us-600 dark:text-d-txt-50',
    labelDirection: 'left',
    tooltipPosition: {
      side: 'top',
      align: 'end',
      sideOffset: -45,
      alignOffset: 100,
    },
  },
  {
    id: 'japan',
    countryId: 3,
    name: 'Japan',
    image: 'japan',
    position: 'absolute top-1/2 left-[20%] transform -translate-y-1/2',
    labelPosition: 'absolute bottom-14 right-32 transform translate-x-1/2 translate-y-1/2',
    labelBackground: 'bg-jp-500 dark:bg-d-jp-400',
    tooltipBackground: 'bg-jp-100 dark:bg-jp-100',
    labelDirection: 'right',
    tooltipPosition: {
      side: 'right',
      align: 'center',
      sideOffset: -10,
      alignOffset: 0,
    },
  },
  {
    id: 'china',
    countryId: 4,
    name: 'China',
    image: 'china',
    position: 'absolute bottom-[20%] right-[10%]',
    labelPosition: 'absolute bottom-14 left-0 transform -translate-x-1/2 translate-y-1/2',
    labelBackground: 'bg-cn-600 dark:bg-d-cn-400',
    tooltipBackground: 'bg-cn-100 dark:bg-d-cn-800 dark:text-d-txt-50',
    labelDirection: 'left',
    tooltipPosition: {
      side: 'bottom',
      align: 'end',
      sideOffset: -40,
      alignOffset: 100,
    },
  },
  {
    id: 'italy',
    countryId: 5,
    name: 'Italy',
    image: 'italy',
    position: 'absolute bottom-[20%] left-[10%]',
    labelPosition: 'absolute bottom-14 right-0 transform translate-x-1/2 translate-y-1/2',
    labelBackground: 'bg-italy-600 dark:bg-d-italy-600',
    tooltipBackground: 'bg-italy-100 dark:bg-d-italy-800 dark:text-d-txt-50',
    labelDirection: 'right',
    tooltipPosition: {
      side: 'bottom',
      align: 'start',
      sideOffset: -40,
      alignOffset: 100,
    },
  },
  {
    id: 'communication',
    countryId: 0, // 국가가 아니므로 특별 ID 부여
    name: 'Communication',
    image: 'communication',
    position: 'absolute top-1/2 right-[20%] transform -translate-y-1/2',
    labelPosition: 'absolute bottom-11 left-33 transform -translate-x-1/2',
    labelBackground: 'bg-white',
    tooltipBackground: 'bg-gray-50 dark:bg-slate-100',
    labelDirection: 'left',
    tooltipPosition: {
      side: 'left',
      align: 'center',
      sideOffset: -10,
      alignOffset: 0,
    },
  },
];

function CountryBubble() {
  const { data: tips } = useTips();
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [orientation, setOrientation] = useState<Orientation>('landscape');
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);
  const [isHoverable, setIsHoverable] = useState<boolean>(true);

  useEffect(() => {
    // 화면 크기와 방향에 따라 디바이스 타입 및 방향 설정
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // 방향 설정
      setOrientation(width >= height ? 'landscape' : 'portrait');

      // 디바이스 타입 설정
      if (width <= 640) {
        setDeviceType('mobile');
        // 모바일에서도 호버 가능하도록 변경
        setIsHoverable(true);
      } else if (width <= 768) {
        setDeviceType('portrait-tablet');
        // 태블릿에서도 호버 가능하도록 변경
        setIsHoverable(true);
      } else if (width <= 1024) {
        setDeviceType('landscape-tablet');
        setIsHoverable(true);
      } else {
        setDeviceType('desktop');
        setIsHoverable(true);
      }
    };

    // 다른 곳 클릭 시 툴팁 닫기
    const handleClickOutside = (event: MouseEvent) => {
      if (openTooltip) {
        const tooltipElement = document.getElementById(`tooltip-${openTooltip}`);
        const buttonElement = document.getElementById(`button-${openTooltip}`);

        if (
          (tooltipElement &&
            buttonElement &&
            !tooltipElement.contains(event.target as Node) &&
            !buttonElement.contains(event.target as Node)) ||
          (!tooltipElement && buttonElement && !buttonElement.contains(event.target as Node))
        ) {
          setOpenTooltip(null);
        }
      }
    };

    // 초기 로드 시 설정
    handleResize();

    // 리사이즈 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);
    // 클릭 이벤트 리스너 등록
    document.addEventListener('mousedown', handleClickOutside);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openTooltip]);

  // 툴팁 토글 처리
  const handleTooltipToggle = (countryId: string) => {
    if (openTooltip === countryId) {
      setOpenTooltip(null); // 이미 열린 툴팁이면 닫기
    } else {
      setOpenTooltip(countryId); // 아니면 새로운 툴팁 열기
    }
  };

  const getTipContent = (countryId: number): string => {
    const tip = tips?.find((tip) => tip.countryId === countryId);
    return tip?.content || '제스처로 소통하며 새로운 문화를 경험해보세요!';
  };

  // 모바일/태블릿 환경에서 툴팁을 사용하는 방식으로 변경
  const renderMobileUI = () => {
    // 태블릿과 모바일 환경에서는 Communication 제외
    const filteredCountries = countrySetup.filter((country) => country.id !== 'communication');

    return (
      <TooltipProvider>
        <div className="flex flex-row flex-wrap justify-center gap-x-3 md:gap-x-5 gap-y-8 pb-2">
          {filteredCountries.map((country) => (
            <div key={country.id} className="relative inline-block">
              <Tooltip
                open={openTooltip === country.id ? true : undefined}
                onOpenChange={(open) => {
                  if (!open) {
                    setOpenTooltip(null);
                  }
                }}
              >
                <TooltipTrigger asChild>
                  <div
                    id={`button-${country.id}`}
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => handleTooltipToggle(country.id)}
                    onMouseEnter={() => {
                      if (isHoverable) {
                        setOpenTooltip(country.id);
                      }
                    }}
                  >
                    <div
                      className={`w-15 h-15 sm:w-20 sm:h-20 rounded-full overflow-hidden
                        border-2 ${
                          openTooltip === country.id
                            ? `${
                                country.id === 'korea'
                                  ? 'border-kr-500'
                                  : country.id === 'usa'
                                    ? 'border-us-600'
                                    : country.id === 'japan'
                                      ? 'border-jp-500'
                                      : country.id === 'china'
                                        ? 'border-cn-600'
                                        : country.id === 'italy'
                                          ? 'border-italy-600'
                                          : 'border-gray-500'
                              } scale-105`
                            : 'border-white'
                        }
                      shadow-md hover:shadow-lg transition-all dark:border-slate-100`}
                    >
                      <img
                        src={getAttractionImage(country.image)}
                        alt={country.name}
                        className="select-none w-full h-full object-cover"
                        draggable="false"
                      />
                    </div>
                    <div
                      className={`select-none mt-1 px-3 py-1 rounded-full text-xs sm:text-sm font-bold 
                      ${country.labelBackground} 
                      ${country.name === 'Communication' ? 'text-black border border-black dark:bg-gray-900 dark:text-d-txt-50' : 'text-white'}`}
                    >
                      {country.name}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  id={`tooltip-${country.id}`}
                  className={`${country.tooltipBackground} z-50 text-black p-4 text-sm md:text-base rounded-lg shadow-lg w-60`}
                  side="bottom"
                  align="center"
                >
                  <div className="flex flex-row items-center">
                    <div className="flex-grow">
                      <p className="font-[Galmuri11] font-bold text-xs sm:text-sm">
                        {getTipContent(country.countryId)}
                      </p>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          ))}
        </div>
      </TooltipProvider>
    );
  };

  // 데스크탑 UI - 호버 및 클릭 모두 지원
  const renderDesktopUI = () => {
    return (
      <TooltipProvider>
        <div>
          {/* 국가별 관광지 사진 영역 - 6각형 레이아웃 */}
          <div className="absolute top-13 w-full h-full z-10 pointer-events-none">
            {countrySetup.map((country) => (
              <div key={country.id} className={country.position}>
                <div className="relative">
                  <Tooltip
                    // undefined로 설정하면 기본 호버 동작을 허용하고,
                    // 값을 설정하면 호버 동작을 오버라이드하여 클릭으로 제어
                    open={openTooltip === country.id ? true : undefined}
                    // 오픈 상태가 변경될 때마다 상태 업데이트
                    onOpenChange={(open) => {
                      if (!open) {
                        // 툴팁이 닫힐 때 상태 초기화
                        setOpenTooltip(null);
                      }
                    }}
                  >
                    <TooltipTrigger asChild>
                      <div
                        id={`button-${country.id}`}
                        className="relative cursor-pointer z-30 pointer-events-auto"
                        onClick={() => handleTooltipToggle(country.id)}
                        // hover 상태 제어를 위한 이벤트
                        onMouseEnter={() => {
                          if (isHoverable) {
                            // 호버 가능한 환경에서만 호버 상태 활성화
                            setOpenTooltip(country.id);
                          }
                        }}
                      >
                        <div
                          className={`w-30 h-30 rounded-full overflow-hidden
                            border-2 ${
                              openTooltip === country.id
                                ? `${
                                    country.id === 'korea'
                                      ? 'border-kr-500'
                                      : country.id === 'usa'
                                        ? 'border-us-600'
                                        : country.id === 'japan'
                                          ? 'border-jp-500'
                                          : country.id === 'china'
                                            ? 'border-cn-600'
                                            : country.id === 'italy'
                                              ? 'border-italy-600'
                                              : 'border-gray-500'
                                  } scale-105`
                                : 'border-white'
                            } shadow-lg 
                            transition-transform hover:scale-105
                            dark:border-slate-100`}
                        >
                          <img
                            src={getAttractionImage(country.image)}
                            alt={country.name}
                            className="select-none w-full h-full object-cover"
                            draggable="false"
                          />
                        </div>
                        <div
                          className={`${country.labelPosition} select-none px-4 rounded-full border-2 dark:border-slate-100 font-bold ${
                            country.labelBackground
                          } ${country.name === 'Communication' ? 'text-black border-black dark:bg-gray-900 dark:text-d-txt-50' : 'text-white'}`}
                        >
                          {country.name}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      id={`tooltip-${country.id}`}
                      side={country.tooltipPosition.side}
                      align={country.tooltipPosition.align}
                      sideOffset={country.tooltipPosition.sideOffset}
                      alignOffset={country.tooltipPosition.alignOffset}
                      className={`${country.tooltipBackground} text-black p-5 rounded-lg shadow-lg max-w-xs`}
                      style={{ zIndex: 20 }}
                    >
                      <div className="flex flex-col gap-2">
                        <p className="font-[Galmuri11] font-bold text-sm hyphens-auto break-keep tracking-tight text-pretty leading-normal">
                          {getTipContent(country.countryId)}
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        </div>
      </TooltipProvider>
    );
  };

  // 디바이스 타입에 따라 적절한 UI 렌더링
  return deviceType === 'desktop' || deviceType === 'landscape-tablet'
    ? renderDesktopUI()
    : renderMobileUI();
}

export default CountryBubble;
