import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  useEffect(() => {
    // iOS 기기 감지
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOSDevice(isIOS);

    // PWA 기존 설치 여부 확인
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsPWAInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptEvent(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setIsPWAInstalled(true);
      setSupportsPWA(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleClick = async () => {
    if (!promptEvent) {
      return;
    }
    promptEvent.prompt();

    const { outcome } = await promptEvent.userChoice;
    if (outcome === 'accepted') {
      console.log('사용자가 앱 설치를 수락했습니다');
    } else {
      console.log('사용자가 앱 설치를 거부했습니다');
    }

    setPromptEvent(null);
  };

  // 이미 설치된 경우 아무것도 표시하지 않음
  if (isPWAInstalled) {
    return null;
  }

  // 일반 설치 버튼 (Chrome, Edge, Opera, Samsung Internet 등)
  if (supportsPWA) {
    return (
      <Button onClick={handleClick} className="flex items-center gap-2">
        <Download className="w-4 h-4" />앱 설치하기
      </Button>
    );
  }

  // iOS 기기용 안내
  if (isIOSDevice) {
    return (
      <Alert className="mt-4">
        <AlertTitle>앱 설치하기</AlertTitle>
        <AlertDescription className="mt-2">
          <p>이 웹앱을 홈 화면에 추가하려면:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>Safari 브라우저의 공유 버튼(□↑)을 탭하세요</li>
            <li>"홈 화면에 추가" 옵션을 선택하세요</li>
            <li>"추가"를 탭하세요</li>
          </ol>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default InstallPWA;
