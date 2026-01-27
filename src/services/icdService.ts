import apiClient from './api';
import { API_ENDPOINTS } from '@/config/api';

export interface ICDCode {
  id?: string;
  code: string;
  name: string;
  description?: string;
  category?: string;
  subcategory?: string;
  notes?: string;
  lang?: string;
  html?: string | null;
  [key: string]: any; // Allow additional properties from API
}

export interface ICDChapterItem {
  model: string;
  id: string;
  is_leaf: boolean;
  data: {
    code: string;
    id: string;
    name: string;
    html: string | null;
  };
}

export interface RootResponse {
  status: string;
  data: ICDChapterItem[];
  html?: string;
}

export interface ChapterDataResponse {
  status: string;
  data: {
    model: string;
    id: string;
    is_leaf: boolean;
    data: {
      code: string;
      id: string;
      name: string;
      html: string | null;
    };
    html?: string;
  };
}

export interface SearchResponse {
  data: ICDCode[];
  total: number;
  page?: number;
  limit?: number;
}

export interface SearchParams {
  q?: string;
  code?: string;
  category?: string;
  page?: number;
  limit?: number;
  lang?: string;
}

// Get all root ICD-10 codes
export const getRootICDCodes = async (lang: string = 'vi'): Promise<ICDChapterItem[]> => {
  try {
    const response = await apiClient.get<RootResponse>(API_ENDPOINTS.root, {
      params: { lang },
    });
    // Response structure: { status: "success", data: [...], html: "..." }
    // axios wraps it, so response.data is the RootResponse object
    if (response.data?.status === 'success' && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      // Fallback: if response.data is directly an array
      return response.data;
    } else {
      console.warn('Unexpected response structure:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching root ICD codes:', error);
    throw error;
  }
};

// Search ICD codes
export const searchICDCodes = async (
  params: SearchParams
): Promise<SearchResponse> => {
  try {
    const response = await apiClient.get<SearchResponse>(
      API_ENDPOINTS.search,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error('Error searching ICD codes:', error);
    throw error;
  }
};

// Get ICD code by ID
export const getICDCodeById = async (id: string): Promise<ICDCode> => {
  try {
    const response = await apiClient.get<ICDCode>(
      API_ENDPOINTS.getCodeById(id)
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching ICD code:', error);
    throw error;
  }
};

// Get ICD code by code (e.g., "A00")
export const getICDCodeByCode = async (code: string): Promise<ICDCode> => {
  try {
    const response = await apiClient.get<ICDCode>(API_ENDPOINTS.getCode, {
      params: { code },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching ICD code by code:', error);
    throw error;
  }
};

// Get chapter data by ID
export const getChapterData = async (
  id: string,
  lang: string = 'vi'
): Promise<ChapterDataResponse> => {
  try {
    const response = await apiClient.get<ChapterDataResponse>(API_ENDPOINTS.getChapterData, {
      params: { id, lang },
      headers: {
        'X-Client-IP': '42.114.35.89', // You may want to get this dynamically
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching chapter data:', error);
    throw error;
  }
};
