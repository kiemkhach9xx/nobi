import apiClient from '@/services/api';
import { API_ENDPOINTS } from '@/config/api';

export interface EndpointTestResult {
  endpoint: string;
  success: boolean;
  status?: number;
  data?: any;
  error?: string;
}

export async function testAPIEndpoint(
  endpoint: string,
  params?: Record<string, string>
): Promise<EndpointTestResult> {
  try {
    const response = await apiClient.get(endpoint, { params });
    return {
      endpoint,
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    return {
      endpoint,
      success: false,
      error: error.message || 'Unknown error',
    };
  }
}

export async function discoverEndpoints(): Promise<EndpointTestResult[]> {
  const endpoints = [
    API_ENDPOINTS.root,
    API_ENDPOINTS.search,
    API_ENDPOINTS.getCode,
  ];

  const results = await Promise.all(
    endpoints.map((endpoint) => testAPIEndpoint(endpoint, { lang: 'vi' }))
  );

  return results;
}

export async function testSearch(query: string): Promise<EndpointTestResult> {
  return testAPIEndpoint(API_ENDPOINTS.search, { q: query, lang: 'vi' });
}

export async function testAllEndpoints(): Promise<EndpointTestResult[]> {
  const results: EndpointTestResult[] = [];

  // Test root
  results.push(await testAPIEndpoint(API_ENDPOINTS.root, { lang: 'vi' }));

  // Test search
  results.push(await testAPIEndpoint(API_ENDPOINTS.search, { q: 'test', lang: 'vi' }));

  // Test chapter data
  results.push(
    await testAPIEndpoint(API_ENDPOINTS.getChapterData, {
      id: 'A00-B99',
      lang: 'vi',
    })
  );

  return results;
}
