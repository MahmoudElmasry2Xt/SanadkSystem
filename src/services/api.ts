import axios from 'axios';

// Pre-configured Axios instance for future API integrations
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.sanadkpro.com/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Automatically attach Authorization token if exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Set active language for API headers
    const lang = localStorage.getItem('i18nextLng') || 'ar';
    if (config.headers) {
      config.headers['Accept-Language'] = lang;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if error is due to authentication failure (401)
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if appropriate
      localStorage.removeItem('auth_token');
      // window.location.href = '/login';
    }
    
    // Return structured error message
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default api;
