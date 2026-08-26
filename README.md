 <img src="blog.png" alt="Halo Chat Platform Hero Banner" width="100%" />

# Insight - Nền tảng Blog & Dashboard Thống Kê

Insight là một nền tảng blog cá nhân/kỹ thuật hiện đại với khu vực đọc bài công khai và khu vực quản trị mạnh mẽ. Dự án được xây dựng với React + TypeScript ở frontend và Node.js + Express ở backend, tích hợp MongoDB, Redis và Cloudinary.

## 📋 Mục lục

- [Tính năng chính](#-tính-năng-chính)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Cài đặt và chạy dự án](#-cài-đặt-và-chạy-dự-án)
- [Cấu hình môi trường](#-cấu-hình-môi-trường)
- [API Documentation](#-api-documentation)
- [Routes](#-routes)
- [RBAC & Bảo mật](#-rbac--bảo-mật)

## ✨ Tính năng chính

### Cho Visitor (Khách ẩn danh)

- ✅ Xem danh sách blog trên trang chủ
- ✅ Xem chi tiết blog theo slug
- ✅ Xem danh sách danh mục và blog theo danh mục
- ✅ Xem trang giới thiệu (About)
- ✅ Trang 404 cho các route không tồn tại

### Cho Reader (Người dùng đã đăng nhập)

- ✅ Đăng ký/Đăng nhập/Đăng xuất
- ✅ Refresh token tự động
- ✅ Like/Unlike blog
- ✅ Save/Unsave blog để đọc sau
- ✅ Xem và chỉnh sửa thông tin profile

### Cho Admin

- ✅ Dashboard thống kê tổng quan (số blog, user, tổng view, biểu đồ)
- ✅ Quản lý blog (CRUD) với editor Quill
- ✅ Upload và quản lý ảnh thumbnail qua Cloudinary
- ✅ Quản lý danh mục (CRUD)
- ✅ Quản lý user (CRUD, phân quyền)
- ✅ Xem top bài viết và thống kê view theo ngày

### Tính năng kỹ thuật

- ✅ Đếm view bài viết với Redis, chống spam view
- ✅ Đồng bộ view count từ Redis về MongoDB định kỳ
- ✅ RBAC (Role-Based Access Control) ở cả FE và BE
- ✅ Lazy loading routes để tối ưu bundle size
- ✅ Redux Toolkit cho state management
- ✅ Responsive design với Ant Design

## 🛠 Công nghệ sử dụng

### Frontend

- **React 18** + **TypeScript** - UI framework
- **Vite** - Build tool và dev server
- **React Router v7** - Routing
- **Redux Toolkit** - State management
- **Ant Design** - UI component library
- **React Quill** - Rich text editor
- **Axios** - HTTP client
- **@ant-design/charts** - Biểu đồ thống kê
- **react-snowfall** - Hiệu ứng tuyết rơi

### Backend

- **Node.js** + **Express** - Server framework
- **MongoDB** + **Mongoose** - Database
- **Redis** - Caching và đếm view
- **Cloudinary** - Quản lý ảnh
- **JWT** - Authentication
- **bcrypt** - Hash password
- **Multer** - Upload file
- **node-cron** - Đồng bộ dữ liệu định kỳ

## 📁 Cấu trúc dự án

```
insight/
├── frontend/                 # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/      # Các component tái sử dụng
│   │   ├── pages/           # Các trang (PublicPage, ProtectedPage)
│   │   ├── layouts/         # Layout components
│   │   ├── core/            # ProtectedRoute, RbacRouter
│   │   ├── redux/           # Redux store và slices
│   │   ├── services/        # API services
│   │   ├── hooks/           # Custom hooks
│   │   ├── config/          # Cấu hình
│   │   └── utils/           # Utilities
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                 # Backend Node.js + Express
│   ├── src/
│   │   ├── controllers/     # Controllers xử lý logic
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middlewares/     # Auth, multer, etc.
│   │   ├── config/          # DB, Redis, Cloudinary config
│   │   ├── jobs/            # Cron jobs (sync view counts)
│   │   └── utils/           # Utilities
│   ├── package.json
│   └── src/index.js
│
├── PRD.md                   # Product Requirements Document
└── README.md                # File này
```

## 🚀 Cài đặt và chạy dự án

### Yêu cầu hệ thống

- Node.js >= 18.x
- MongoDB
- Redis
- Tài khoản Cloudinary (hoặc cấu hình local)

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd insight
```

### Bước 2: Cài đặt dependencies

**Frontend:**

```bash
cd frontend
npm install
```

**Backend:**

```bash
cd backend
npm install
```

### Bước 3: Cấu hình môi trường

Tạo file `.env` trong thư mục `backend/` và `frontend/` (xem phần [Cấu hình môi trường](#-cấu-hình-môi-trường))

### Bước 4: Chạy dự án

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

Backend sẽ chạy tại `http://localhost:5001`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Frontend sẽ chạy tại `http://localhost:5173` (hoặc port khác nếu 5173 đã được sử dụng)

### Bước 5: Build production

**Frontend:**

```bash
cd frontend
npm run build
```

**Backend:**

```bash
cd backend
npm start
```

## ⚙️ Cấu hình môi trường

### Backend (.env)

Tạo file `backend/.env` với nội dung:

```env
# Server
PORT=5001
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/insight

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key-here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=14d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS
BASE_URL=http://localhost:5173
```

### Frontend (.env)

Tạo file `frontend/.env` với nội dung:

```env
VITE_API_URL=http://localhost:5001
```

## 📚 API Documentation

### Authentication

| Method | Endpoint            | Mô tả                | Auth |
| ------ | ------------------- | -------------------- | ---- |
| POST   | `/api/auth/signup`  | Đăng ký user mới     | ✅   |
| POST   | `/api/auth/signin`  | Đăng nhập            | ✅   |
| POST   | `/api/auth/refresh` | Refresh access token | ✅   |
| DELETE | `/api/auth/signout` | Đăng xuất            | ✅   |

### Blogs

| Method | Endpoint              | Mô tả              | Auth |
| ------ | --------------------- | ------------------ | ---- |
| GET    | `/api/blogs`          | Lấy danh sách blog | ✅   |
| GET    | `/api/blogs/:slug`    | Lấy chi tiết blog  | ✅   |
| GET    | `/api/blogs/stats`    | Thống kê blog      | ✅   |
| GET    | `/api/blogs/chart`    | Dữ liệu biểu đồ    | ✅   |
| POST   | `/api/blogs/:id/like` | Like blog          | ✅   |
| DELETE | `/api/blogs/:id/like` | Unlike blog        | ✅   |
| POST   | `/api/blogs/:id/save` | Save blog          | ✅   |
| DELETE | `/api/blogs/:id/save` | Unsave blog        | ✅   |
| POST   | `/api/blogs/blog`     | Tạo blog (admin)   | ✅   |
| PUT    | `/api/blogs/blog/:id` | Sửa blog (admin)   | ✅   |
| DELETE | `/api/blogs/del/:id`  | Xóa blog (admin)   | ✅   |

### Categories

| Method | Endpoint                       | Mô tả                    | Auth |
| ------ | ------------------------------ | ------------------------ | ---- |
| GET    | `/api/categories`              | Lấy danh sách categories | ✅   |
| GET    | `/api/categories/active`       | Lấy categories active    | ✅   |
| GET    | `/api/categories/:slug`        | Lấy chi tiết category    | ✅   |
| POST   | `/api/categories/category`     | Tạo category (admin)     | ✅   |
| PUT    | `/api/categories/category/:id` | Sửa category (admin)     | ✅   |
| DELETE | `/api/categories/del/:id`      | Xóa category (admin)     | ✅   |

### Users

| Method | Endpoint              | Mô tả                       | Auth |
| ------ | --------------------- | --------------------------- | ---- |
| GET    | `/api/users`          | Lấy danh sách users (admin) | ✅   |
| GET    | `/api/users/me`       | Thông tin user hiện tại     | ✅   |
| POST   | `/api/users/user`     | Tạo user (admin)            | ✅   |
| PUT    | `/api/users/user/:id` | Sửa user (admin)            | ✅   |
| DELETE | `/api/users/del/:id`  | Xóa user (admin)            | ✅   |

### Upload

| Method | Endpoint                    | Mô tả                     | Auth |
| ------ | --------------------------- | ------------------------- | ---- |
| POST   | `/api/upload`               | Upload ảnh lên Cloudinary | ✅   |
| DELETE | `/api/upload/del/:publicId` | Xóa ảnh từ Cloudinary     | ✅   |

## 🛣 Routes

### Frontend Routes

**Public Routes:**

- `/` - Trang chủ (danh sách blog)
- `/category` - Danh sách categories
- `/category/:slug` - Chi tiết category
- `/detail/:slug` - Chi tiết blog
- `/aboutme` - Trang giới thiệu
- `/auth` - Đăng nhập/Đăng ký
- `/access-denied` - Thông báo không có quyền
- `/*` - 404 Not Found

**Protected Routes:**

- `/profile` - Profile user (cần đăng nhập)

**Admin Routes:**

- `/admin/dashboard` - Dashboard admin
- `/admin/blogs` - Quản lý blog
- `/admin/categories` - Quản lý category
- `/admin/users` - Quản lý user

## 🔐 RBAC & Bảo mật

### Roles

- **customer**: Người dùng thường, có thể like/save blog, xem profile
- **admin**: Quản trị viên, có toàn quyền truy cập và quản lý hệ thống

### Permissions

- `VIEW_DASHBOARD` - Xem dashboard admin
- `MANAGE_BLOGS` - Quản lý blog
- `MANAGE_CATEGORIES` - Quản lý categories
- `MANAGE_USERS` - Quản lý users

### Bảo mật

- ✅ Mật khẩu được hash bằng bcrypt
- ✅ JWT với access token (15 phút) và refresh token (14 ngày)
- ✅ CORS được cấu hình chỉ cho phép origin từ `BASE_URL`
- ✅ Middleware `isAuthorized` bảo vệ các route nhạy cảm
- ✅ Middleware `optionalAuth` cho phép decode token nếu có (dùng cho đếm view)
- ✅ RBAC ở cả frontend và backend

## 📊 Tính năng đặc biệt

### Đếm view với Redis

- Mỗi khi user/visitor xem blog, hệ thống tạo key Redis với TTL (cooldown) để chống spam
- View count được lưu trong Redis và đồng bộ về MongoDB định kỳ
- Cron job `syncViewCounts` chạy định kỳ để đồng bộ dữ liệu

### Lazy Loading

- Tất cả routes được lazy load với `React.lazy()` và `Suspense`
- Giúp giảm bundle size ban đầu và cải thiện performance

### State Management

- Redux Toolkit với `authSlice` và `blogLikeSlice`
- Redux Persist để lưu trữ state trong localStorage

## 📝 Ghi chú

- Đảm bảo MongoDB và Redis đang chạy trước khi start backend
- Cấu hình Cloudinary để upload ảnh hoạt động
- Xem file `PRD.md` để biết thêm chi tiết về yêu cầu và kiến trúc hệ thống

## 📄 License

ISC

---

**Insight** - Nền tảng blog hiện đại với dashboard thống kê mạnh mẽ 🚀
