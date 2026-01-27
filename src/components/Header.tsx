import { Link } from 'react-router-dom';
import { Search, Menu, Heart, Palette } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, setTheme } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-primary-600 text-white px-4 py-2 rounded-lg font-bold text-xl">
              ICD
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-gray-900">
                Hệ thống Quản lý Mã hóa Lâm sàng
              </h1>
              <p className="text-sm text-gray-600">Clinical Coding Management System</p>
            </div>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8 hidden md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm mã ICD-10..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </form>

          <div className="flex items-center space-x-2">
            {/* Theme Selector */}
            <div className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors relative"
                title="Chọn theme"
              >
                <Palette className="w-5 h-5" />
                {theme === 'pink' && (
                  <Heart className="w-3 h-3 text-pink-500 absolute -top-1 -right-1 animate-pulse" />
                )}
              </button>

              {showThemeMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowThemeMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setTheme('classic');
                          setShowThemeMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${
                          theme === 'classic'
                            ? 'bg-primary-100 text-primary-700'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span>Classic</span>
                        {theme === 'classic' && (
                          <div className="w-4 h-4 rounded-full bg-primary-600"></div>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setTheme('pink');
                          setShowThemeMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between mt-1 ${
                          theme === 'pink'
                            ? 'bg-pink-100 text-pink-700'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span className="flex items-center">
                          Hồng
                          <Heart className="w-4 h-4 ml-2 text-pink-500 animate-pulse" />
                        </span>
                        {theme === 'pink' && (
                          <div className="w-4 h-4 rounded-full bg-pink-500"></div>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button className="md:hidden p-2 text-gray-600 hover:text-gray-900">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="mt-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm mã ICD-10..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </form>
      </div>
    </header>
  );
}
