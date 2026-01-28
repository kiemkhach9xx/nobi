import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import apiClient from '@/services/api';
import { API_ENDPOINTS } from '@/config/api';

interface SearchResult {
  code: string;
  name: string;
  id: string;
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(API_ENDPOINTS.search, {
        params: { q: term, lang: 'vi' },
      });
      
      if (response.data.status === 'success' && response.data.data) {
        setResults(response.data.data);
      } else {
        setResults([]);
      }
    } catch (err: unknown) {
      console.error('Search error:', err);
      setError('Lỗi khi tìm kiếm. Vui lòng thử lại.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Tìm kiếm Mã ICD-10</h1>

      <form onSubmit={handleSearch} className="mb-8 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Nhập từ khóa tìm kiếm..."
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
        />
      </form>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div>
          {results.length > 0 ? (
            <div className="space-y-4">
              <p className="text-gray-600">Tìm thấy {results.length} kết quả:</p>
              {results.map((result) => (
                <div
                  key={result.id}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
                >
                  <h3 className="text-xl font-semibold text-primary-700 mb-2">
                    {result.code}
                  </h3>
                  <p className="text-gray-700">{result.name}</p>
                </div>
              ))}
            </div>
          ) : (
            query && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Không tìm thấy kết quả nào.</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
