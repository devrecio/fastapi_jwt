import { ref, computed } from 'vue';
import axios from 'axios';

// =====================
// 🔧 CONFIGURACIÓN
// =====================
const API_URL = 'http://127.0.0.1:8000/auth';

const user = ref(null);
const token = ref(localStorage.getItem('token') || '');
const loading = ref(false);
const error = ref('');

// =====================
// ⚙️ CONFIGURAR AXIOS
// =====================
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor para añadir el token en cada request
api.interceptors.request.use((config) => {
  if (token.value) {
    config.headers.Authorization = `Bearer ${token.value}`;
  }
  return config;
});

// Interceptor global para manejar errores (token inválido, expirado, etc.)
api.interceptors.response.use(
  (response) => response,
  (err) => {
    if (err.response?.status === 401) {
      console.warn('⚠️ Token inválido o expirado. Cerrando sesión...');
      logout(); // limpiar sesión automáticamente
    }
    return Promise.reject(err);
  }
);

// =====================
// 🔐 FUNCIONES PRINCIPALES
// =====================

// Login
async function login(email, password) {
  loading.value = true;
  error.value = '';
  try {
    const response = await api.post('/login', { email, password });
    token.value = response.data.access_token;
    localStorage.setItem('token', token.value);
    await fetchUser();
  } catch (err) {
    error.value = err.response?.data?.detail || 'Error al iniciar sesión';
    throw err;
  } finally {
    loading.value = false;
  }
}

// Registro (opcional)
async function register(email, password) {
  loading.value = true;
  error.value = '';
  try {
    await api.post('/register', { email, password });
  } catch (err) {
    error.value = err.response?.data?.detail || 'Error en el registro';
    throw err;
  } finally {
    loading.value = false;
  }
}

// Obtener usuario actual
async function fetchUser() {
  if (!token.value) return;
  loading.value = true;
  try {
    const response = await api.get('/me');
    user.value = response.data;
  } catch (err) {
    console.error('❌ Error al obtener usuario:', err.response?.data);
    user.value = null;
  } finally {
    loading.value = false;
  }
}

// Cerrar sesión
function logout() {
  token.value = '';
  user.value = null;
  localStorage.removeItem('token');
}

// =====================
// ✅ GETTERS COMPUTADOS
// =====================
const isAuthenticated = computed(() => !!token.value);
const isLoading = computed(() => loading.value);
const authError = computed(() => error.value);

// =====================
// 📤 EXPORTAR
// =====================
export function useAuth() {
  return {
    user,
    token,
    error: authError,
    loading: isLoading,
    isAuthenticated,
    login,
    register,
    fetchUser,
    logout,
  };
}

