import { faHouse, faBackward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import QuizTwinkleLottie from '../../components/QuizTwinkleLottie'; // 로티 컴포넌트 import

interface QuizResultProps {
  userAnswers: (boolean | null)[];
}

function QuizResult({ userAnswers }: QuizResultProps): JSX.Element {
  const navigate = useNavigate();

  const handleQuiz = () => {
    navigate(`/quiz`);
  };
  const handleHome = () => {
    navigate('/');
  };

  const isCorrectAnswers = userAnswers.filter((answer) => answer === true);
  const isCorrectNumber = isCorrectAnswers.length;

  let starImage = '/images/star0.png';
  if (isCorrectNumber === 1) {
    starImage = '/images/star1.png';
  } else if (isCorrectNumber === 2) {
    starImage = '/images/star2.png';
  } else if (isCorrectNumber === 3) {
    starImage = '/images/star3.png';
  } else if (isCorrectNumber === 4) {
    starImage = '/images/star4.png';
  } else if (isCorrectNumber === 5) {
    starImage = '/images/star5.png';
  }

  let startext = 'Oops!';
  if (isCorrectNumber === 1) {
    startext = 'Okay';
  } else if (isCorrectNumber === 2) {
    startext = 'Okay';
  } else if (isCorrectNumber === 3) {
    startext = 'Yay!';
  } else if (isCorrectNumber === 4) {
    startext = 'Wow';
  } else if (isCorrectNumber === 5) {
    startext = 'Perfect!';
  }

  return (
    <>
      <div className="h-screen w-full overflow-hidden flex flex-col justify-center items-center bg-black/80 z-20 absolute">
        {/* Twinkle Lottie 애니메이션 추가 */}
        <div className="absolute top-0 left-0 w-full">
          <QuizTwinkleLottie height="20vh" />
        </div>

        <div className="text-xl font-bold p-[3vh] drop-shadow-quiz-box text-white animate-bounce font-[DNFBitBitv2] ">
          <p>{startext}</p>
        </div>
        <div className="flex flex-col justify-evenly items-center bg-white border-5 border-yellow-400 rounded-xl w-1/2 lg:w-1/3 h-1/3 lg:h-2/5  p-[5vh] py-[5vh] ">
          <h1 className="text-4xl xl:text-5xl font-bold font-[DNFBitBitv2] text-yellow-500 drop-shadow-quiz-box">
            SCORE
          </h1>
          {/* 함수: 맞춘 갯수 count를 한 후에, 숫자로 보여주기 */}
          <p className="text-yellow-500 text-4xl xl:text-5xl font-bold font-[DNFBitBitv2] p-5">
            {isCorrectNumber}
          </p>
          {/* 기존 이미지 유지 */}
          <img src={starImage} alt="stars" className="w-2/3 drop-shadow-quiz-box" />
        </div>
        <div className="flex justify-center p-[3vh] w-1/2 h-1/7">
          <button
            className="bg-white in-hover:not-only:not-first:not-odd:: rounded-xl w-1/5 h-full mx-[2vh] text-2xl drop-shadow-quiz-box hover:bg-yellow-200 cursor-pointer"
            onClick={handleHome}
          >
            <FontAwesomeIcon icon={faHouse} />
          </button>
          <button
            className="bg-white rounded-xl w-1/5 h-full mx-[2vh] drop-shadow-quiz-box text-2xl -box hover:bg-yellow-200 cursor-pointer"
            onClick={handleQuiz}
          >
            <FontAwesomeIcon icon={faBackward} />
          </button>
        </div>
      </div>
    </>
  );
}

export default QuizResult;
