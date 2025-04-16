import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import Dictionary from './pages/dict/Dictionary';
import Home from './pages/home/Home';
// import ModelTest from './pages/test/modeltest';
import Quiz from './pages/quiz/QuizStart';
import QuizContent from './pages/quiz/Quiz';
import Result from './pages/result/Result';
import CompareGuide from './pages/dict/CompareGuide';
import GestureDetail from './pages/dict/GestureDetail';
import GesturePractice from './pages/dict/GesturePractice';
import ModeToggle from './components/ModeToggle';
import OfflineIndicator from './components/OfflineIndicator';
import './pwa';
import ErrorPage from './components/ErrorPage';
import { getHandLandmarker } from './utils/handLandmarkerSingleton';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // 공통 레이아웃
    children: [
      {
        // 홈
        index: true, // 기본 경로 (/)
        element: <Home />,
      },
      {
        // 검색 결과
        path: 'search',
        element: <Result />,
      },
      {
        // 카메라 검색 결과
        path: 'search/camera',
        element: <Result />,
      },
      {
        // 딕셔너리
        path: 'dictionary',
        children: [
          // 딕셔너리 메인
          {
            index: true,
            element: <Dictionary />,
          },
          // 나라별 비교 가이드
          {
            path: 'compare',
            element: <CompareGuide />,
          },
          // 제스처 상세 페이지
          {
            path: 'detail',
            element: <GestureDetail />,
          },
          // 제스처 연습 페이지
          {
            path: 'practice',
            element: <GesturePractice />,
          },
        ],
      },
      {
        // 퀴즈
        path: 'quiz',
        element: <Quiz />,
      },
      {
        // 퀴즈 컨텐츠
        path: 'quizcontent',
        element: <QuizContent />,
      },
      // {
      //   // 퀴즈 컨텐츠
      //   path: 'modeltest',
      //   element: <ModelTest />,
      // },
      // 에러페이지
      {
        path: 'url-error',
        element: <ErrorPage />,
      },
      // 404 페이지 - 모든 매칭되지 않는 경로에 대해
      {
        path: '*',
        element: <ErrorPage />,
      },
    ],
  },
]);

function App() {
  useEffect(() => {
    // 1. HandLandmarker 모델 미리 로딩
    getHandLandmarker()
      .then(() => {
        console.log('HandLandmarker 미리 로딩 완료');
      })
      .catch((error) => {
        console.error('HandLandmarker 로딩 실패:', error);
      });

    // 2. 서비스 워커 정리 및 상태 확인
    async function manageServiceWorkers() {
      if ('serviceWorker' in navigator) {
        try {
          // 기존 서비스 워커 목록 확인
          const registrations = await navigator.serviceWorker.getRegistrations();
          console.log(`현재 ${registrations.length}개의 서비스 워커가 등록됨`);

          // 서비스 워커 상태 확인
          registrations.forEach((registration, index) => {
            console.log(`서비스 워커 #${index + 1}:`, {
              scope: registration.scope,
              installing: !!registration.installing,
              waiting: !!registration.waiting,
              active: !!registration.active,
              updateViaCache: registration.updateViaCache,
            });

            // 'installing' 상태에 멈춘 서비스 워커 강제 활성화 시도
            if (registration.installing && !registration.active) {
              console.log(
                `서비스 워커 #${index + 1}가 installing 상태에 멈춤, 강제 활성화 시도...`
              );
              // 설치 중인 서비스 워커에 메시지 전송
              if (registration.installing) {
                registration.installing.postMessage({ type: 'SKIP_WAITING' });
              }
            }

            // 대기 중인 서비스 워커 발견 시 활성화
            if (registration.waiting) {
              console.log(`서비스 워커 #${index + 1}가 waiting 상태, 활성화 시도...`);
              registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
          });

          // 중복 서비스 워커 정리 (vite-plugin-pwa가 생성한 워커는 유지)
          if (registrations.length > 1) {
            // 가장 넓은 범위의 서비스 워커 찾기 (일반적으로 루트 경로 '/')
            const rootScopeWorkers = registrations.filter(
              (reg) => reg.scope.endsWith('/') && reg.scope.split('/').length <= 4
            );

            // 루트 범위 서비스 워커가 있으면 나머지는 제거
            if (rootScopeWorkers.length > 0) {
              // 루트 범위가 아닌 서비스 워커 제거
              const workersToRemove = registrations.filter(
                (reg) => !rootScopeWorkers.includes(reg)
              );

              for (const reg of workersToRemove) {
                console.log(`중복 서비스 워커 제거: ${reg.scope}`);
                await reg.unregister();
              }
            }
          }

          // 서비스 워커 상태 변경 감지 이벤트 리스너
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('서비스 워커 컨트롤러 변경됨');
          });
        } catch (error) {
          console.error('서비스 워커 관리 중 오류 발생:', error);
        }
      }
    }

    // 서비스 워커 관리 함수 호출
    manageServiceWorkers();

    // 주기적으로 서비스 워커 상태 확인 (30초마다)
    const intervalId = setInterval(async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          const hasInstallingWorkers = registrations.some((reg) => reg.installing);

          if (hasInstallingWorkers) {
            console.log('30초 후 확인: 아직 installing 상태인 서비스 워커가 있음');

            // 5분(300초) 이상 지속된 경우 강제 리로드 권장
            const appStartTime = window.performance.timeOrigin;
            const currentTime = Date.now();
            const timeElapsed = (currentTime - appStartTime) / 1000;

            if (timeElapsed > 300) {
              console.log('서비스 워커가 5분 이상 installing 상태로 멈춤');
              console.log('브라우저 캐시를 정리하고 페이지를 새로고침하세요');
            }
          }
        } catch (error) {
          console.error('서비스 워커 상태 확인 중 오류:', error);
        }
      }
    }, 30000);

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="h-[100dvh] overflow-hidden relative">
      <Toaster />
      <OfflineIndicator />
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="absolute bottom-4 left-4 z-50">
          <ModeToggle />
        </div>
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  );
}
export default App;
