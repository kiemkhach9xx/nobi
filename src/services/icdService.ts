import apiClient from './api';
import { API_ENDPOINTS } from '@/config/api';

// API Response Interfaces
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

export interface RootChaptersResponse {
  status: string;
  data: ICDChapterItem[];
  html: string;
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
      html: string;
    };
  };
}

export interface SectionDataResponse {
  status: string;
  data: {
    model: string;
    id: string;
    is_leaf: boolean;
    data: {
      code: string;
      id: string;
      name: string;
      html: string;
    };
  };
}

export interface TypeDataResponse {
  status: string;
  data: {
    model: string;
    id: string;
    is_leaf: boolean;
    data: {
      code: string;
      id: string;
      name: string;
      html: string;
    };
  };
}

export interface DiseaseDataResponse {
  status: string;
  data: {
    model: string;
    id: string;
    is_leaf: boolean;
    data: {
      code: string;
      id: string;
      name: string;
      html: string;
    };
  };
}

// API Service Functions
export const getRootICDCodes = async (lang: string = 'vi'): Promise<RootChaptersResponse> => {
  const response = await apiClient.get<RootChaptersResponse>(API_ENDPOINTS.root, {
    params: { lang },
  });
  return response.data;
};

export const getChapterData = async (
  id: string,
  lang: string = 'vi'
): Promise<ChapterDataResponse> => {
  const response = await apiClient.get<ChapterDataResponse>(API_ENDPOINTS.getChapterData, {
    params: { id, lang },
  });
  return response.data;
};

export const getSectionData = async (
  id: string,
  lang: string = 'vi'
): Promise<SectionDataResponse> => {
  const response = await apiClient.get<SectionDataResponse>(API_ENDPOINTS.getSectionData, {
    params: { id, lang },
    headers: {
      'X-Client-IP': '42.114.35.89',
    },
  });
  return response.data;
};

export const getTypeData = async (
  id: string,
  lang: string = 'vi'
): Promise<TypeDataResponse> => {
  const response = await apiClient.get<TypeDataResponse>(API_ENDPOINTS.getTypeData, {
    params: { id, lang },
    headers: {
      'X-Client-IP': '42.114.35.89',
    },
  });
  return response.data;
};

export const getDiseaseData = async (
  id: string,
  lang: string = 'vi'
): Promise<DiseaseDataResponse> => {
  const response = await apiClient.get<DiseaseDataResponse>(API_ENDPOINTS.getDiseaseData, {
    params: { id, lang },
    headers: {
      'X-Client-IP': '42.114.35.89',
    },
  });
  return response.data;
};
