//서버에 type을 전달해야 함.
import '@/index.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';

function Quiz() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [normalTooltip, setNormalTooltip] = useState(false);
  const [aiTooltip, setAiTooltip] = useState(false);

  const handleButtonClick = (): void => {
    setOpen(true);
  };

  const handleStart = (useCamera: boolean) => {
    // useCamera 값에 따라 다른 URL로 이동
    if (useCamera !== undefined) {
      if (useCamera) {
        navigate('/quizcontent?useCamera=true');
      } else {
        navigate('/quizcontent?useCamera=false');
      }
    } else {
      navigate('/ququizcontentiz');
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
    
        <DialogTrigger asChild>
          <button
            className="select-none absolute bottom-40 left-1/2 transform -translate-x-1/2 text-4xl xl:text-6xl font-['DNFBitBitv2'] text-gray-900 drop-shadow-quiz-box dark:text-gray-200 px-[10vh] py-[1vh] rounded-xl flex justify-center items-center align-center bg-[var(--color-kr-400)] border-2 border-gray-200 dark:border-gray-400 dark:bg-[var(--color-kr-300)] dark:drop-shadow-quiz animate-bounce cursor-pointer"
            onClick={handleButtonClick}
          >
            <p className="drop-shadow-basic md:text-3xl xl:text-5xl py-1">start</p>
          </button>
        </DialogTrigger>

        <DialogContent
          className="py-10 px-10 drop-shadow-basic
            bg-white border-none font-[NanumSquareRound]
            dark:bg-gray-800 dark:text-d-txt-50"
          style={{ maxWidth: '530px', width: '90vw' }}
        >
          <DialogHeader>
            <DialogTitle className="my-4 text-3xl font-[NanumSquareRoundEB]">
              <FontAwesomeIcon icon={faSquareCheck} className="mr-2" />
              제스처 퀴즈 모드 선택
            </DialogTitle>
            <DialogDescription className="text-lg">
              <p>총 다섯 문항을 진행하며 모드 선택이 가능합니다</p>
              <p className="text-sm mt-1">
                카메라 모드의 데이터는 퀴즈 진행에 이용되며 서버에 저장되지 않습니다.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-4 mt-3">
            {/* 일반 모드 버튼 */}
            <div className="relative">
              <Button
                className="bg-kr-500 dark:bg-kr-400 text-white cursor-pointer min-w-[120px] w-32 h-10"
                onClick={() => handleStart(false)}
                onMouseEnter={() => setNormalTooltip(true)}
                onMouseLeave={() => setNormalTooltip(false)}
              >
                일반 모드
              </Button>

              {/* 일반 모드 커스텀 말풍선 */}
              {normalTooltip && (
                <div className="absolute z-50 top-full mt-3 left-1/2 -translate-x-1/2 whitespace-normal">
                  <div className="bg-white rounded-lg px-4 py-2 flex items-center shadow-md w-100 drop-shadow-basic">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rotate-45 w-2 h-2 bg-white"></div>
                    <div className="flex items-start">
                      <div className="bg-white rounded-full w-4 h-4 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                        <FontAwesomeIcon icon={faCircleInfo} className="text-black text-xs" />
                      </div>
                      <span className="text-sm text-gray-800">
                        기본적인 4지선다형의 제스처 퀴즈 문항들이 주어집니다.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* AI 모드 버튼 */}
            <div className="relative">
              <Button
                className="bg-kr-500 dark:bg-kr-450 text-white cursor-pointer min-w-[120px] w-32 h-10"
                onClick={() => handleStart(true)}
                onMouseEnter={() => setAiTooltip(true)}
                onMouseLeave={() => setAiTooltip(false)}
              >
                AI 모드
              </Button>

              {/* AI 모드 커스텀 말풍선 */}
              {aiTooltip && (
                <div className="absolute z-50 top-full mt-3 left-1/2 -translate-x-1/2 whitespace-normal">
                  <div className="bg-white rounded-lg px-4 py-2 flex items-center shadow-md w-100 drop-shadow-basic">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rotate-45 w-2 h-2 bg-white"></div>
                    <div className="flex items-start">
                      <div className="bg-white rounded-full w-4 h-4 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                        <FontAwesomeIcon icon={faCircleInfo} className="text-black text-xs mt-1" />
                      </div>
                      <span className="text-sm text-gray-800">
                        주어진 설명을 보고 카메라를 활용하여 제스처를 인식하며 퀴즈를 진행합니다.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col h-screen overflow-hidden w-full bg-[var(--color-kr-100)] dark:bg-gray-900">
        <div className="flex flex-col justify-center items-center h-3/4">
          {/* 중간 텍스트 부분 */}
          <div className="flex flex-col items-center align-center font-['DNFBitBitv2'] mt-30 animate-pulse">
            {/* <img src="/images/quiz_img1.png" alt="quiz-img" className="w-1/2 h-auto" /> */}
            <div className="select-none mb-8 text-gray-900 dark:text-gray-200 text-4xl md:text-6xl xl:text-8xl drop-shadow-quiz-box dark:drop-shadow-quiz pb-5">
              GESTURE
            </div>
            <div className="select-none text-gray-900 dark:text-gray-200 text-4xl md:text-6xl xl:text-8xl drop-shadow-quiz-box dark:drop-shadow-quiz pb-10">
              QUIZ
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Quiz;
//텍스트+버튼+그림들PNG우선
//start버튼 누르면 그 다음에 3개 중에 랜덤으로 가도록 함
