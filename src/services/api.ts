import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_CONFIG } from '@/config/api';

// Create axios instance
// Note: Browser doesn't allow setting "unsafe headers" like User-Agent, Referer, sec-ch-ua from client-side
// These headers are only set by the browser itself or via server-side proxy
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/plain, */*',
    // Removed unsafe headers that browser blocks:
    // - User-Agent (browser sets this automatically)
    // - Referer (browser sets this automatically)
    // - sec-ch-ua, sec-ch-ua-mobile, sec-ch-ua-platform (browser sets these automatically)
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Cache-bust + no-cache to avoid 304 / stale CDN
    if (config.params) {
      config.params._t = Date.now();
    } else {
      config.params = { _t: Date.now() };
    }
    config.headers = config.headers || {};
    config.headers['Cache-Control'] = 'no-cache';
    
    // Debug log
    console.log('API Request:', {
      baseURL: config.baseURL,
      url: config.url,
      fullURL: `${config.baseURL}${config.url}`,
    });
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request);
      console.error('Request URL:', error.config?.url);
      console.error('Request baseURL:', error.config?.baseURL);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
