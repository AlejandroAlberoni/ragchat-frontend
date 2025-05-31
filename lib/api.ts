import axios from 'axios';
const Cookies = require('js-cookie');

const api = axios.create({
    baseURL: process.env.API_URL,
    timeout: 10000,
})

api.interceptors.request.use(
    (config) => {
        const access_token = Cookies.get('access_token');
        if (access_token) {
            config.headers.Authorization = `Bearer ${access_token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        Cookies.remove('access_token');
        window.location.href = '/chat';
      }
    }
    return Promise.reject(error);
  },
);

export default api