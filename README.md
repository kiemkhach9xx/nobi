# Hệ thống Quản lý Mã hóa Lâm sàng Khám chữa bệnh

## Clinical Coding Management System

Hệ thống quản lý mã hóa lâm sàng ICD-10 cho khám chữa bệnh tại Việt Nam.

## Công nghệ sử dụng

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios (API client)

## Tính năng

- ✅ Tra cứu mã ICD-10 theo cấu trúc cây (chapters, sections)
- ✅ Tìm kiếm mã ICD-10
- ✅ Expand/collapse inline để xem chi tiết
- ✅ Theme selector (Classic/Pink)
- ✅ Animation trái tim cho theme hồng
- ✅ Responsive design

## Cài đặt

```bash
npm install
```

## Cấu hình API

1. Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

2. Cấu hình API base URL trong file `.env`:
```env
VITE_API_BASE_URL=https://ccs.whiteneuron.com/api
```

## Chạy dự án

```bash
npm run dev
```

**Lưu ý về CORS:**
- Dự án đã được cấu hình Vite proxy để xử lý CORS trong môi trường development
- Proxy tự động forward requests từ `/api` đến `https://ccs.whiteneuron.com/api`
- Nếu gặp lỗi CORS, đảm bảo dev server đã được khởi động lại sau khi cấu hình proxy

## Kiểm tra API Endpoints

Sau khi chạy dự án, truy cập `/api-test` để:
- Khám phá các API endpoints có sẵn
- Test các endpoint API
- Xem cấu hình API hiện tại

## Build

```bash
npm run build
```

Build output sẽ được tạo trong thư mục `dist/`.

## Deploy

Sau khi build, files trong thư mục `dist/` có thể được deploy lên bất kỳ static hosting nào:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- etc.

## Cấu trúc API

Dự án đã được cấu hình để kết nối với API tại `https://ccs.whiteneuron.com/api`. Các endpoint:

- `GET /ICD10/root?lang=vi` - Lấy danh sách root chapters
- `GET /ICD10/data/chapter?id={id}&lang=vi` - Lấy chi tiết chapter
- `GET /ICD10/search` - Tìm kiếm mã ICD-10
- `GET /ICD10/code` - Lấy thông tin mã theo code
- `GET /ICD10/code/:id` - Lấy thông tin mã theo ID

## Theme

Dự án hỗ trợ 2 themes:
- **Classic**: Màu xanh dương (mặc định)
- **Pink**: Màu hồng với animation trái tim

Chọn theme từ icon Palette trong header.
