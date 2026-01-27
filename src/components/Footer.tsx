export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Về hệ thống</h3>
            <p className="text-gray-400 text-sm">
              Hệ thống Quản lý Mã hóa Lâm sàng Khám chữa bệnh - ICD Vietnam
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Liên kết</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="/api-test" className="hover:text-white">
                  Kiểm tra API
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Hướng dẫn sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Tài liệu ICD-10
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Thông tin</h3>
            <p className="text-gray-400 text-sm">
              © 2026 ICD Vietnam. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
