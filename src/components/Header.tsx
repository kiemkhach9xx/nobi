import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Palette, Heart } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/utils/cn';
import apiClient from '@/services/api';
import { API_ENDPOINTS } from '@/config/api';
import {
  getSectionData,
  getTypeData,
  getDiseaseData,
} from '@/services/icdService';

export default function Header() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHtml, setSearchHtml] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const autocompleteRef = useRef<HTMLDivElement | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Auto-complete search: call HTML search API and show HTML under input
  useEffect(() => {
    const term = searchQuery.trim();

    if (!term) {
      setSearchHtml(null);
      setSearchLoading(false);
      return;
    }

    const handler = setTimeout(async () => {
      try {
        setSearchLoading(true);
        // API theo mẫu: /ICD10/search/a22?lang=vi&vol1=0&vol3=1&html=true
        const response = await apiClient.get(
          `${API_ENDPOINTS.search}/${encodeURIComponent(term)}`,
          {
            params: {
              lang: 'vi',
              vol1: 0,
              vol3: 1,
              html: true,
            },
          }
        );

        const html: string | undefined =
          response.data?.data?.html || response.data?.html;

        setSearchHtml(html && html.trim() ? html : null);
      } catch (err) {
        console.error('Auto-complete search error:', err);
        setSearchHtml(null);
      } finally {
        setSearchLoading(false);
      }
    }, 400); // debounce nhẹ để tránh spam API

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Helpers for inline expansion inside autocomplete dropdown
  const clearInlineExpansions = (root: Element, selector: string) => {
    root.querySelectorAll(selector).forEach((el) => el.remove());
  };

  const ensureInlineContainerAfter = (
    afterEl: Element,
    containerSelector: string,
    attrs: Record<string, string>
  ) => {
    const existing = afterEl.nextElementSibling;
    if (existing && existing.matches(containerSelector)) {
      return existing as HTMLElement;
    }
    const container = document.createElement('div');
    Object.entries(attrs).forEach(([k, v]) => container.setAttribute(k, v));
    container.className = 'mt-2 p-3 bg-white rounded-lg border border-gray-200';
    afterEl.insertAdjacentElement('afterend', container);
    return container;
  };

  // Handle click on links inside autocomplete HTML:
  // mở section/type/disease tương ứng, children mở từ cha xuống
  const handleAutocompleteClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a');
    if (!link || !autocompleteRef.current) return;

    e.preventDefault();
    e.stopPropagation();

    const href = link.getAttribute('href') || '';

    // Helper to extract id from either "xxx/{id}" or "?id={id}"
    const extractId = (pattern: RegExp, source: string) => {
      const m = source.match(pattern);
      return m && m[1] ? m[1] : '';
    };

    // SECTION
    if (href.includes('section')) {
      const sectionId =
        extractId(/section\/([^/?#]+)/, href) || extractId(/[?&]id=([^&#]+)/, href);
      if (!sectionId) return;

      const anchor = link as HTMLAnchorElement;
      const li = anchor.closest('li') || anchor;

      // Toggle: nếu đã mở đúng section đó thì collapse
      const next = (li as Element).nextElementSibling as HTMLElement | null;
      if (
        next &&
        next.matches('[data-ac-inline-section="true"]') &&
        next.dataset.sectionId === sectionId
      ) {
        next.remove();
        return;
      }

      // Xóa các section đã mở khác trong dropdown
      clearInlineExpansions(autocompleteRef.current, '[data-ac-inline-section="true"]');

      const container = ensureInlineContainerAfter(
        li as Element,
        '[data-ac-inline-section="true"]',
        {
          'data-ac-inline-section': 'true',
          'data-section-id': sectionId,
        }
      );
      container.innerHTML =
        '<div class="flex flex-col justify-center items-center py-3 gap-2"><div class="inline-block animate-spin rounded-full h-5 w-5 border-2 border-primary-600 border-t-transparent"></div><p class="text-gray-600 text-sm">Đang tải dữ liệu...</p></div>';

      getSectionData(sectionId, 'vi')
        .then((response) => {
          if (response.status === 'success' && response.data?.data?.html) {
            container.innerHTML = `<div class="chapter-content">${response.data.data.html}</div>`;
          } else {
            container.innerHTML = '<div class="text-gray-500 text-sm px-2 py-1">Không có dữ liệu.</div>';
          }
        })
        .catch((err: unknown) => {
          console.error('Error loading section data (autocomplete):', err);
          container.innerHTML =
            '<div class="text-red-600 text-sm px-2 py-1">Lỗi khi tải dữ liệu section.</div>';
        });
      return;
    }

    // TYPE
    if (href.includes('type')) {
      const typeId =
        extractId(/type\/([^/?#]+)/, href) || extractId(/[?&]id=([^&#]+)/, href);
      if (!typeId) return;

      const anchor = link as HTMLAnchorElement;
      const li = anchor.closest('li') || anchor;

      // Tìm section container gần nhất trong dropdown
      const sectionContainer = (li as Element).closest(
        '[data-ac-inline-section="true"]'
      ) as HTMLElement | null;
      if (!sectionContainer) return;

      const next = (li as Element).nextElementSibling as HTMLElement | null;
      if (
        next &&
        next.matches('[data-ac-inline-type="true"]') &&
        next.dataset.typeId === typeId
      ) {
        next.remove();
        return;
      }

      // Xóa các type đã mở khác trong section đó
      clearInlineExpansions(sectionContainer, '[data-ac-inline-type="true"]');

      const container = ensureInlineContainerAfter(
        li as Element,
        '[data-ac-inline-type="true"]',
        {
          'data-ac-inline-type': 'true',
          'data-type-id': typeId,
        }
      );
      container.innerHTML =
        '<div class="flex flex-col justify-center items-center py-3 gap-2"><div class="inline-block animate-spin rounded-full h-5 w-5 border-2 border-primary-600 border-t-transparent"></div><p class="text-gray-600 text-sm">Đang tải dữ liệu...</p></div>';

      getTypeData(typeId, 'vi')
        .then((response) => {
          if (response.status === 'success' && response.data?.data?.html) {
            container.innerHTML = `<div class="chapter-content">${response.data.data.html}</div>`;
          } else {
            container.innerHTML = '<div class="text-gray-500 text-sm px-2 py-1">Không có dữ liệu.</div>';
          }
        })
        .catch((err: unknown) => {
          console.error('Error loading type data (autocomplete):', err);
          container.innerHTML =
            '<div class="text-red-600 text-sm px-2 py-1">Lỗi khi tải dữ liệu type.</div>';
        });
      return;
    }

    // DISEASE
    if (href.includes('disease')) {
      const diseaseId =
        extractId(/disease\/([^/?#]+)/, href) || extractId(/[?&]id=([^&#]+)/, href);
      if (!diseaseId) return;

      const anchor = link as HTMLAnchorElement;
      const li = anchor.closest('li') || anchor;

      // Có thể nằm dưới section hoặc type đã được load trong dropdown
      const sectionContainer = (li as Element).closest(
        '[data-ac-inline-section="true"]'
      ) as HTMLElement | null;
      const typeContainer = (li as Element).closest(
        '[data-ac-inline-type="true"]'
      ) as HTMLElement | null;
      const parentContainer = sectionContainer || typeContainer;
      if (!parentContainer) return;

      const next = (li as Element).nextElementSibling as HTMLElement | null;
      if (
        next &&
        next.matches('[data-ac-inline-disease="true"]') &&
        next.dataset.diseaseId === diseaseId
      ) {
        next.remove();
        return;
      }

      // Xóa disease đã mở khác trong cùng parent
      clearInlineExpansions(parentContainer, '[data-ac-inline-disease="true"]');

      const container = ensureInlineContainerAfter(
        li as Element,
        '[data-ac-inline-disease="true"]',
        {
          'data-ac-inline-disease': 'true',
          'data-disease-id': diseaseId,
        }
      );
      container.innerHTML =
        '<div class="flex flex-col justify-center items-center py-3 gap-2"><div class="inline-block animate-spin rounded-full h-5 w-5 border-2 border-primary-600 border-t-transparent"></div><p class="text-gray-600 text-sm">Đang tải dữ liệu...</p></div>';

      getDiseaseData(diseaseId, 'vi')
        .then((response) => {
          if (response.status === 'success' && response.data?.data?.html) {
            container.innerHTML = `<div class="chapter-content">${response.data.data.html}</div>`;
          } else {
            container.innerHTML = '<div class="text-gray-500 text-sm px-2 py-1">Không có dữ liệu.</div>';
          }
        })
        .catch((err: unknown) => {
          console.error('Error loading disease data (autocomplete):', err);
          container.innerHTML =
            '<div class="text-red-600 text-sm px-2 py-1">Lỗi khi tải dữ liệu disease.</div>';
        });
    }
  };

  return (
    <header className="border-b border-primary-100/60 bg-gradient-to-r from-primary-50/80 via-white to-primary-50/80 backdrop-blur">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <span className="text-3xl cat-logo drop-shadow-sm" role="img" aria-label="cat">
              🐱
            </span>
            <div>
              <h1 className="text-xl font-bold text-primary-700 group-hover:text-primary-800 transition-colors">
                ICD-10 cho Mâu Mâu
              </h1>
              <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">
                Hệ thống mã hóa lâm sàng dễ thương cho Mâu Mâu
              </p>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm mã ICD-10 cho bệnh, triệu chứng..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
              />
            </div>

            {/* Auto-complete HTML response */}
            {(searchLoading || searchHtml) && searchQuery.trim() && (
              <div
                ref={autocompleteRef}
                className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-96 overflow-auto z-30"
                onClick={handleAutocompleteClick}
              >
                {searchLoading && (
                  <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border-b border-gray-100">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-primary-600 border-t-transparent" />
                    <span>Đang tải dữ liệu...</span>
                  </div>
                )}

                {searchHtml && (
                  <div
                    className="chapter-content px-3 py-2 text-sm"
                    // API trả về HTML hoàn chỉnh (giống site gốc)
                    dangerouslySetInnerHTML={{ __html: searchHtml }}
                  />
                )}
              </div>
            )}
          </form>

          {/* Theme Selector */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/80 border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-colors"
              aria-label="Chọn theme"
            >
              <Palette className="w-5 h-5 text-primary-600" />
              <span className="text-sm text-gray-700 hidden sm:inline">
                Theme
              </span>
              {theme === 'pink' && (
                <Heart className="w-4 h-4 text-pink-500 animate-pulse" />
              )}
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                <button
                  onClick={() => {
                    setTheme('classic');
                    setShowThemeMenu(false);
                  }}
                  className={cn(
                    'w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors',
                    theme === 'classic' && 'bg-primary-50 text-primary-700 font-semibold'
                  )}
                >
                  Classic
                </button>
                <button
                  onClick={() => {
                    setTheme('pink');
                    setShowThemeMenu(false);
                  }}
                  className={cn(
                    'w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2',
                    theme === 'pink' && 'bg-pink-50 text-pink-700 font-semibold'
                  )}
                >
                  <span>Hồng</span>
                  {theme === 'pink' && (
                    <Heart className="w-4 h-4 text-pink-500 animate-pulse" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setTheme('tet2026');
                    setShowThemeMenu(false);
                  }}
                  className={cn(
                    'w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2',
                    theme === 'tet2026' && 'bg-red-50 text-red-700 font-semibold'
                  )}
                >
                  <span className="inline-flex items-center gap-1">
                    <span role="img" aria-label="li-xi">
                      🧧
                    </span>
                    <span>Tết 2026 (Năm Ngựa)</span>
                  </span>
                </button>
                <button
                  onClick={() => {
                    setTheme('conan');
                    setShowThemeMenu(false);
                  }}
                  className={cn(
                    'w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2',
                    theme === 'conan' && 'bg-slate-900 text-blue-300 font-semibold'
                  )}
                >
                  <span className="inline-flex items-center gap-1">
                    <Search className="w-4 h-4 text-blue-400" />
                    <span>Conan</span>
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
