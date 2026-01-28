// API Configuration
// Dev: Vite proxy /api -> ccs.whiteneuron.com (headers giống ảnh)
// Prod: Direct call to https://ccs.whiteneuron.com/api (GitHub Pages)
export const API_CONFIG = {
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV 
      ? '/api' // Development: Vite proxy
      : 'https://ccs.whiteneuron.com/api' // Production: Direct API call (GitHub Pages)
    ),
  timeout: 10000,
};

// API Endpoints
export const API_ENDPOINTS = {
  root: '/ICD10/root', // Get all root ICD-10 codes
  search: '/ICD10/search', // Search ICD codes
  getCode: '/ICD10/code', // Get code by code value
  getCodeById: (id: string) => `/ICD10/code/${id}`, // Get code by ID
  getChapterData: '/ICD10/data/chapter', // Get chapter data by ID
  getSectionData: '/ICD10/data/section', // Get section data by ID
  getTypeData: '/ICD10/data/type', // Get type data by ID
  getDiseaseData: '/ICD10/data/disease', // Get disease data by ID
};
