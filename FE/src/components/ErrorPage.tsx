import { useNavigate, useLocation } from 'react-router-dom';

// 공통 에러 페이지 컴포넌트 (404, 414 등 다양한 에러 처리)
function ErrorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // URL에서 에러 코드와 메시지 가져오기
  const searchParams = new URLSearchParams(location.search);
  const errorCode = searchParams.get('code') || '404';
  
  // 경로에 따른 에러 유형 결정
  const is414Error = location.pathname === '/url-error' || errorCode === '414';
  
  // 에러 유형에 따른 메시지 설정
  const primaryMessage = is414Error 
    ? '요청한 URL이 너무 깁니다'
    : '찾을 수 없는 페이지입니다';
    
  const secondaryMessage = is414Error
    ? '검색어나 필터가 너무 많아 URL 길이가 제한을 초과했습니다'
    : '요청하신 페이지가 사라졌거나, 잘못된 경로를 이용하셨습니다';
  
  const handleBackClick = () => {
    window.history.back();
  };
  
  const handleHomeClick = () => {
    navigate('/');
  };
  
  return (
    <div className="w-screen h-screen flex flex-col items-end justify-center font-[NanumSquareRoundB] bg-white dark:bg-gray-900 overflow-hidden">
      {/* 애니메이션 텍스트 */}
      <div className="absolute font-[Paperlogy-8ExtraBold] top-0 left-0 w-full overflow-hidden pointer-events-none">
        <div className="sliding-text-container">
          <div className="sliding-text sliding-text-very-slow">
            {is414Error 
              ? 'ERROR 414 URL TOO LONG ERROR 414 URL TOO LONG ERROR 414 URL TOO LONG ERROR 414 URL TOO LONG ' 
              : 'PAGE 404 NOT FOUND PAGE 404 NOT FOUND PAGE 404 NOT FOUND PAGE 404 NOT FOUND PAGE 404 NOT FOUND '} 
          </div>
          <div className="sliding-text sliding-text-very-slow">
            {is414Error 
              ? 'ERROR 414 URL TOO LONG ERROR 414 URL TOO LONG ERROR 414 URL TOO LONG ERROR 414 URL TOO LONG ' 
              : 'PAGE 404 NOT FOUND PAGE 404 NOT FOUND PAGE 404 NOT FOUND PAGE 404 NOT FOUND PAGE 404 NOT FOUND '} 
          </div>
        </div>
      </div>
      
      {/* 컨텐츠 */}
      <div className="z-10 flex flex-col items-end justify-center mr-10 md:mr-30 mt-20">
        <div className="text-right text-black dark:text-d-txt-50 text-[15px] sm:text-[20px] md:text-[25px] mb-3 md:mb-7 p-4 rounded-lg">
          <p className='select-none'>
            {primaryMessage}
            <br />
            {secondaryMessage}
          </p>
        </div>
        
        <div className="select-none flex flex-row gap-6 sm:gap-8 lg:gap-10">
          <button
            className={`${
              is414Error
                ? 'bg-us-500 hover:bg-us-600 dark:bg-us-400 dark:hover:bg-us-500'
                : 'bg-kr-600 hover:bg-kr-700 dark:bg-d-kr-600 dark:hover:bg-d-kr-700'
            } text-white dark:text-d-txt-50 px-5 py-2 md:px-12 md:py-4 rounded-full text-sm md:text-base lg:text-2xl cursor-pointer`}
            onClick={handleHomeClick}
          >
            Home
          </button>
          <button
            className={`${
              is414Error
                ? 'bg-us-500 hover:bg-us-600 dark:bg-us-400 dark:hover:bg-us-500'
                : 'bg-kr-600 hover:bg-kr-700 dark:bg-d-kr-600 dark:hover:bg-d-kr-700'
            } text-white dark:text-d-txt-50 px-5 py-2 md:px-12 md:py-4 rounded-full text-sm md:text-base lg:text-2xl cursor-pointer`}
            onClick={handleBackClick}
          >
            Back
          </button>
        </div>
      </div>
      
      {/* 스타일 */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .sliding-text-container, .sliding-text-container-reverse {
            display: flex;
            white-space: nowrap;
            overflow: hidden;
          }
          
          .sliding-text, .sliding-text-reverse {
            display: inline-block;
            font-size: 120px;
            font-weight: 800;
            color: ${is414Error ? 'var(--color-us-500, #FF9800)' : 'var(--color-kr-500, #AB50D9)'};
            opacity: 0.3;
            padding-left: 0;
            text-transform: uppercase;
          }
          
          @media (max-width: 768px) {
            .sliding-text, .sliding-text-reverse {
              font-size: 64px;
            }
          }
          
          .sliding-text {
            animation: slide 20s linear infinite;
            font-size: 250px; /* 매우 큰 글씨 크기 */
          }
          
          .sliding-text-slow {
            animation: slide 40s linear infinite; /* 기존 30s에서 40s로 변경 */
          }
          
          .sliding-text-very-slow {
            animation: slide 90s linear infinite; /* 새로운 매우 느린 속도 */
          }
          
          .sliding-text-reverse {
            animation: slide-reverse 20s linear infinite;
          }
          
          @keyframes slide {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-100%);
            }
          }
          
          @keyframes slide-reverse {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(0);
            }
          }
          
          /* 다크 모드 텍스트 색상 */
          @media (prefers-color-scheme: dark) {
            .sliding-text, .sliding-text-reverse {
              color: ${is414Error ? 'var(--color-orange-300, #FFB74D)' : 'var(--color-d-kr-500, #CEA0FA)'};
            }
          }
          
          .dark .sliding-text, .dark .sliding-text-reverse {
            color: ${is414Error ? 'var(--color-orange-300, #FFB74D)' : 'var(--color-d-kr-500, #CEA0FA)'};
          }
        `
      }} />
    </div>
  );
}

export default ErrorPage;