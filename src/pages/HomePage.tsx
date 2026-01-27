import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Database, Loader2, Folder, ChevronDown, ChevronUp } from 'lucide-react';
import { getRootICDCodes, getChapterData, ICDChapterItem } from '@/services/icdService';

interface ExpandedChapter {
  id: string;
  data: any;
  isLoading: boolean;
  error: string | null;
}

export default function HomePage() {
  const [chapters, setChapters] = useState<ICDChapterItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<Record<string, ExpandedChapter>>({});

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getRootICDCodes('vi');
        setChapters(data);
      } catch (err: any) {
        console.error('Error loading ICD codes:', err);
        setError(err.message || 'Không thể tải danh sách mã ICD-10');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCodes();
  }, []);

  const handleChapterClick = async (chapter: ICDChapterItem) => {
    const chapterId = chapter.id;
    
    // Toggle expand/collapse
    if (expandedChapters[chapterId]) {
      // Collapse: remove from expanded
      const newExpanded = { ...expandedChapters };
      delete newExpanded[chapterId];
      setExpandedChapters(newExpanded);
      return;
    }

    // Expand: fetch data if not already loaded
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: {
        id: chapterId,
        data: null,
        isLoading: true,
        error: null,
      },
    }));

    try {
      const data = await getChapterData(chapterId, 'vi');
      setExpandedChapters((prev) => ({
        ...prev,
        [chapterId]: {
          id: chapterId,
          data,
          isLoading: false,
          error: null,
        },
      }));
    } catch (err: any) {
      console.error('Error loading chapter data:', err);
      setExpandedChapters((prev) => ({
        ...prev,
        [chapterId]: {
          id: chapterId,
          data: null,
          isLoading: false,
          error: err.message || 'Không thể tải dữ liệu chapter',
        },
      }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Hệ thống Quản lý Mã hóa Lâm sàng
        </h1>
        <p className="text-xl text-gray-600 mb-2">Clinical Coding Management System</p>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Tra cứu và quản lý mã ICD-10 cho khám chữa bệnh tại Việt Nam
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="max-w-2xl mx-auto text-center py-12">
          <Loader2 className="inline-block animate-spin w-12 h-12 text-primary-600 mb-4" />
          <p className="text-gray-600 text-lg">
            Đang tải danh sách mã ICD-10...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800 font-semibold mb-2">Lỗi khi tải dữ liệu</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* ICD Chapters List */}
      {!isLoading && !error && chapters.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Danh mục ICD-10 ({chapters.length} chương)
            </h2>
            <Link
              to="/search"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              <Search className="w-4 h-4 mr-2" />
              Tìm kiếm
            </Link>
          </div>

          <div className="space-y-4">
            {chapters.map((chapter) => {
              const isExpanded = !!expandedChapters[chapter.id];
              const expandedData = expandedChapters[chapter.id];
              const chapterData = expandedData?.data?.data;

              return (
                <div
                  key={chapter.id}
                  className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all"
                >
                  {/* Chapter Header - Clickable */}
                  <button
                    onClick={() => handleChapterClick(chapter)}
                    className="w-full p-6 text-left hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="bg-primary-100 text-primary-700 rounded-lg p-3 flex-shrink-0">
                          <Folder className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="bg-primary-600 text-white px-2 py-1 rounded text-xs font-bold">
                              {chapter.data.code}
                            </span>
                            <span className="text-xs text-gray-500 font-mono">
                              {chapter.id}
                            </span>
                          </div>
                          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                            {chapter.data.name}
                          </h3>
                          {!chapter.is_leaf && (
                            <span className="inline-block mt-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              Có {chapter.is_leaf ? 'mã con' : 'chương con'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50">
                      {expandedData?.isLoading && (
                        <div className="p-8 text-center">
                          <Loader2 className="inline-block animate-spin w-8 h-8 text-primary-600 mb-4" />
                          <p className="text-gray-600">Đang tải dữ liệu...</p>
                        </div>
                      )}

                      {expandedData?.error && (
                        <div className="p-6">
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800 text-sm">{expandedData.error}</p>
                          </div>
                        </div>
                      )}

                      {!expandedData?.isLoading && !expandedData?.error && expandedData?.data && (
                        <div className="p-6">
                          {/* Chapter Info */}
                          {expandedData.data.data && (
                            <div className="mb-6 pb-6 border-b border-gray-200">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="bg-primary-100 text-primary-700 rounded-lg p-3">
                                  <Folder className="w-6 h-6" />
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2 mb-2">
                                    <span className="bg-primary-600 text-white px-3 py-1 rounded font-mono font-bold text-sm">
                                      {expandedData.data.data.code}
                                    </span>
                                    <span className="text-sm text-gray-500 font-mono">
                                      {expandedData.data.data.id}
                                    </span>
                                  </div>
                                  <h3 className="text-xl font-bold text-gray-900">
                                    {expandedData.data.data.name}
                                  </h3>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* HTML Content */}
                          {(expandedData.data.data?.html || expandedData.data.html) && (
                            <div className="chapter-content-wrapper">
                              <div
                                className="chapter-content prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{
                                  __html: expandedData.data.data?.html || expandedData.data.html,
                                }}
                                onClick={(e) => {
                                  // Handle clicks on links in HTML content
                                  const target = e.target as HTMLElement;
                                  const link = target.closest('a');
                                  if (link) {
                                    e.preventDefault();
                                    const href = link.getAttribute('href');
                                    if (href) {
                                      // Extract section ID from href (e.g., "section/A00-A09" -> "A00-A09")
                                      const match = href.match(/section\/([A-Z0-9-]+)/);
                                      if (match && match[1]) {
                                        const sectionId = match[1];
                                        // Create a mock chapter item to expand
                                        const mockChapter: ICDChapterItem = {
                                          model: 'section',
                                          id: sectionId,
                                          is_leaf: false,
                                          data: {
                                            code: sectionId,
                                            id: sectionId,
                                            name: link.textContent || sectionId,
                                            html: null,
                                          },
                                        };
                                        handleChapterClick(mockChapter);
                                      }
                                    }
                                  }
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {!expandedData?.isLoading && !expandedData?.error && !expandedData?.data && (
                        <div className="p-6 text-center text-gray-500">
                          <p>Không có dữ liệu</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && chapters.length === 0 && (
        <div className="max-w-2xl mx-auto text-center py-12">
          <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Không có dữ liệu mã ICD-10</p>
        </div>
      )}

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Tìm kiếm nhanh</h3>
          <p className="text-gray-600">
            Tìm kiếm mã ICD-10 theo tên bệnh, mã số hoặc mô tả
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Tra cứu chi tiết</h3>
          <p className="text-gray-600">
            Xem thông tin chi tiết về từng mã ICD-10 và phân loại
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Database className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Cơ sở dữ liệu đầy đủ</h3>
          <p className="text-gray-600">
            Dữ liệu ICD-10 được cập nhật và chuẩn hóa theo quy định
          </p>
        </div>
      </div>
    </div>
  );
}
