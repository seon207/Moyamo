interface LanguageFlagProps {
  flagUrl: string;
  name: string;
  className?: string;
}

export function LanguageFlag({ flagUrl, name, className = '' }: LanguageFlagProps) {
  return (
    <img
      src={flagUrl}
      alt={`${name} 국기`}
      className={`w-6 h-6 drop-shadow-nation rounded-full object-cover ${className}`}
    />
  );
}