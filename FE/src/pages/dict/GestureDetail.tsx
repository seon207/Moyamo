import DictHeader from './header/DictHeader';
import '@/components/ui/scrollbar.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCountryStyles } from '@/hooks/useCountryStyles';
import { useGestureDetail } from '@/hooks/apiHooks';
import { useCountryCode } from '@/hooks/useCountryCode';
import { GlbViewer } from '@/components/GlbViewer';

function GestureDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { getColorClass, getHoverClass } = useCountryStyles(); //useCountryStyles 훅 사용

  // URL에서 country_id 파라미터 가져오기
  const queryParams = new URLSearchParams(location.search);
  const gestureIdParam = queryParams.get('gesture_id') as string;
  const gestureId = parseInt(gestureIdParam);
  const countryIdParam = queryParams.get('country_id') as string;
  const countryId = parseInt(countryIdParam);
  const getCountryCode = useCountryCode();

  // useGestureDetail 훅을 사용하여 제스처 상세 정보 가져오기
  const { data: gestureDetailData, isLoading, isError } = useGestureDetail(gestureId, countryId);
  const gestureData = gestureDetailData;
  const countryCode = getCountryCode(gestureData?.countryName);

  // 로딩 상태 확인
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">로딩 중...</div>;
  }

  // 에러 상태 확인
  if (isError || !gestureData) {
    navigate('/error');
  }

  // '사용 상황' 데이터 파싱
  const parseGestureSituation = (situationData: string) => {
    if (!situationData) return [];

    // '/'가 포함되어 있는지 확인
    if (situationData.includes('/')) {
      // '/'로 구분된 여러 항목이 있는 경우
      return situationData.split('/').map((item) => item.trim());
    } else {
      // '/'가 없는 경우 전체 문자열을 하나의 항목으로 처리
      return [situationData.trim()];
    }
  };

  // '다른 나라에서의 의미' 데이터 파싱
  const parseGestureOthers = (gestureOthersData: string) => {
    if (!gestureOthersData) return [];

    // '/'가 포함되어 있는지 확인
    if (gestureOthersData.includes('/')) {
      // '/'로 구분된 여러 항목이 있는 경우
      const groups = gestureOthersData.split('/');
      return groups.map((group) => {
        if (!group.includes(':')) {
          // ':'가 없는 경우 전체를 countries로 처리
          return {
            countries: group.trim(),
            meaning: '',
          };
        }

        const parts = group.split(':');
        const countries = parts[0] || '';
        const meaning = parts[1] || '';

        return {
          countries: countries.trim(),
          meaning: meaning.trim(),
        };
      });
    } else {
      // '/'가 없는 경우, 한 건만 처리
      if (!gestureOthersData.includes(':')) {
        // ':'도 없는 경우
        return [
          {
            countries: gestureOthersData.trim(),
            meaning: '',
          },
        ];
      }

      const parts = gestureOthersData.split(':');
      const countries = parts[0] || '';
      const meaning = parts[1] || '';

      return [
        {
          countries: countries.trim(),
          meaning: meaning.trim(),
        },
      ];
    }
  };

  // TMI 데이터 파싱
  const parseTmiData = (tmiData: string) => {
    if (!tmiData) return [];

    // '/'가 포함되어 있는지 확인
    if (tmiData.includes('/')) {
      // '/'로 구분된 여러 항목이 있는 경우
      return tmiData.split('/').map((item) => item.trim());
    } else {
      // '/'가 없는 경우 전체 문자열을 하나의 항목으로 처리
      return [tmiData.trim()];
    }
  };

  // '사용 상황' 파싱된 데이터 저장
  const parsedSitudationData = gestureData?.gestureSituation
    ? parseGestureSituation(gestureData.gestureSituation)
    : [];

  // '다른 나라에서의 의미' 파싱된 데이터 저장
  const otherMeanings = gestureData?.gestureOthers
    ? parseGestureOthers(gestureData.gestureOthers)
    : [];

  // 'TMI' 파싱된 데이터 저장
  const tmi = gestureData?.gestureTmi ? parseTmiData(gestureData.gestureTmi) : [];

  // 연습하기 버튼 클릭 핸들러
  const handlePracticeClick = () => {
    navigate('/dictionary/practice', {
      state: {
        gesture: gestureData,
      },
    });
  };

  return (
    <div className="flex flex-col h-screen dark:bg-gray-900 dark:text-d-txt-50">
      {/* 헤더 */}
      <DictHeader
        title={gestureData?.countryName}
        gestureCompareInfo={gestureData}
        showCompareGuide={(gestureData?.multipleGestures ?? 0) >= 1} // undefined나 null일 경우 0을 사용
        className=""
      />

      {/* 메인 컨텐츠 영역 */}
      <div className="flex flex-col h-[80%] overflow-hidden w-full ">
        <div
          className={`flex flex-col md:flex-col lg:flex-row mx-auto w-full max-w-6xl pt-[30px] 
          overflow-y-auto customScrollbar ${countryCode} h-full`}
        >
          {/* 제스처 이미지 */}
          <div className="relative group w-full lg:w-1/2 p-6 flex justify-center items-center">
            <div
              className="w-full max-w-[600px] md:max-w-[500px] sm:max-w-[500px] lg:h-[90%] sm:h-[250px] min-h-[150px] 
              bg-white dark:bg-gray-500 rounded-lg drop-shadow-basic flex justify-center items-center"
            >
              {gestureData?.gestureImage ? (
                <>
                  <GlbViewer url={`${gestureData.gestureImage}`} />
                  <div className="absolute bottom-8 border p-2 rounded-xl border-gray-400 group-hover:bottom-2 transition-all duration-300 group-hover:opacity-0">
                    <p className="font-[NanumSquareRoundB] text-gray-500 dark:text-d-txt-50">
                      3D 회전이 가능합니다.
                    </p>
                  </div>
                </>
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400 font-[NanumSquareRoundB]">
                  이미지 준비 중
                </div>
              )}
            </div>
          </div>

          {/* 제스처 관련 설명 */}
          <div
            className={`w-full lg:w-1/2 p-6 relative overflow-y-auto customScrollbar ${countryCode}`}
          >
            {/* 제스처 사전 제목 */}
            <div className="mb-2">
              <span className="font-[NanumSquareRoundEB] text-[25px]">제스처 사전</span>
            </div>
            <hr className="text-gray-400 mb-4" />

            <div className="pr-4 font-[NanumSquareRound]">
              <h2 className="text-[20px] font-[NanumSquareRoundB] mb-2">의미</h2>
              <div className="bg-white dark:bg-gray-500 rounded-lg p-5 drop-shadow-basic mb-8 text-[16px]">
                {gestureData?.gestureMeaning}
              </div>

              <h2 className="text-[20px] font-[NanumSquareRoundB] mb-2">사용 상황</h2>
              <div className="bg-white dark:bg-gray-500 rounded-lg p-5 drop-shadow-basic mb-8">
                <ul className="text-lg space-y-3 text-[16px]">
                  {parsedSitudationData.map((item, index) => (
                    <li
                      key={index}
                      className="hyphens-auto break-keep tracking-tight text-pretty leading-normal"
                    >
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>

              <h2 className="text-[20px] font-[NanumSquareRoundB] mb-2">다른 나라에서의 의미</h2>
              <div className="bg-white dark:bg-gray-500 rounded-lg p-5 drop-shadow-basic mb-8">
                <ul className="text-lg space-y-3 text-[16px] hyphens-auto break-keep tracking-tight text-pretty leading-normal">
                  {otherMeanings.map((item, index) => (
                    <li
                      key={index}
                      className="hyphens-auto break-keep tracking-tight text-pretty leading-normal"
                    >
                      • {item.countries.replace(/,/g, ', ')} : {item.meaning}
                    </li>
                  ))}
                </ul>
              </div>

              {/* tmi 없는 경우도 있음 */}
              {tmi.length > 0 && (
                <>
                  <h2 className="text-[20px] font-[NanumSquareRoundB] mb-2">TMI</h2>
                  <div className="bg-white dark:bg-gray-500 rounded-lg p-5 drop-shadow-basic mb-8">
                    <ul className="text-lg space-y-3 text-[16px]">
                      {tmi.map((item, index) => (
                        <li
                          key={index}
                          className="hyphens-auto break-keep tracking-tight text-pretty leading-normal"
                        >
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 연습하기 버튼 */}
      <div className="h-[10%] w-full bg-[#f5f5f5] dark:bg-gray-900 flex items-center justify-center mb-3 mt-3">
        <div className="w-full max-w-6xl px-6">
          <button
            className={`w-full max-w-[600px] mx-auto py-3 ${getColorClass(countryCode)} text-white text-xl font-[NanumSquareRoundEB] rounded-lg 
            hover:${getHoverClass(countryCode)} transition-colors block cursor-pointer`}
            onClick={handlePracticeClick}
          >
            연습하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default GestureDetail;
