import { useState } from 'react';
import {
  discoverEndpoints,
  testSearch,
  testAllEndpoints,
  EndpointTestResult,
} from '@/utils/apiTester';
import { API_CONFIG, API_ENDPOINTS } from '@/config/api';

export default function APITestPage() {
  const [results, setResults] = useState<EndpointTestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [testAllResults, setTestAllResults] = useState<{
    working: EndpointTestResult[];
    failed: EndpointTestResult[];
  } | null>(null);

  const handleDiscover = async () => {
    setIsLoading(true);
    setResults([]);
    setTestAllResults(null);
    const endpoints = await discoverEndpoints();
    setResults(endpoints);
    setIsLoading(false);
  };

  const handleTestAll = async () => {
    setIsLoading(true);
    setResults([]);
    setTestAllResults(null);
    const allResults = await testAllEndpoints();
    setTestAllResults(allResults);
    setIsLoading(false);
  };

  const handleTestSearch = async () => {
    setIsLoading(true);
    const result = await testSearch('https://icd.kcb.vn', 'A00');
    setSearchResult(result);
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">API Endpoint Tester</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Configuration</h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Base URL:</span> {API_CONFIG.baseURL}
            </p>
            <p>
              <span className="font-medium">Search Endpoint:</span>{' '}
              {API_ENDPOINTS.search}
            </p>
            <p>
              <span className="font-medium">Code Endpoint:</span>{' '}
              {API_ENDPOINTS.getCode}
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleTestAll}
              disabled={isLoading}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Đang kiểm tra...' : 'Kiểm tra Tất cả Endpoints'}
            </button>

            <button
              onClick={handleDiscover}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Đang kiểm tra...' : 'Khám phá Endpoints'}
            </button>

            <button
              onClick={handleTestSearch}
              disabled={isLoading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Đang test...' : 'Test Search API'}
            </button>
          </div>
        </div>

        {testAllResults && (
          <div className="space-y-6 mb-6">
            {testAllResults.working.length > 0 && (
              <div className="bg-green-50 border border-green-200 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-green-800">
                  ✅ Endpoints Hoạt động ({testAllResults.working.length})
                </h2>
                <div className="space-y-3">
                  {testAllResults.working.map((result, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded border border-green-300"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-sm font-mono text-green-700">
                          {result.url}
                        </code>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                          Status: {result.status}
                        </span>
                      </div>
                      {result.data && (
                        <details className="mt-2">
                          <summary className="text-sm text-gray-600 cursor-pointer">
                            Xem response data
                          </summary>
                          <pre className="mt-2 bg-gray-50 p-3 rounded text-xs overflow-auto max-h-40">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {testAllResults.failed.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                  ❌ Endpoints Không hoạt động ({testAllResults.failed.length})
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  (Đã ẩn để giảm clutter - chỉ hiển thị endpoints hoạt động)
                </p>
              </div>
            )}
          </div>
        )}

        {results.length > 0 && !testAllResults && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Working Endpoints</h2>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-3 rounded border border-gray-300"
                >
                  <div className="flex items-center justify-between">
                    <code className="text-sm font-mono">{result.url}</code>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      Status: {result.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {searchResult && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Search Test Result</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(searchResult, null, 2)}
            </pre>
          </div>
        )}

        {results.length === 0 && !testAllResults && !isLoading && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <p className="text-yellow-800">
              Chưa có kết quả. Nhấn "Kiểm tra Tất cả Endpoints" để bắt đầu kiểm tra
              các endpoint từ website https://icd.kcb.vn
            </p>
            <p className="text-yellow-700 text-sm mt-2">
              Tool này sẽ tự động test nhiều base URL và endpoint patterns phổ biến
              để tìm các API endpoints hoạt động.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
