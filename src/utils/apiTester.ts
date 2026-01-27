// Utility to test API endpoints
import axios from 'axios';
import { API_CONFIG } from '@/config/api';

export interface EndpointTestResult {
  url: string;
  status: number | null;
  success: boolean;
  error?: string;
  data?: any;
}

/**
 * Test if API endpoint is accessible with a specific base URL
 */
export const testAPIEndpoint = async (
  baseURL: string,
  endpoint: string
): Promise<EndpointTestResult> => {
  const fullUrl = `${baseURL}${endpoint}`;
  try {
    const response = await axios.get(fullUrl, {
      timeout: 5000,
      validateStatus: () => true, // Don't throw on any status
    });
    return {
      url: fullUrl,
      status: response.status,
      success: response.status >= 200 && response.status < 300,
      data: response.data,
    };
  } catch (error: any) {
    return {
      url: fullUrl,
      status: null,
      success: false,
      error: error.message || 'Unknown error',
    };
  }
};

/**
 * Discover API endpoints by testing common patterns from multiple base URLs
 */
export const discoverEndpoints = async (): Promise<EndpointTestResult[]> => {
  const baseURLs = [
    'https://icd.kcb.vn',
    'https://icd.kcb.vn/api',
    'https://icd.kcb.vn/icd-10',
    'https://icd.kcb.vn/icd-10/api',
    'https://icd.kcb.vn/api/v1',
  ];

  const commonEndpoints = [
    '/icd10/search',
    '/icd10/code',
    '/api/icd10/search',
    '/api/icd10/code',
    '/api/v1/icd10/search',
    '/api/v1/icd10/code',
    '/search',
    '/code',
    '/api/search',
    '/api/code',
    '/icd-10/search',
    '/icd-10/code',
  ];

  const results: EndpointTestResult[] = [];

  for (const baseURL of baseURLs) {
    for (const endpoint of commonEndpoints) {
      const result = await testAPIEndpoint(baseURL, endpoint);
      if (result.success) {
        results.push(result);
      }
      // Small delay to avoid overwhelming the server
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return results;
};

/**
 * Test search functionality with different query parameters
 */
export const testSearch = async (
  baseURL: string = API_CONFIG.baseURL,
  query: string = 'A00'
): Promise<any> => {
  const endpoints = [
    '/icd10/search',
    '/api/icd10/search',
    '/search',
    '/api/search',
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(`${baseURL}${endpoint}`, {
        params: { q: query, code: query, keyword: query },
        timeout: 5000,
        validateStatus: () => true,
      });

      if (response.status >= 200 && response.status < 300) {
        return {
          endpoint: `${baseURL}${endpoint}`,
          status: response.status,
          data: response.data,
        };
      }
    } catch (error: any) {
      continue;
    }
  }

  return null;
};

/**
 * Test all common API patterns from the website
 */
export const testAllEndpoints = async (): Promise<{
  working: EndpointTestResult[];
  failed: EndpointTestResult[];
}> => {
  const results = await discoverEndpoints();
  const working = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  return { working, failed };
};
