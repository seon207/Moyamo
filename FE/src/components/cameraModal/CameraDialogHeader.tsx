import { DialogTitle } from '@/components/ui/dialog';

function CameraDialogHeader() {
  return (
    <div className="bg-gray-200 dark:bg-gray-700 dark:text-d-txt-50 py-4 px-6">
      <DialogTitle className="flex py-1 item-center text-center text-2xl mb-1 font-[NanumSquareRoundEB]">
        제스처 검색
      </DialogTitle>
      <div className="flex flex-col justify-start">
        <p className="text-sm text-left font-[NanumSquareRound]">
          가이드라인에 맞춰 자세를 잡고 카메라 버튼을 누릅니다.
        </p>
        <p className="text-sm text-left font-[NanumSquareRound]">
          주어지는 2초의 준비 시간 동안 손 전체가 화면에 들어오게 해 주세요.
        </p>
        <p className="text-sm text-left font-[NanumSquareRound]">
          이후 자동으로 4초 동안 제스처 인식이 진행됩니다.
        </p>
      </div>
    </div>
  );
};

export default CameraDialogHeader;