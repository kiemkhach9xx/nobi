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

### Deploy lên Vercel

Dự án đã được cấu hình sẵn để deploy lên Vercel với file `vercel.json`.

#### Cách 1: Deploy qua Git (Khuyến nghị)

1. Push code lên GitHub/GitLab/Bitbucket
2. Đăng nhập vào [Vercel](https://vercel.com/)
3. Chọn "Add New Project"
4. Import repository của bạn
5. Vercel sẽ tự động detect cấu hình từ `vercel.json`:
   - Build command: `npm run build`
   - Output directory: `dist`
6. Thêm Environment Variables (nếu cần):
   - `VITE_API_BASE_URL` = `https://ccs.whiteneuron.com/api`
7. Click "Deploy"

#### Cách 2: Deploy bằng Vercel CLI

1. Cài đặt Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Đăng nhập:
   ```bash
   vercel login
   ```
3. Deploy:
   ```bash
   vercel
   ```
4. Deploy production:
   ```bash
   vercel --prod
   ```

#### Lưu ý về CORS và Headers trên Production

- Trên production, Vite proxy không hoạt động
- Dự án đã được cấu hình **Vercel Serverless Function** (`api/proxy.ts`) để:
  - Proxy tất cả API requests
  - Set các headers mà browser không cho phép (User-Agent, Referer, sec-ch-ua, etc.)
  - Xử lý CORS tự động
- API base URL tự động chuyển sang `/api/proxy` trên production
- **Không cần** cấu hình thêm Environment Variables cho API base URL
- Nếu muốn dùng direct API URL, set `VITE_API_BASE_URL=https://ccs.whiteneuron.com/api` trong Vercel Environment Variables

#### Xem & debug API proxy (Vercel Function)

**1. Xem logs của Function**

- Vào [Vercel Dashboard](https://vercel.com/dashboard) → chọn project
- Tab **Functions** → chọn **api/proxy**
- Tab **Logs**: xem mỗi request, response, và `console.log` từ function

**2. Test trực tiếp qua URL**

Mở trình duyệt hoặc dùng `curl`:

```bash
# Root chapters
curl "https://<your-site>.vercel.app/api/proxy/ICD10/root?lang=vi"

# Chapter detail (thay <your-site> bằng domain Vercel của bạn)
curl "https://<your-site>.vercel.app/api/proxy/ICD10/data/chapter?id=A00-B99&lang=vi"
```

**3. Debug trong DevTools**

- Mở app trên Vercel → F12 → **Network** → filter **Fetch/XHR**
- Gọi API (vd. load trang chủ, expand chapter) → chọn request `root?lang=vi` hoặc `chapter?...`
- Xem **Headers** (Request URL, status), **Preview** / **Response** (nội dung trả về)

**4. Vị trí code proxy**

- File: `api/proxy.ts`
- Vercel tự động detect functions trong thư mục `api/`

### Deploy lên các platform khác

Files trong thư mục `dist/` có thể được deploy lên:
- **Netlify**: Cần tạo `netlify.toml` và chuyển function sang `netlify/functions/`
- **GitHub Pages**: Cần cấu hình base path trong `vite.config.ts`
- **AWS S3 + CloudFront**: Upload `dist/` lên S3 bucket
- **Firebase Hosting**: Sử dụng `firebase deploy`

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
