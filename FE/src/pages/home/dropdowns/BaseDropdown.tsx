import { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BaseDropdownProps {
  selected: string;
  options: string[];
  children?: ReactNode; //
  className?: string;
  label?: string;
  onSelect: (country: string) => void;
}

function BaseDropdown({
  selected,
  options,
  children,
  className = '',
  onSelect,
}: BaseDropdownProps) {
  const defaultTrigger = (
    <div
      className={`flex items-center justify-between
                min-w-[80px] md:min-w-[110px] lg:min-w-[130px] 
                w-auto whitespace-nowrap
                bg-kr-300 rounded-md p-1 px-2
                cursor-pointer relative
                dark:bg-d-kr-700 dark:text-d-txt-50
                ${className}`}
    >
      <ChevronDown size={15} className="flex-shrink-0 md:ml-2" />
      <div className="flex-1 flex items-center justify-center">
        <span
          className="text-xs md:text-sm lg:text-base
                    font-[NanumSquareRound] font-extrabold"
        >
          {selected}
        </span>
      </div>
    </div>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children || defaultTrigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        className="block text-center
          mt-1 p-0
          min-w-[90px] md:min-w-[110px] lg:min-w-[130px]
          bg-white border-none drop-shadow-basic z-80
          dark:bg-gray-700 dark:text-d-txt-50"
      >
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt}
            className="rounded-none 
              justify-center text-center  
              font-[NanumSquareRound] text-sm
              cursor-pointer
              hover:bg-kr-100 hover:font-bold 
              hover:dark:bg-d-kr-300 hover:dark:text-black"
            onClick={() => onSelect(opt)}
          >
            {opt}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default BaseDropdown;
