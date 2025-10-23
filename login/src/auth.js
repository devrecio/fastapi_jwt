import { ref } from 'vue';
import axios from 'axios';

export const accessToken = ref('');
export const refreshToken = ref('');

axios.defaults.baseURL = 'http://127.0.0.1:8000';

// Interceptor de request
axios.interceptors.request.use(config => {
  if (accessToken.value) {
    config.headers['Authorization'] = `Bearer ${accessToken.value}`;
  }
  return config;
});

// Interceptor de response
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && refreshToken.value) {
      try {
        const res = await axios.post('/auth/refresh', { token: refreshToken.value });
        accessToken.value = res.data.access_token;
        error.config.headers['Authorization'] = `Bearer ${accessToken.value}`;
        return axios(error.config);
      } catch {
        logout();
      }
    }
    return Promise.reject(error);
  }
);

export async function login(email, password) {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const res = await axios.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  accessToken.value = res.data.access_token;
  refreshToken.value = res.data.refresh_token || ''; // opcional
}

export async function register(email, password) {
  const res = await axios.post('/auth/register', { email, password });
  return res.data;
}

export async function getProfile() {
  const res = await axios.get('/auth/me');
  return res.data;
}

export function logout() {
  accessToken.value = '';
  refreshToken.value = '';
}
