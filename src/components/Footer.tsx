import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-xl" role="img" aria-label="cat">🐱</span>
              ICD-10 cho Mâu Mâu
            </h3>
            <p className="text-gray-400 text-sm">
              Hệ thống Quản lý Mã hóa Lâm sàng Khám chữa bệnh
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-400 hover:text-white">
                  Tìm kiếm
                </Link>
              </li>
              <li>
                <Link to="/api-test" className="text-gray-400 hover:text-white">
                  API Test
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Thông tin</h3>
            <p className="text-gray-400 text-sm">
              Dữ liệu từ{' '}
              <a
                href="https://ccs.whiteneuron.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:underline"
              >
                ccs.whiteneuron.com
              </a>
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>&copy; 2026 ICD-10 cho Mâu Mâu. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
