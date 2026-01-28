import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getChapterData } from '@/services/icdService';

export default function CodeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadChapterData(id);
    }
  }, [id]);

  const loadChapterData = async (chapterId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getChapterData(chapterId, 'vi');
      if (response.status === 'success' && response.data) {
        setData(response.data);
      } else {
        setError('Không thể tải dữ liệu chapter');
      }
    } catch (err: unknown) {
      console.error('Error loading chapter data:', err);
      setError('Lỗi khi tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Lỗi</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => id && loadChapterData(id)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-500">Không tìm thấy dữ liệu.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {data.data.name}
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div
          className="chapter-content"
          dangerouslySetInnerHTML={{ __html: data.data.html || '' }}
        />
      </div>
    </div>
  );
}
