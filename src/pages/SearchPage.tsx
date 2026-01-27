import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, FileText } from 'lucide-react';

interface ICDCode {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
}

// Mock data - trong thực tế sẽ lấy từ API
const mockCodes: ICDCode[] = [
  {
    id: '1',
    code: 'A00',
    name: 'Bệnh tả',
    description: 'Bệnh tả do Vibrio cholerae',
    category: 'Bệnh nhiễm trùng và ký sinh trùng',
  },
  {
    id: '2',
    code: 'A01',
    name: 'Sốt thương hàn và sốt phó thương hàn',
    description: 'Nhiễm trùng do Salmonella',
    category: 'Bệnh nhiễm trùng và ký sinh trùng',
  },
  {
    id: '3',
    code: 'I10',
    name: 'Tăng huyết áp nguyên phát',
    description: 'Tăng huyết áp không rõ nguyên nhân',
    category: 'Bệnh hệ tuần hoàn',
  },
];

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<ICDCode[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const filtered = mockCodes.filter(
          (code) =>
            code.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            code.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            code.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setResults(filtered);
        setIsLoading(false);
      }, 500);
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Tìm kiếm mã ICD-10</h1>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nhập mã ICD-10, tên bệnh hoặc mô tả..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
            />
          </div>
        </form>

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Đang tìm kiếm...</p>
          </div>
        )}

        {!isLoading && searchQuery && (
          <div>
            <p className="text-gray-600 mb-4">
              Tìm thấy {results.length} kết quả cho "{searchQuery}"
            </p>

            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((code) => (
                  <Link
                    key={code.id}
                    to={`/code/${code.id}`}
                    className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded font-mono font-bold">
                            {code.code}
                          </span>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {code.name}
                          </h3>
                        </div>
                        <p className="text-gray-600 mb-2">{code.description}</p>
                        <span className="inline-block text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {code.category}
                        </span>
                      </div>
                      <FileText className="w-5 h-5 text-gray-400 ml-4" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <p className="text-gray-600 text-lg">
                  Không tìm thấy kết quả nào cho "{searchQuery}"
                </p>
                <p className="text-gray-500 mt-2">
                  Vui lòng thử lại với từ khóa khác
                </p>
              </div>
            )}
          </div>
        )}

        {!searchQuery && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              Nhập từ khóa để bắt đầu tìm kiếm
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
