// API Configuration
// You can override this by setting VITE_API_BASE_URL in .env file
// In development, use proxy (/api) to avoid CORS issues
// In production, use full URL or configure your own proxy
export const API_CONFIG = {
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV ? '/api' : 'https://ccs.whiteneuron.com/api'),
  timeout: 10000,
};

// API Endpoints
export const API_ENDPOINTS = {
  root: '/ICD10/root', // Get all root ICD-10 codes
  search: '/ICD10/search', // Search ICD codes
  getCode: '/ICD10/code', // Get code by code value
  getCodeById: (id: string) => `/ICD10/code/${id}`, // Get code by ID
  getChapterData: '/ICD10/data/chapter', // Get chapter data by ID
};
