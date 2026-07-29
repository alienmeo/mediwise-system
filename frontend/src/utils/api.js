import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mediwise-system.onrender.com/api', // Dùng IP chuẩn 127.0.0.1 để Flask nhận đúng
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động can thiệp trước khi request đi để nạp mã Token bảo mật
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mediwise_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Xử lý tập trung nếu Token hết hạn hoặc không hợp lệ (Báo lỗi 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('mediwise_token');
      localStorage.removeItem('mediwise_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;