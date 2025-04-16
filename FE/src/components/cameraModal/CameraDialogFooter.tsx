import { Camera } from 'lucide-react';

interface CameraDialogFooterProps {
  isPreparingGesture: boolean;
  isCountingDown: boolean;
  isWaitingForProcessing: boolean;
  preparationCountdown: number;
  countdown: number;
  waitingCountdown: number;
  isErrorToastShown: boolean;
  isWebSocketConnected: boolean;
  onCaptureClick: () => void;
}

function CameraDialogFooter({
  isPreparingGesture,
  isCountingDown,
  isWaitingForProcessing,
  preparationCountdown,
  countdown,
  waitingCountdown,
  isErrorToastShown,
  isWebSocketConnected,
  onCaptureClick,
}: CameraDialogFooterProps) {
  // 버튼 텍스트 결정 함수
  const getButtonContent = () => {
    if (isPreparingGesture) {
      return (
        <span className="text-center font-[NanumSquareRoundB]">
          <span className="font-[NanumSquareRoundEB] mr-1 text-cn-600">{preparationCountdown}</span>초 후 인식
          시작
        </span>
      );
    }

    if (isCountingDown) {
      return (
        <span className="text-center font-[NanumSquareRoundB]">
          <span className="font-[NanumSquareRoundEB] mr-1 text-cn-600">{countdown}</span>초 동안 유지
        </span>
      );
    }

    if (isWaitingForProcessing) {
      return (
        <span className="text-center font-[NanumSquareRoundB]">
          <span className="font-[NanumSquareRoundEB] mr-1 text-cn-600">잠시만 기다려주세요</span>
        </span>
      );
    }

    if (!isWebSocketConnected) {
      return (
        <span className="flex items-center">
          <Camera size={20} className="mr-2" />
          웹캠 연결 중...
        </span>
      );
    }

    return (
      <span className="flex items-center font-[NanumSquareRoundB]">
        <Camera size={20} className="mr-2" />
        {isErrorToastShown ? '다시 시도하기' : '검색하기'}
      </span>
    );
  };

  // 버튼 비활성화 조건: 준비 중, 카운트다운 중, 대기 중, 또는 웹캠 연결 안 됨
  const isButtonDisabled = isPreparingGesture || isCountingDown || isWaitingForProcessing || !isWebSocketConnected;

  // 버튼 스타일 결정
  const getButtonStyle = () => {
    if (isButtonDisabled) {
      return 'bg-gray-300 text-black cursor-not-allowed';
    }
    return 'bg-d-txt-50 text-black hover:bg-gray-300 cursor-pointer';
  };

  return (
    <div className="w-full bg-white dark:bg-gray-700">
      <div className="">
        <button
          onClick={onCaptureClick}
          disabled={isButtonDisabled}
          className={`flex items-center justify-center w-full py-3 rounded-b-lg ${getButtonStyle()}`}
        >
          {getButtonContent()}
        </button>
      </div>
    </div>
  );
}

export default CameraDialogFooter;