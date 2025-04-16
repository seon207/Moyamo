import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      includeAssets: ['favicon.ico'],
      filename: 'favicon/site.webmanifest',
      manifest: {
        name: 'Moyamo',
        short_name: 'Moyamo',
        description: '국가별 제스처 정보 제공 서비스',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'any',
        start_url: '/', // start_url
        icons: [
          {
            src: '/favicon/web-app-manifest-192x192.png', // 경로 수정
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any', // purpose 추가
          },
          {
            src: '/favicon/web-app-manifest-512x512.png', // 경로 수정
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any', // purpose 추가
          },
          {
            src: '/favicon/maskable-icon-512x512.png', // 경로 확인 필요
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        // 스크린샷 추가
        screenshots: [
          {
            src: '/screenshots/desktop.png', // 데스크톱 스크린샷 이미지 경로
            sizes: '1280x800',
            type: 'image/png',
            form_factor: 'wide', // 데스크톱용
          },
          {
            src: '/screenshots/mobile.png', // 모바일 스크린샷 이미지 경로
            sizes: '390x844',
            type: 'image/png',
            form_factor: 'narrow', // 모바일용
          },
        ],
      },
      // workbox 설정은 그대로 유지
      workbox: {
        // 모든 앱 자산 캐싱
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,json,woff,woff2}'],
        clientsClaim: true,
        skipWaiting: true,
        // 오프라인 페이지 설정
        // navigateFallback: '/offline.html',

        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,

        // 런타임 캐싱 설정
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1년
              },
            },
          },
          // 정적 에셋에 대한 캐싱
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30일
              },
            },
          },
          // JS와 CSS 파일 캐싱
          {
            urlPattern: /\.(?:js|css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
            },
          },
          //미디어파이프 모델 파일 캐싱
          {
            urlPattern:
              /^https:\/\/storage\.googleapis\.com\/mediapipe-models\/hand_landmarker\/hand_landmarker\/float16\/1\/hand_landmarker\.task$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'mediapipe-hand-model',
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30일
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },

          // 미디어파이프 WASM 파일 캐싱 - 더 명확한 URL 패턴 사용
          {
            urlPattern:
              /^https:\/\/cdn\.jsdelivr\.net\/npm\/@mediapipe\/tasks-vision@latest\/wasm\/(vision_wasm_internal\.js|vision_wasm_internal\.wasm)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'mediapipe-wasm-files',
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30일
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        // 에셋 파일명에 해시 포함하여 캐싱 최적화
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://moyamo.site',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
    // HMR 관련 설정 추가
    hmr: {
      overlay: false, // 오류 오버레이 비활성화
    },
    watch: {
      usePolling: true, // 폴링 방식으로 파일 변경 감지
      interval: 1000, // 폴링 간격(ms)
    },
  },
  // 캐시 관련 설정 추가
  optimizeDeps: {
    force: true, // 의존성 강제 재최적화
  },
  // 소스맵 설정 - 개발 중 디버깅 용이하게
  css: {
    devSourcemap: true,
  },
});
