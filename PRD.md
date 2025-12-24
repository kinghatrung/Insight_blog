## PRD: Insight – Nền tảng Blog & Dashboard Thống Kê

### 1. Tổng quan sản phẩm

- **Tên sản phẩm**: Insight
- **Loại sản phẩm**: Website blog cá nhân/kỹ thuật có khu vực đọc bài (public) và khu vực quản trị (admin).
- **Mục tiêu chính**:
  - Cung cấp trải nghiệm đọc blog mượt, đẹp, dễ dùng trên desktop/laptop.
  - Cho phép quản trị nội dung (blog, danh mục, user) và xem thống kê (view/like/save, biểu đồ, top bài viết).
  - Hỗ trợ theo dõi mức độ tương tác thông qua like/save và hệ thống đếm view tối ưu bằng Redis.
- **Công nghệ chính**:
  - **Frontend**: React + TypeScript + Vite, React Router, Redux Toolkit, Quill Editor.
  - **Backend**: Node.js + Express, MongoDB (Mongoose), Redis, Cloudinary, JWT.

### 2. Đối tượng người dùng (Personas)

- **Visitor (khách ẩn danh)**:
  - Vào website, xem danh sách bài viết, xem thông tin danh mục, xem trang About.
  - Không cần đăng nhập, không có hành vi cá nhân hoá (không like/save).
- **Reader (Customer – người dùng đã đăng nhập)**:
  - Có tài khoản, đăng nhập thành công.
  - Đọc bài viết, like/unlike, save/unsave blog.
  - Xem và chỉnh sửa thông tin hồ sơ (profile).
- **Admin**:
  - Quản lý toàn bộ hệ thống: blog, danh mục, user.
  - Xem dashboard thống kê, biểu đồ, top bài viết.
  - Thay đổi trạng thái, xoá nội dung, phân quyền user.

### 3. Phạm vi (Scope)

- **Trong phạm vi**:

  - Hệ thống blog:
    - Danh sách blog, chi tiết blog theo `slug`, phân trang, lọc theo danh mục (ở FE).
    - Đếm view bài viết, chống spam view bằng Redis.
    - Like / save blog theo user.
  - Hệ thống danh mục:
    - CRUD category, liên kết blog–category, hiển thị blog theo category.
  - Hệ thống người dùng & quyền:
    - Đăng ký, đăng nhập, refresh token, đăng xuất.
    - CRUD user (Admin), phân role `customer` / `admin`.
    - RBAC ở FE (role–permission) và bảo vệ route ở BE.
  - Dashboard & thống kê:
    - Thống kê tổng view, view theo ngày, top bài viết.
    - Thống kê blog active / processing / error (theo status).
  - Upload media:
    - Upload ảnh thumbnail blog lên Cloudinary, xoá ảnh không dùng.
  - Giao diện:
    - Khu vực public (Home, Category, Detail Blog, About, Auth, 404…).
    - Khu vực protected (Profile).
    - Khu vực admin (`/admin/dashboard`, `/admin/blogs`, `/admin/categories`, `/admin/users`).

- **Ngoài phạm vi** (không thực hiện ở phiên bản hiện tại):
  - Hệ thống bình luận (comment) và trả lời bình luận.
  - Tích hợp thanh toán, membership, paywall.
  - Email marketing, newsletter, thông báo đẩy.
  - Ứng dụng mobile native.
  - SEO nâng cao (AMP, structured data, sitemap auto).

### 4. User Stories chính

#### 4.1 Visitor

- **US-01**: Là visitor, tôi muốn xem danh sách các blog trên trang chủ để tìm bài viết phù hợp.
- **US-02**: Là visitor, tôi muốn bấm vào 1 blog và xem trang chi tiết bài để đọc nội dung đầy đủ.
- **US-03**: Là visitor, tôi muốn xem danh sách các danh mục và các bài thuộc mỗi danh mục để khám phá nội dung theo chủ đề.
- **US-04**: Là visitor, tôi muốn thấy trang 404 khi truy cập đường dẫn không tồn tại.

#### 4.2 Reader (Customer – đã đăng nhập)

- **US-05**: Là user, tôi có thể đăng ký tài khoản mới bằng cách truy cập `/auth` (trang dùng chung), chọn tab/section **Đăng ký** và nhập `username`, `password`, `email`, `firstName`, `lastName`.
- **US-06**: Là user, tôi có thể đăng nhập bằng cách truy cập `/auth` (trang dùng chung), chọn tab/section **Đăng nhập** và nhập `username` & `password` để truy cập các tính năng cá nhân (like/save, profile).
- **US-07**: Là user, tôi muốn hệ thống tự refresh access token khi hết hạn mà không cần đăng nhập lại nhiều lần.
- **US-08**: Là user, tôi có thể đăng xuất để đảm bảo tài khoản an toàn.
- **US-09**: Là user, tôi muốn like / bỏ like một bài viết.
- **US-10**: Là user, tôi muốn save / bỏ save một bài viết để lưu lại đọc sau.
- **US-11**: Là user, tôi muốn xem trang profile của mình và cập nhật các thông tin cơ bản (avatar, displayName… – tuỳ logic đã cài).

#### 4.3 Admin

- **US-12**: Là admin, tôi muốn xem một dashboard tổng quan (số blog, số user, tổng view, top blog, chart view theo ngày…).
- **US-13**: Là admin, tôi muốn xem, tạo, chỉnh sửa, xoá blog trong trang quản lý blog.
- **US-14**: Là admin, tôi muốn upload thumbnail cho blog qua giao diện form và lưu trên Cloudinary.
- **US-15**: Là admin, tôi muốn quản lý danh mục (tạo/sửa/xoá, thay đổi status).
- **US-16**: Là admin, tôi muốn quản lý user (xem danh sách, tạo/sửa/xoá, gán role).
- **US-17**: Là admin, tôi muốn chỉ admin mới truy cập được khu vực `/admin` và các API quản trị.

### 5. Luồng nghiệp vụ (Business Flows)

#### 5.1 Authentication

- **Điểm vào UI**: Trang `/auth` dùng chung cho cả đăng nhập và đăng ký. Người dùng chọn tab/section “Đăng nhập” hoặc “Đăng ký” trên cùng trang. Nút/đường dẫn “Đăng nhập/Đăng ký” ở header trỏ về `/auth`.
- **Signup**:
  - FE gửi `POST /api/auth/signup` với `username`, `password`, `email`, `firstName`, `lastName`.
  - BE kiểm tra trùng `username`/`email`, hash password bằng `bcrypt`, tạo user trong Mongo.
  - Trả về kết quả thành công/thất bại.
- **Signin**:
  - FE gửi `POST /api/auth/signin`.
  - BE kiểm tra user tồn tại, so sánh password (`bcrypt.compare`).
  - Nếu đúng: sinh `accessToken` (TTL ~ 15 phút), `refreshToken` (TTL ~ 14 ngày) bằng JWT, trả về user + token.
- **Refresh Token**:
  - FE gọi `POST /api/auth/refresh` với refresh token (vd. trong cookie).
  - BE verify refresh token, sinh mới access token, trả về cho FE.
- **Signout**:
  - FE gọi `DELETE /api/auth/signout` (có thể chỉ để xoá cookie/token phía server tuỳ implement).
  - FE xoá token ở client.

#### 5.2 Đọc blog & đếm view

- FE gọi `GET /api/blogs` để lấy danh sách blog cho trang Home / Category.
- Khi vào chi tiết:
  - FE gọi `GET /api/blogs/:slug` (đi qua middleware `optionalAuth`).
  - BE dùng service `blogViewService.incrementView(blogId, userId, ip)`:
    - Tạo key Redis `blog:{id}:view:{userId|ip}` với TTL (cooldown).
    - Nếu trong cooldown đã tồn tại → không tăng view, tránh spam.
    - Nếu chưa: tăng `blog:{id}:viewCount`, cập nhật thêm các key thống kê theo ngày, sau đó sync ngược `viewCount` về Mongo (async).

#### 5.3 Like / Save

- Yêu cầu user đã đăng nhập (middleware `isAuthorized`).
- Các API:
  - `GET /api/blogs/:id/like` – kiểm tra user hiện tại đã like chưa.
  - `POST /api/blogs/:id/like` – thêm like.
  - `DELETE /api/blogs/:id/like` – bỏ like.
  - Tương tự với `/save`.
- FE hiển thị trạng thái (đã like/save hay chưa) và cập nhật UI realtime khi user thao tác.

#### 5.4 Quản trị blog, category, user

- **Blog**:
  - `POST /api/blogs/blog` – tạo blog (admin).
  - `PUT /api/blogs/blog/:id` – chỉnh sửa blog.
  - `DELETE /api/blogs/del/:id` – xoá blog.
- **Category**:
  - `GET /api/categories` / `/active` / `/:slug`.
  - `POST /api/categories/category` – tạo.
  - `PUT /api/categories/category/:id` – sửa.
  - `DELETE /api/categories/del/:id` – xoá.
- **User**:
  - `GET /api/users` – list.
  - `GET /api/users/me` – thông tin cá nhân.
  - `POST /api/users/user`, `PUT /api/users/user/:id`, `DELETE /api/users/del/:id` – CRUD user (admin).

#### 5.5 Upload ảnh (Cloudinary)

- FE gửi `POST /api/upload` với `multipart/form-data` field `thumbnail`.
- Middleware `multer` nhận file, controller upload lên Cloudinary.
- Trả về `url` và `publicId` để FE lưu kèm dữ liệu blog.
- Xoá ảnh: `DELETE /api/upload/del/:publicId`.

### 6. Yêu cầu chức năng (Functional Requirements)

- **FR-01**: Website phải hiển thị danh sách blog với tiêu đề, mô tả ngắn, thumbnail, danh mục, số view (optional).
- **FR-02**: Click vào blog hiển thị trang chi tiết với full content (Quill HTML).
- **FR-03**: Hệ thống phải đếm view mỗi khi user/visitor mở trang chi tiết, có cơ chế cooldown để tránh tăng ảo.
- **FR-04**: Người dùng đăng nhập có thể like/save; trạng thái like/save phải được đồng bộ giữa FE và BE.
- **FR-05**: Admin có thể tạo/sửa/xoá blog và gắn blog với một category, một author (User).
- **FR-06**: Admin có thể tạo/sửa/xoá category; category có `status` (`error`, `active`, `processing`).
- **FR-07**: Admin có thể tạo/sửa/xoá user, gán role `customer`/`admin`.
- **FR-08**: Dashboard admin hiển thị các thống kê chính (tổng số blog, số user, tổng view, biểu đồ view, blog active…).
- **FR-09**: Hệ thống hỗ trợ upload và xoá ảnh blog với Cloudinary, lưu `avatarUrl / thumbnail` trong DB.
- **FR-10**: Trang profile hiển thị thông tin user hiện tại và cho phép tuỳ biến cơ bản (theo logic sẵn có).

### 7. Yêu cầu phi chức năng (Non-functional Requirements)

- **NFR-01 – Hiệu năng**:
  - Thời gian phản hồi API list/chi tiết blog p95 < 500ms trong điều kiện tải bình thường.
  - Dùng Redis để cache số view và giảm truy vấn Mongo.
- **NFR-02 – Bảo mật**:
  - Mật khẩu được hash bằng `bcrypt`.
  - JWT secret cấu hình qua biến môi trường.
  - CORS chỉ cho phép origin từ `BASE_URL` cấu hình.
  - Route nhạy cảm (user, upload, like/save, CRUD blog/category) phải đi qua middleware `isAuthorized`.
- **NFR-03 – Độ tin cậy**:
  - Cron job / job nền `syncViewCounts` chạy định kỳ đồng bộ view từ Redis về Mongo.
  - Khi server shutdown (`SIGTERM`, `SIGINT`), hệ thống gọi sync view lần cuối rồi mới tắt.
- **NFR-04 – Khả dụng**:
  - Mục tiêu uptime ≥ 99% theo tháng (tuỳ môi trường deploy).
- **NFR-05 – Khả mở rộng**:
  - Có thể scale BE theo chiều ngang, Redis/Mongo độc lập.
  - Tách file/media sang Cloudinary tránh phình server.
- **NFR-06 – UX/UI**:
  - Loading state rõ ràng (component `Loading`).
  - Lazy-load route với `React.lazy` + `Suspense`.
  - Hook `useSearchDebounce` phục vụ trải nghiệm tìm kiếm, tránh spam request.

### 8. Kiến trúc hệ thống

- **Frontend**:
  - SPA React + TS, bundler Vite.
  - Routing: `BrowserRouter` với React Router v7, phân chia:
    - **Public routes** (không cần auth, `DefaultLayout`):
      - `/` - Home (danh sách blog)
      - `/category` - Danh sách categories
      - `/category/:slug` - Chi tiết category
      - `/detail/:slug` - Chi tiết blog
      - `/aboutme` - Trang giới thiệu
      - `/auth` - Đăng nhập/Đăng ký (tabs)
      - `/access-denied` - Thông báo không có quyền
      - `/*` - 404 Not Found
    - **Protected routes** (cần auth, `ProtectedRoute`):
      - `/profile` - Profile user (trong `DefaultLayout`)
    - **Admin routes** (cần auth + admin role, `ProtectedRoute` + `RbacRoute` + `ProtectedLayout`):
      - `/admin/dashboard` - Dashboard admin
      - `/admin/blogs` - Quản lý blog
      - `/admin/categories` - Quản lý category
      - `/admin/users` - Quản lý user
  - State management: Redux Toolkit slices (`authSlice`, `blogLikeSlice`).
  - Giao tiếp BE: Axios wrapper (`authorizedAxios`) gắn token tự động, xử lý refresh token.
  - Lazy loading: Sử dụng `React.lazy()` và `Suspense` cho tất cả routes để tối ưu bundle size.
- **Backend**:
  - Express app (port mặc định: 5001):
    - **Public API routes** (không cần auth):
      - `/api/auth/*` - Authentication (signup, signin, signout, refresh)
      - `/api/blogs` (GET) - Lấy danh sách blog, stats, chart
      - `/api/blogs/:slug` (GET) - Chi tiết blog (với `optionalAuth`)
      - `/api/categories` (GET) - Lấy danh sách categories
    - **Protected API routes** (cần auth - `authMiddleware.isAuthorized`):
      - `/api/users/*` - User management (tất cả routes)
      - `/api/upload/*` - Upload media (tất cả routes)
      - `/api/blogs/:id/like` - Like/unlike blog
      - `/api/blogs/:id/save` - Save/unsave blog
      - `/api/blogs/blog` (POST/PUT/DELETE) - CRUD blog (admin)
      - `/api/categories/category` (POST/PUT/DELETE) - CRUD category (admin)
    - Middleware:
      - `authMiddleware.isAuthorized`: Kiểm tra JWT, gắn `req.user`
      - `authMiddleware.optionalAuth`: Decode token nếu có, không bắt buộc
      - `multer`: Upload file (single file với field name `thumbnail`)
  - Database:
    - MongoDB với Mongoose schema:
      - `User`: username, hashPassword, email, displayName, role (customer/admin), avatarUrl, avatarId, blogs[]
      - `Blog`: title, slug, description, content (Quill HTML), thumbnail, viewCount, status (active/processing/error), category ref, author ref
      - `Category`: title, slug, description, status (error/active/processing), virtual `blogs`
      - `Like`: quan hệ user–blog (user ref, blog ref)
      - `Save`: quan hệ user–blog (user ref, blog ref)
  - Redis:
    - Lưu `blog:{id}:viewCount` - Số view của blog
    - Lưu `blog:{id}:view:{userId|ip}` - Cooldown key với TTL để chống spam
    - Thống kê view theo ngày: `blog:views:{date}`
  - Cloudinary:
    - Upload/xoá ảnh; config qua biến môi trường
    - Trả về `url` và `publicId` để lưu trong DB

### 9. Routes và API Endpoints

#### 9.1 Frontend Routes (React Router)

**Public Routes** (không cần authentication, sử dụng `DefaultLayout`):

- `GET /` - Trang chủ, hiển thị danh sách blog (`Home` component)
- `GET /category` - Trang danh sách danh mục (`Category` component)
- `GET /category/:slug` - Trang chi tiết danh mục, hiển thị các blog thuộc danh mục (`DetailCategory` component)
- `GET /detail/:slug` - Trang chi tiết blog theo slug (`DetailBlog` component)
- `GET /aboutme` - Trang giới thiệu (`About` component)
- `GET /auth` - Trang đăng nhập/đăng ký (dùng chung, có tabs) (`Auth` component)
- `GET /access-denied` - Trang thông báo không có quyền truy cập (`AccessDenied` component)
- `GET /*` - Trang 404 cho các route không tồn tại (`NotFound` component)

**Protected Routes** (cần authentication, sử dụng `ProtectedRoute`):

- `GET /profile` - Trang profile của user đã đăng nhập (`Profile` component, trong `DefaultLayout`)

**Admin Routes** (cần authentication + admin role, sử dụng `ProtectedRoute` + `RbacRoute` + `ProtectedLayout`):

- `GET /admin/dashboard` - Dashboard admin, hiển thị thống kê (`Dashboard` component)
- `GET /admin/blogs` - Quản lý blog (CRUD) (`BlogMange` component)
- `GET /admin/categories` - Quản lý danh mục (CRUD) (`CategoryMange` component)
- `GET /admin/users` - Quản lý user (CRUD) (`UserMange` component)

**Lưu ý về Route Protection**:

- Tất cả routes dưới `/admin/*` yêu cầu:
  1. User đã đăng nhập (`ProtectedRoute`)
  2. User có role `admin` và permission `VIEW_DASHBOARD` (`RbacRoute`)
  3. Sử dụng `ProtectedLayout` cho UI admin

#### 9.2 Backend API Routes (Express)

**Base URL**: `http://localhost:5001` (hoặc theo `process.env.PORT`)

**Public API Routes** (không cần authentication):

**Authentication** (`/api/auth`):

- `POST /api/auth/signup` - Đăng ký user mới
  - Body: `{ username, password, email, firstName, lastName }`
- `POST /api/auth/signin` - Đăng nhập
  - Body: `{ username, password }`
- `DELETE /api/auth/signout` - Đăng xuất
- `POST /api/auth/refresh` - Refresh access token
  - Sử dụng refresh token từ cookie hoặc body

**Blogs** (`/api/blogs`):

- `GET /api/blogs` - Lấy danh sách blog (public)
- `GET /api/blogs/stats` - Lấy thống kê blog (public)
- `GET /api/blogs/active` - Lấy danh sách blog active (public)
- `GET /api/blogs/active/:id` - Lấy danh sách blog active của author (public)
- `GET /api/blogs/:slug` - Lấy chi tiết blog theo slug (public, `optionalAuth` middleware)
- `GET /api/blogs/chart` - Lấy dữ liệu chart (public)

**Categories** (`/api/categories`):

- `GET /api/categories` - Lấy danh sách tất cả categories (public)
- `GET /api/categories/active` - Lấy danh sách categories active (public)
- `GET /api/categories/:slug` - Lấy chi tiết category theo slug (public)

**Protected API Routes** (cần authentication - `authMiddleware.isAuthorized`):

**Blogs** (`/api/blogs`):

- `GET /api/blogs/:id/like` - Kiểm tra user đã like blog chưa (authenticated)
- `POST /api/blogs/:id/like` - Like blog (authenticated)
- `DELETE /api/blogs/:id/like` - Bỏ like blog (authenticated)
- `GET /api/blogs/:id/save` - Kiểm tra user đã save blog chưa (authenticated)
- `POST /api/blogs/:id/save` - Save blog (authenticated)
- `DELETE /api/blogs/:id/save` - Bỏ save blog (authenticated)
- `POST /api/blogs/blog` - Tạo blog mới (admin)
- `PUT /api/blogs/blog/:id` - Chỉnh sửa blog (admin)
- `DELETE /api/blogs/del/:id` - Xóa blog (admin)

**Categories** (`/api/categories`):

- `POST /api/categories/category` - Tạo category mới (admin)
- `PUT /api/categories/category/:id` - Chỉnh sửa category (admin)
- `DELETE /api/categories/del/:id` - Xóa category (admin)

**Users** (`/api/users` - tất cả routes đều protected):

- `GET /api/users` - Lấy danh sách users (admin)
- `GET /api/users/me` - Lấy thông tin user hiện tại (authenticated)
- `POST /api/users/user` - Tạo user mới (admin)
- `PUT /api/users/user/:id` - Chỉnh sửa user (admin)
- `DELETE /api/users/del/:id` - Xóa user (admin)

**Upload** (`/api/upload` - tất cả routes đều protected):

- `POST /api/upload` - Upload ảnh lên Cloudinary (authenticated)
  - Form data: `thumbnail` (file)
  - Middleware: `multer.single("thumbnail")`
- `DELETE /api/upload/del/:publicId` - Xóa ảnh từ Cloudinary (authenticated)

**Lưu ý về API Protection**:

- Routes `/api/auth`, `/api/blogs` (một số), `/api/categories` (một số) là public
- Routes `/api/users`, `/api/upload` yêu cầu authentication (tất cả)
- Routes CRUD blog/category (create, update, delete) yêu cầu authentication và thường chỉ dành cho admin
- Middleware `optionalAuth` cho phép decode token nếu có, nhưng không bắt buộc (dùng cho `/api/blogs/:slug` để track view cho cả visitor và user)

### 10. RBAC & bảo vệ route

- **Vai trò**:
  - `customer`: xem home, truy cập profile, like/save blog.
  - `admin`: toàn bộ quyền `customer` + truy cập dashboard, CRUD blog/category/user.
- **RBAC FE**:
  - Config `roles`, `permissions`, `rolePermissions`.
  - `RbacRoute` kiểm tra `requiredPermission` trước khi render route admin.
- **Bảo vệ BE**:
  - `authMiddleware.isAuthorized`: kiểm tra JWT, gắn `req.user`.
  - `authMiddleware.optionalAuth`: decode nếu có token, cho phép truy cập ẩn danh nếu không.

### 11. KPI & tiêu chí thành công

- Tỷ lệ hoàn thành đọc bài (scroll đến cuối trang) ≥ 60%.
- Tốc độ tải trang home ≤ 3s trên kết nối 4G trung bình.
- Số lỗi 5xx < 0.5% tổng request trong tháng.
- Tăng trưởng lượt view hàng tháng ≥ 10% (nếu có dữ liệu lịch sử).

### 12. Rủi ro & giả định

- **Giả định**:
  - MongoDB, Redis, Cloudinary được cấu hình và sẵn sàng.
  - Môi trường chạy backend cho phép cron/job định kỳ.
  - Domain FE đúng với cấu hình `BASE_URL` để CORS không lỗi.
- **Rủi ro**:
  - Redis downtime → view không tăng hoặc sync sai thời điểm.
  - Lạm dụng upload ảnh nếu không giới hạn kích thước/số lượng.
  - Chưa có rate limiting cho login, có nguy cơ brute force.

### 13. Lộ trình phát triển (Roadmap gợi ý)

- **Phase 1**: Hoàn thiện luồng đọc blog public + auth cơ bản (signup/signin/refresh/signout).
- **Phase 2**: Like/save, view counting với Redis, CRUD blog/category/user trong admin.
- **Phase 3**: Dashboard thống kê, biểu đồ, tối ưu UX/UI, RBAC chi tiết.
- **Phase 4**: Bổ sung các tính năng nâng cao (comment, search nâng cao, email, SEO… nếu cần).
