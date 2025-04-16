import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (conf) => {
    console.log('Request: ', conf.method?.toUpperCase(), conf.url, conf.params);
    return conf;
  },
  (err) => {
    console.error('Request Error: ', err);
    return err;
  }
);

apiClient.interceptors.response.use(
  (resp) => {
    console.log('Response: ', resp.status, resp.config.url);
    return resp;
  },
  (err) => {
    console.log('Response Error: ', err);

    // 414 에러 감지 (여기에 추가)
    if (err.response && err.response.status === 414) {
      console.error('414 에러 발생: URL이 너무 깁니다');

      // 에러 페이지로 리다이렉트
      window.location.href = '/url-error?code=414&message=URL이_너무_깁니다';
    }

    return Promise.reject(err);
  }
);

export default apiClient;
