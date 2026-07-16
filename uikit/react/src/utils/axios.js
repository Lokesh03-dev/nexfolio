import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true
});

// Add a request interceptor to attach the JWT token
if (typeof window !== 'undefined') {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('nexfolio_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

export default axiosInstance;
