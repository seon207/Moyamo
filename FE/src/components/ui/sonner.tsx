import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      style={{ zIndex: 9999 }}
      richColors
      // 토스트 옵션을 통해 스타일 적용
      toastOptions={{
        // 모든 토스트에 적용되는 스타일
        // style: {
        //   width: '400px', // 넓이 증가
        //   padding: '15px', // 패딩 증가
        //   maxWidth: '100%', // 반응형을 위한 최대 너비
        //   fontSize: '14px', // 기본 폰트 크기 증가
        // },
        // 모든 토스트에 적용되는 클래스
        className: 'rounded-lg shadow-lg',
        // 토스트 내부 요소별 클래스 지정
        classNames: {
          title: 'ml-2 font-[NanumSquareRoundB] text-base font-bold',
          description: 'ml-2 font-[NanumSquareRound] text-[13px] mt-1 break-keep break-words whitespace-pre-wrap',
          toast: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
          success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
          error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
        },
      }}
      {...props}
    />
  );
};

// 전역 CSS에 추가 (index.css 또는 globals.css)
// 이 스타일은 컴포넌트 외부에서 정의해야 합니다
/*
.sonner-toast {
  width: 400px !important;
  padding: 16px !important;
  font-size: 16px !important;
}

.sonner-toast-title {
  font-size: 18px !important;
}

.sonner-toast-description {
  font-size: 16px !important;
}
*/

export { Toaster };
