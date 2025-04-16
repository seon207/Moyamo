import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { useCountryStyles } from '@/hooks/useCountryStyles';

interface IconButtonProps {
  icon: IconDefinition; //FontAwesome 아이콘의 타입을 정의
  tooltipText: string;
  onClick?: () => void;
  className?: string;
  selectedCountry: string;
  disabled?: boolean;
}

function IconButton({
  icon,
  tooltipText,
  onClick,
  className = '',
  selectedCountry,
  disabled = false,
}: IconButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { getColorClass, getHoverClass } = useCountryStyles(); //useCountryStyles 훅 사용

  return (
    <div
      className="relative font-[NanumSquareRound]"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* 아이콘 버튼 */}
      <button
        className={`w-16 h-16 ${disabled ? 'bg-gray-400 cursor-not-allowed' : `${getColorClass(selectedCountry)} ${getHoverClass(selectedCountry)} cursor-pointer`} 
        transition-colors rounded-lg flex items-center justify-center text-white shadow-lg 
        ${className}`}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
      >
        <FontAwesomeIcon icon={icon} size="xl" color={disabled ? '#eaeaea' : 'white'} />
      </button>
      {/* 아이콘 호버했을 때 툴팁 */}
      {showTooltip && (
        <div className="absolute sm:right-[80%] sm:mr-0 xl:right-auto xl:left-[80%] xl:ml-0 top-1/2 transform -translate-y-1/2 bg-white/90 rounded-xl drop-shadow-basic px-4 py-2 flex items-center whitespace-nowrap z-10">
          <FontAwesomeIcon
            icon={faCircleInfo}
            className={disabled ? 'mr-2 text-gray-500' : 'mr-2 text-gray-800'}
          />
          <span className={disabled ? 'text-gray-500' : 'text-gray-800'}>{tooltipText}</span>
        </div>
      )}
    </div>
  );
}

export default IconButton;
