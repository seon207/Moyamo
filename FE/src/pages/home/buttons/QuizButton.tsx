import { useNavigate } from 'react-router-dom';
import { getIconImage } from '@/utils/imageUtils';

function QuizButton() {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate('/quiz');
  };

  return (
    <button
          onClick={handleButtonClick}
          className="flex flex-col items-center
          bg-transparent border-none z-5 // z-index를 낮게 설정
          cursor-pointer transform transition-transform duration-300
          hover:scale-105"
        >
      <div
        className="flex items-center justify-center relative
            w-35 h-18 sm:w-48 sm:h-22 md:w-55 md:h-23 lg:w-65 lg:h-26
            bg-lavender-rose-300 dark:bg-lavender-rose-250
            rounded-full drop-shadow-basic"
      >
        <div
          className="relative 
              ml-5 select-none
              w-38 mb-14
              sm:w-38 sm:mb-18
              md:w-43 md:mb-20
              lg:w-50 lg:mb-23"
        >
          <img
            src={getIconImage('quiz')}
            alt="QuizIcon"
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
        Quiz
      </p>
    </button>
  );
}

export default QuizButton;
