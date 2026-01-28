import { useState, useEffect } from 'react';
import {
  getRootICDCodes,
  getChapterData,
  getSectionData,
  getTypeData,
  getDiseaseData,
  type ICDChapterItem,
  type ChapterDataResponse,
} from '@/services/icdService';

export default function HomePage() {
  const [chapters, setChapters] = useState<ICDChapterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [chapterData, setChapterData] = useState<Record<string, ChapterDataResponse['data']>>({});

  useEffect(() => {
    loadRootChapters();
  }, []);

  const loadRootChapters = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getRootICDCodes('vi');
      if (response.status === 'success' && response.data) {
        setChapters(response.data);
      } else {
        setError('Không thể tải danh sách chapters');
      }
    } catch (err: unknown) {
      console.error('Error loading chapters:', err);
      setError('Lỗi khi tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleChapterClick = async (chapterId: string) => {
    // Toggle expansion
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
      // Load chapter data if not already loaded
      if (!chapterData[chapterId]) {
        try {
          const response = await getChapterData(chapterId, 'vi');
          if (response.status === 'success' && response.data) {
            setChapterData((prev) => ({
              ...prev,
              [chapterId]: response.data,
            }));
          }
        } catch (err: unknown) {
          console.error('Error loading chapter data:', err);
        }
      }
    }
    setExpandedChapters(newExpanded);
  };

  const clearInlineExpansions = (root: Element, selector: string) => {
    root.querySelectorAll(selector).forEach((el) => el.remove());
  };

  const ensureInlineContainerAfter = (afterEl: Element, containerSelector: string, attrs: Record<string, string>) => {
    const existing = afterEl.nextElementSibling;
    if (existing && existing.matches(containerSelector)) {
      return existing as HTMLElement;
    }
    const container = document.createElement('div');
    Object.entries(attrs).forEach(([k, v]) => container.setAttribute(k, v));
    container.className = 'mt-4 p-4 bg-white rounded-lg border border-gray-200';
    afterEl.insertAdjacentElement('afterend', container);
    return container;
  };

  // Handle clicks on links within dynamically loaded HTML
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (link && link.href) {
        const url = new URL(link.href);
        const path = url.pathname;

        // Section links in chapter HTML (href="section/A00-A09")
        if (path.includes('/section/')) {
          e.preventDefault();
          const sectionId = path.split('/section/')[1]?.split('/')[0];
          const chapterHost = target.closest('[data-chapter-id]') as HTMLElement | null;
          if (!sectionId || !chapterHost) return;

          // Place expansion right under the clicked section item (li if exists)
          const anchor = link as HTMLAnchorElement;
          const li = anchor.closest('li') || anchor;

          // Toggle: if already expanded for same section, collapse it
          const next = (li as Element).nextElementSibling as HTMLElement | null;
          if (next && next.matches('[data-inline-section="true"]') && next.dataset.sectionId === sectionId) {
            next.remove();
            return;
          }

          // Remove any other expanded sections inside this chapter
          clearInlineExpansions(chapterHost, '[data-inline-section="true"]');

          const container = ensureInlineContainerAfter(li as Element, '[data-inline-section="true"]', {
            'data-inline-section': 'true',
            'data-section-id': sectionId,
          });
          container.innerHTML =
            '<div class="flex flex-col justify-center items-center py-4 gap-2"><div class="inline-block animate-spin rounded-full h-6 w-6 border-4 border-primary-600 border-t-transparent"></div><p class="text-gray-600 text-sm">Đang tải dữ liệu...</p></div>';

          getSectionData(sectionId, 'vi')
            .then((response) => {
              if (response.status === 'success' && response.data?.data?.html) {
                container.innerHTML = `<div class="chapter-content">${response.data.data.html}</div>`;
              } else {
                container.innerHTML = '<div class="text-gray-500">Không có dữ liệu.</div>';
              }
            })
            .catch((err: unknown) => {
              console.error('Error loading section data:', err);
              container.innerHTML = '<div class="text-red-600">Lỗi khi tải dữ liệu section.</div>';
            });
        }

        // Type links in section/disease HTML (href="type/A00" hoặc "disease/A000")
        if (path.includes('/type/')) {
          e.preventDefault();
          const typeId = path.split('/type/')[1]?.split('/')[0];
          if (!typeId) return;

          // Find the nearest inline section container (so type expands under the correct section)
          const sectionContainer = target.closest('[data-inline-section="true"]') as HTMLElement | null;
          if (!sectionContainer) return;

          const anchor = link as HTMLAnchorElement;
          const li = anchor.closest('li') || anchor;

          // Toggle: if already expanded for same type, collapse it
          const next = (li as Element).nextElementSibling as HTMLElement | null;
          if (next && next.matches('[data-inline-type="true"]') && next.dataset.typeId === typeId) {
            next.remove();
            return;
          }

          // Remove any other expanded type within this section
          clearInlineExpansions(sectionContainer, '[data-inline-type="true"]');

          const container = ensureInlineContainerAfter(li as Element, '[data-inline-type="true"]', {
            'data-inline-type': 'true',
            'data-type-id': typeId,
          });
          container.innerHTML =
            '<div class="flex flex-col justify-center items-center py-4 gap-2"><div class="inline-block animate-spin rounded-full h-6 w-6 border-4 border-primary-600 border-t-transparent"></div><p class="text-gray-600 text-sm">Đang tải dữ liệu...</p></div>';

          getTypeData(typeId, 'vi')
            .then((response) => {
              if (response.status === 'success' && response.data?.data?.html) {
                container.innerHTML = `<div class="chapter-content">${response.data.data.html}</div>`;
              } else {
                container.innerHTML = '<div class="text-gray-500">Không có dữ liệu.</div>';
              }
            })
            .catch((err: unknown) => {
              console.error('Error loading type data:', err);
              container.innerHTML = '<div class="text-red-600">Lỗi khi tải dữ liệu type.</div>';
            });
        }

        // Disease links (href="disease/A000") – gọi API /ICD10/data/disease
        if (path.includes('/disease/')) {
          e.preventDefault();
          const diseaseId = path.split('/disease/')[1]?.split('/')[0];
          if (!diseaseId) return;

          // Find parent container (section hoặc type)
          const sectionContainer = target.closest('[data-inline-section="true"]') as HTMLElement | null;
          const typeContainer = target.closest('[data-inline-type="true"]') as HTMLElement | null;
          const parentContainer = sectionContainer || typeContainer;
          if (!parentContainer) return;

          const anchor = link as HTMLAnchorElement;
          const li = anchor.closest('li') || anchor;

          // Toggle: if already expanded for same disease, collapse it
          const next = (li as Element).nextElementSibling as HTMLElement | null;
          if (next && next.matches('[data-inline-disease="true"]') && next.dataset.diseaseId === diseaseId) {
            next.remove();
            return;
          }

          // Remove any other expanded disease within this parent container
          clearInlineExpansions(parentContainer, '[data-inline-disease="true"]');

          const container = ensureInlineContainerAfter(li as Element, '[data-inline-disease="true"]', {
            'data-inline-disease': 'true',
            'data-disease-id': diseaseId,
          });
          container.innerHTML =
            '<div class="flex flex-col justify-center items-center py-4 gap-2"><div class="inline-block animate-spin rounded-full h-6 w-6 border-4 border-primary-600 border-t-transparent"></div><p class="text-gray-600 text-sm">Đang tải dữ liệu...</p></div>';

          getDiseaseData(diseaseId, 'vi')
            .then((response) => {
              if (response.status === 'success' && response.data?.data?.html) {
                container.innerHTML = `<div class="chapter-content">${response.data.data.html}</div>`;
              } else {
                container.innerHTML = '<div class="text-gray-500">Không có dữ liệu.</div>';
              }
            })
            .catch((err: unknown) => {
              console.error('Error loading disease data:', err);
              container.innerHTML = '<div class="text-red-600">Lỗi khi tải dữ liệu disease.</div>';
            });
        }
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
          <p className="text-gray-600 text-lg">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Lỗi</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadRootChapters}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Danh sách Mã ICD-10
      </h1>

      <div className="space-y-4">
        {chapters.map((chapter) => {
          const isExpanded = expandedChapters.has(chapter.id);
          const data = chapterData[chapter.id];

          return (
            <div
              key={chapter.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all"
            >
              <button
                onClick={() => handleChapterClick(chapter.id)}
                className="w-full text-left p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {chapter.data.code} - {chapter.data.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">ID: {chapter.id}</p>
                  </div>
                  <div className="text-primary-600">
                    {isExpanded ? '▼' : '▶'}
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-200 bg-gray-50" data-chapter-id={chapter.id}>
                  {data ? (
                    <div className="p-6">
                      <div
                        className="chapter-content"
                        dangerouslySetInnerHTML={{ __html: data.data.html || '' }}
                      />
                    </div>
                  ) : (
                    <div className="p-6">
                      <div className="flex flex-col justify-center items-center py-8 gap-3">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
                        <p className="text-gray-600">Đang tải dữ liệu...</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
