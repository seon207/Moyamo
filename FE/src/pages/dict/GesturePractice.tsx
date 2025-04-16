import { useLocation, useNavigate } from 'react-router-dom';
import DictHeader from './header/DictHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useCallback } from 'react';
import GesturePracticeCamera from '../../components/GesturePracticeCamera';
import { GlbViewer } from '@/components/GlbViewer';

function GesturePractice() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showCamera, setShowCamera] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const { gesture } = location.state || [];

  const getImageUrl = () => {
    // gestureImage가 있으면 우선 사용 (GLB 파일)
    if (gesture?.gestureImage && gesture.gestureImage.endsWith('.glb')) {
      return gesture.gestureImage;
    }
    // imageUrl이 GLB 파일인 경우 사용
    if (gesture?.imageUrl && gesture.imageUrl.endsWith('.glb')) {
      return gesture.imageUrl;
    }
    // 둘 다 없는 경우 기본 이미지 반환 또는 에러 처리
    return gesture?.gestureImage || gesture?.imageUrl || '';
  };

  console.log(getImageUrl());
  // gesture 없으면 에러 페이지로 이동
  useEffect(() => {
    if (!gesture) {
      navigate('/error');
    }
  }, [gesture, navigate]);

  // 카메라 버튼 클릭 시 카메라로 전환
  const toggleScreen = useCallback(async () => {
    try {
      // 카메라 권한 요청
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // 권한이 허용되면 카메라 표시
      setShowCamera(true);
      setPermissionDenied(false);
      // 스트림 해제 (여기서는 불필요, GesturePracticeCamera에서 새 스트림을 생성할 것이기 때문)
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error('카메라 접근 권한 오류:', error);
      // 권한이 거부되면 알림 표시
      setPermissionDenied(true);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen dark:bg-gray-900 dark:text-d-txt-50">
      {/* 헤더 */}
      <DictHeader title="연습하기" className="" />

      {/* 간단한 설명 또는 카메라 권한 거부 알림 */}
      <div className="font-[NanumSquareRoundB] text-[16px] sm:text-[18px] lg:text-[22px] pt-2 pb-1 px-4 lg:mt-2 text-center flex flex-col justify-center items-center">
        {!permissionDenied ? (
          // 기존 설명 메시지
          <div className="flex flex-col justify-center items-center">
            <div>
              <span>제스처를 정확히 따라하면 화면에&nbsp;</span>
              <span className="text-fern-400 font-[NanumSquareRoundEB] sm:text-[22px] lg:text-[28px]">
                O
              </span>
              <span>표시가 나타납니다.</span>
            </div>
            <div>
              <span>정확한 인식을 위해 손 전체가 화면 안에 들어오도록 유지해주세요.</span>
            </div>
          </div>
        ) : (
          // 권한 거부 알림
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg w-full">
            <p className="font-[NanumSquareRoundB] text-center text-[14px] sm:text-[16px] lg:text-[18px]">
              <strong>알림:</strong> 카메라 사용 권한이 차단되었습니다. 브라우저 설정에서 카메라
              접근을 허용해주세요.
            </p>
          </div>
        )}
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex flex-col md:flex-row w-full flex-1 justify-center items-center gap-4 md:gap-6 px-4 py-2">
        {/* 따라할 제스처 - 정사각형 및 동일 크기 (풀 화면에서 더 큰 크기) */}
        <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-112 lg:h-112 xl:w-120 xl:h-120 flex justify-center items-center mb-2 md:mb-0">
          <div className="w-full group relative h-full bg-white rounded-lg drop-shadow-basic flex justify-center items-center p-3">
            <GlbViewer url={getImageUrl()} />
            <div className="absolute bottom-5 border p-2 rounded-xl border-gray-400 group-hover:bottom-2 transition-all duration-300 group-hover:opacity-0">
              <p className="font-[NanumSquareRoundB] text-gray-500">3D 회전이 가능합니다.</p>
            </div>
          </div>
        </div>

        {/* 연습화면 - 정사각형 및 동일 크기 (풀 화면에서 더 큰 크기) */}
        <div
          className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-112 lg:h-112 xl:w-120 xl:h-120 bg-gray-200 rounded-lg drop-shadow-basic flex justify-center items-center cursor-pointer"
          onClick={!showCamera ? toggleScreen : undefined} // 카메라가 보이지 않을 때만 클릭 이벤트 활성화
        >
          {!showCamera ? (
            <div className="flex flex-col items-center text-gray-400 font-[NanumSquareRoundB] text-center space-y-2 sm:space-y-3">
              <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
                <FontAwesomeIcon icon={faCamera} />
              </div>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl">
                카메라를 클릭 시<br />
                연습을 시작합니다.
              </p>
            </div>
          ) : (
            <GesturePracticeCamera
              guidelineClassName="w-[55%] top-16 md:top-22 lg:top-24"
              guideText="제스처를 3초간 유지해주세요."
              gestureLabel={gesture.gestureLabel}
              gestureType={gesture.gestureType}
            />
          )}
        </div>
      </div>
    </div>
  );
}
export default GesturePractice;
