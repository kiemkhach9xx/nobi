import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Loader2, Folder } from 'lucide-react';
import { getChapterData } from '@/services/icdService';

export default function CodeDetailPage() {
  const { codeId } = useParams<{ codeId: string }>();
  const [chapterData, setChapterData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapterData = async () => {
      if (!codeId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await getChapterData(codeId, 'vi');
        setChapterData(data);
      } catch (err: any) {
        console.error('Error loading chapter data:', err);
        setError(err.message || 'Không thể tải dữ liệu chapter');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChapterData();
  }, [codeId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <Loader2 className="inline-block animate-spin w-12 h-12 text-primary-600 mb-4" />
          <p className="text-gray-600 text-lg">Đang tải dữ liệu chapter...</p>
        </div>
      </div>
    );
  }

  if (error || !chapterData) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
            <p className="text-red-800 font-semibold mb-2">Lỗi khi tải dữ liệu</p>
            <p className="text-red-600 text-sm">{error || 'Không tìm thấy dữ liệu chapter'}</p>
          </div>
          <Link
            to="/"
            className="inline-block text-primary-600 hover:text-primary-700"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  // Extract chapter info from response
  const chapterInfo = chapterData?.data?.[0]?.data || chapterData?.data || {};
  const children = chapterData?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại trang chủ
        </Link>

        {/* Chapter Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-primary-100 text-primary-700 rounded-lg p-3">
                  <Folder className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-primary-600 text-white px-3 py-1 rounded font-mono font-bold">
                      {chapterInfo.code || codeId}
                    </span>
                    <span className="text-sm text-gray-500 font-mono">
                      {chapterInfo.id || codeId}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {chapterInfo.name || 'Chapter Details'}
                  </h1>
                </div>
              </div>
            </div>
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        {/* Chapter Children/Sub-items */}
        {Array.isArray(children) && children.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Danh sách mã trong chapter ({children.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {children.map((item: any, index: number) => {
                const itemData = item.data || item;
                return (
                  <Link
                    key={item.id || itemData.id || index}
                    to={item.is_leaf ? `/code/${item.id}` : `/code/${item.id}`}
                    className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:border-primary-300 hover:bg-primary-50 transition-all"
                  >
                    <div className="flex items-start space-x-3">
                      {!item.is_leaf ? (
                        <Folder className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <FileText className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded text-xs font-mono font-bold">
                            {itemData.code || itemData.id}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {itemData.name || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* HTML Content if available */}
        {chapterData?.html && (
          <div className="bg-white rounded-lg shadow-lg p-8 mt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Thông tin bổ sung</h2>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: chapterData.html }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
