// const CACHE_NAME = 'mediapipe-model-cache-v1';
// const MODEL_URLS = [
//   'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
//   'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm/vision_wasm_internal.js',
//   'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm/vision_wasm_internal.wasm'
// ];

// // 서비스 워커 설치 시 모델 파일 사전 캐싱
// self.addEventListener('install', (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then((cache) => {
//         console.log('Service Worker: 모델 파일 캐싱 중...');
//         return cache.addAll(MODEL_URLS);
//       })
//   );
// });

// // 네트워크 요청 가로채기
// self.addEventListener('fetch', (event) => {
//   const url = new URL(event.request.url);
  
//   // 미디어파이프 모델 또는 WASM 파일에 대한 요청인지 확인
//   if (MODEL_URLS.some(modelUrl => url.href.includes(modelUrl))) {
//     event.respondWith(
//       caches.match(event.request)
//         .then((response) => {
//           // 캐시에 있으면 캐시에서 제공
//           if (response) {
//             console.log('Service Worker: 캐시에서 모델 파일 제공', url.href);
//             return response;
//           }
          
//           // 캐시에 없으면 네트워크에서 가져와 캐시에 저장
//           return fetch(event.request).then(
//             (response) => {
//               // 유효한 응답인지 확인
//               if (!response || response.status !== 200 || response.type !== 'basic') {
//                 return response;
//               }
              
//               // 응답을 복제하여 캐시에 저장 (스트림은 한 번만 사용 가능)
//               const responseToCache = response.clone();
//               caches.open(CACHE_NAME)
//                 .then((cache) => {
//                   cache.put(event.request, responseToCache);
//                   console.log('Service Worker: 모델 파일 캐싱 완료', url.href);
//                 });
              
//               return response;
//             }
//           );
//         })
//     );
//   }
// });