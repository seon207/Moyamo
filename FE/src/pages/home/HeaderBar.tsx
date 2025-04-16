import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/components/theme-provider';
import DarkModeLottie from './DarkModeLottie';
import GestureSearchInput from '../../components/gestureSearch/GestureSearch';
import { getLogoImage } from '@/utils/imageUtils';

// 메인 HeaderBar 컴포넌트
function HeaderBar() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const logoSrc = theme === 'dark' ? `${getLogoImage('logo-dark')}` : `${getLogoImage('logo')}`;

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="relative w-full z-30 pointer-events-none">
      <button
        className="absolute cursor-pointer pointer-events-auto
        left-[6%] top-[23px] md:left-[14%] md:top-[15px] lg:left-[13.5%] lg:top-[8px] xl:top-[8px]"
      >
        <img
          src={logoSrc}
          alt="MoyamoLogo"
          className="w-25 h-10 md:w-32 md:h-12 lg:w-40 lg:h-14 select-none"
          onClick={handleLogoClick}
          draggable="false" // 드래그 방지
        />
      </button>
      <div className="w-full flex justify-center mt-11 mb-5 py-4 px-2 md:px-6">
        <div
          className="dark:text-d-txt-50/80 w-[90%] md:w-[75%]
          bg-white dark:bg-white/15 py-1 px-3 md:px-6 rounded-xl shadow-sm
          pointer-events-auto"
        >
          <div className="flex items-center">
            {/* 검색 인풋 컴포넌트 */}
            <div className="flex-1 ml-2">
              <GestureSearchInput />
            </div>

            {/* 다크모드 토글 및 언어 선택 */}
            <div className="ml-1 md:ml-3">
              <DarkModeLottie />
              {/* <TranslationDropdown /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderBar;
