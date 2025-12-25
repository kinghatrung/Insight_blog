# 🚀 Hướng dẫn Tối ưu Hiệu suất - Insight Blog Platform

Tài liệu này liệt kê các điểm có thể tối ưu hiệu suất cho dự án Insight, được phân loại theo mức độ ưu tiên và độ khó thực hiện.

## 📊 Tổng quan

### Mức độ ưu tiên

- 🔴 **Cao**: Tác động lớn, dễ thực hiện
- 🟡 **Trung bình**: Tác động vừa, độ khó trung bình
- 🟢 **Thấp**: Tác động nhỏ hoặc cần nhiều công sức

---

## 🎨 FRONTEND OPTIMIZATIONS

### 1. 🔴 Image Optimization (Cao - Dễ)

**Vấn đề hiện tại:**

- Images không có lazy loading
- Images không có responsive srcset
- Images từ Cloudinary chưa có optimization parameters
- Sử dụng `<img>` thay vì component tối ưu

**Vị trí cần sửa:**

- `frontend/src/components/CardBlog.tsx` (dòng 105-115)
- `frontend/src/pages/PublicPage/DetailBlog.tsx` (dòng 123-136)

**Giải pháp:**

```typescript
// Thêm lazy loading và optimization cho images
<img
  loading="lazy"
  src={blog?.thumbnail}
  srcSet={`${blog?.thumbnail}?w=400 400w, ${blog?.thumbnail}?w=800 800w, ${blog?.thumbnail}?w=1200 1200w`}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  alt="Ảnh blog"
/>
```

**Hoặc sử dụng Cloudinary transformation:**

```typescript
// Thêm transformation parameters vào URL
const optimizedThumbnail = blog?.thumbnail?.replace(
  "/upload/",
  "/upload/w_auto,h_auto,c_fill,f_auto,q_auto/"
);
```

**Lợi ích:**

- Giảm 30-50% dung lượng ảnh
- Cải thiện LCP (Largest Contentful Paint)
- Giảm bandwidth

---

### 2. 🔴 React Query Cache Configuration (Cao - Dễ)

**Vấn đề hiện tại:**

- `staleTime` chỉ được set ở một số queries
- Không có `cacheTime` tối ưu
- Một số queries không cần refetch thường xuyên

**Vị trí cần sửa:**

- `frontend/src/pages/PublicPage/Home.tsx` (dòng 9-13)
- `frontend/src/pages/PublicPage/DetailBlog.tsx` (dòng 26-34)
- `frontend/src/pages/ProtectedPage/Profile.tsx` (dòng 35-46)

**Giải pháp:**

```typescript
// Home.tsx - Blogs list ít thay đổi, có thể cache lâu hơn
const { data: blogs, isLoading } = useQuery({
  queryKey: ["blogs"],
  queryFn: () => blogService.getBlogsActive(),
  staleTime: 5 * 60 * 1000, // 5 phút
  cacheTime: 10 * 60 * 1000, // 10 phút
  refetchOnWindowFocus: false,
});

// DetailBlog.tsx - Blog detail có thể cache ngắn hơn
const { data: blog } = useQuery({
  queryKey: ["blog", slug, currentUser?._id],
  queryFn: () => blogService.getBlogBySlug(slug!),
  staleTime: 2 * 60 * 1000, // 2 phút
  cacheTime: 5 * 60 * 1000, // 5 phút
  enabled: !!slug,
});
```

**Lợi ích:**

- Giảm số lượng API calls không cần thiết
- Cải thiện UX với instant data loading
- Giảm tải server

---

### 3. 🔴 Unnecessary Data Fetching (Cao - Dễ)

**Vấn đề hiện tại:**

- `DetailBlog.tsx` fetch toàn bộ blogs list chỉ để hiển thị 3 bài liên quan
- `Profile.tsx` fetch nhiều queries cùng lúc không cần thiết

**Vị trí cần sửa:**

- `frontend/src/pages/PublicPage/DetailBlog.tsx` (dòng 31-36)

**Giải pháp:**

```typescript
// Thay vì fetch toàn bộ blogs, chỉ fetch 3 bài liên quan
const { data: relatedBlogs, isLoading } = useQuery({
  queryKey: ["related-blogs", slug],
  queryFn: () => blogService.getRelatedBlogs(slug!, 3),
  enabled: !!slug,
  staleTime: 5 * 60 * 1000,
});
```

**Backend cần thêm endpoint:**

```javascript
// backend/src/services/blogService.js
getRelatedBlogs: async (slugBlog, limit = 3) => {
  const blog = await Blog.findOne({ slug: slugBlog }).select("category");
  if (!blog) return [];

  return await Blog.find({
    category: blog.category,
    slug: { $ne: slugBlog },
    status: "active",
  })
    .populate("author", "displayName avatarUrl")
    .populate("category", "title slug")
    .limit(limit)
    .lean();
};
```

**Lợi ích:**

- Giảm payload response
- Tăng tốc độ load trang
- Giảm tải database

---

### 4. 🟡 Component Memoization (Trung bình - Trung bình)

**Vấn đề hiện tại:**

- `CardBlog` đã có `memo` nhưng có thể tối ưu thêm
- Các handler functions không được memoize
- Một số components re-render không cần thiết

**Vị trí cần sửa:**

- `frontend/src/components/CardBlog.tsx`
- `frontend/src/pages/PublicPage/Home.tsx`
- `frontend/src/pages/PublicPage/DetailBlog.tsx`

**Giải pháp:**

```typescript
// Home.tsx - Memoize blogsData
const blogsData = useMemo(() => {
  if (isLoading) return Array(6).fill(null);
  return safeBlogs.slice(1) ?? [];
}, [isLoading, safeBlogs]);

// DetailBlog.tsx - Memoize handlers
const handleToggleLike = useCallback(() => {
  if (!currentUser) {
    message.warning("Vui lòng đăng nhập để thích bài viết");
    return;
  }
  if (blogData?.isLiked) {
    unlikeMutation.mutate(blogData._id);
  } else {
    likeMutation.mutate(blogData._id);
  }
}, [
  currentUser,
  blogData?.isLiked,
  blogData?._id,
  unlikeMutation,
  likeMutation,
]);
```

**Lợi ích:**

- Giảm re-renders không cần thiết
- Cải thiện performance khi scroll/list nhiều items

---

### 5. 🟡 Vite Build Optimization (Trung bình - Dễ)

**Vấn đề hiện tại:**

- `vite.config.ts` chưa có build optimization
- Chưa có code splitting tốt
- Chưa có compression

**Vị trí cần sửa:**

- `frontend/vite.config.ts`

**Giải pháp:**

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    target: "es2015",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Xóa console.log trong production
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "antd-vendor": ["antd", "@ant-design/icons"],
          "redux-vendor": ["@reduxjs/toolkit", "react-redux", "redux-persist"],
          "query-vendor": ["@tanstack/react-query"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
});
```

**Lợi ích:**

- Giảm bundle size
- Cải thiện initial load time
- Better caching với code splitting

---

### 6. 🟡 React Query Devtools (Trung bình - Dễ)

**Vấn đề hiện tại:**

- Không có React Query Devtools để debug

**Giải pháp:**

```typescript
// frontend/src/main.tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Chỉ hiển thị trong development
{
  import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />;
}
```

**Lợi ích:**

- Dễ debug cache issues
- Monitor query performance

---

### 7. 🟢 Virtual Scrolling (Thấp - Khó)

**Vấn đề hiện tại:**

- Khi có nhiều blogs, render tất cả cùng lúc

**Giải pháp:**
Sử dụng `react-window` hoặc `react-virtualized` cho danh sách dài

**Lợi ích:**

- Chỉ render items visible
- Cải thiện performance với danh sách lớn

---

## ⚙️ BACKEND OPTIMIZATIONS

### 8. 🔴 Database Indexes (Cao - Dễ)

**Vấn đề hiện tại:**

- Chưa có indexes cho các fields thường query
- Queries chậm với dữ liệu lớn

**Vị trí cần sửa:**

- `backend/src/models/Blog.js`
- `backend/src/models/Category.js`
- `backend/src/models/User.js`

**Giải pháp:**

```javascript
// Blog.js
const blogSchema = new Schema(
  {
    // ... fields
  },
  { timestamps: true }
);

// Thêm indexes
blogSchema.index({ slug: 1 }, { unique: true });
blogSchema.index({ status: 1, createdAt: -1 });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ author: 1 });
blogSchema.index({ title: "text", description: "text" }); // Text search

// Category.js
categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ status: 1 });

// User.js
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
```

**Lợi ích:**

- Tăng tốc queries 10-100x
- Giảm CPU usage
- Cải thiện response time

---

### 9. 🔴 Select Only Needed Fields (Cao - Dễ)

**Vấn đề hiện tại:**

- Một số queries select tất cả fields không cần thiết
- Fetch cả `content` (HTML lớn) khi chỉ cần list

**Vị trí cần sửa:**

- `backend/src/services/blogService.js` (dòng 56-66, 230-245)

**Giải pháp:**

```javascript
// getBlogsActive - Không cần content cho list view
const blogs = await Blog.find({ status: "active" })
  .select("-content") // Exclude content field
  .populate("author", "username displayName avatarUrl")
  .populate("category", "title slug")
  .sort({ createdAt: -1 })
  .lean();
```

**Lợi ích:**

- Giảm payload 50-80%
- Tăng tốc queries
- Giảm memory usage

---

### 10. 🔴 API Response Caching (Cao - Trung bình)

**Vấn đề hiện tại:**

- Không có caching cho API responses
- Mỗi request đều query database

**Giải pháp:**
Sử dụng Redis để cache API responses

```javascript
// backend/src/middlewares/cacheMiddleware.js
import { getRedis } from "../config/redis.js";

const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    const redis = await getRedis();
    const key = `cache:${req.originalUrl}:${JSON.stringify(req.query)}`;

    try {
      const cached = await redis.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }

      // Store original json function
      const originalJson = res.json.bind(res);
      res.json = function (data) {
        redis.setex(key, duration, JSON.stringify(data));
        return originalJson(data);
      };

      next();
    } catch (error) {
      next();
    }
  };
};

// Sử dụng
router.get(
  "/blogs/active",
  cacheMiddleware(300),
  blogController.getBlogsActive
);
```

**Lợi ích:**

- Giảm database load
- Tăng response time 10-50x
- Cải thiện scalability

---

### 11. 🟡 N+1 Query Problem (Trung bình - Trung bình)

**Vấn đề hiện tại:**

- `categoryService.getCategoriesActive()` populate blogs có thể gây N+1
- Một số queries có thể optimize với aggregation

**Vị trí cần sửa:**

- `backend/src/services/categoryService.js` (dòng 50-56)

**Giải pháp:**

```javascript
// Thay vì populate, sử dụng aggregation
getCategoriesActive: async () => {
  const categories = await Category.aggregate([
    { $match: { status: "active" } },
    {
      $lookup: {
        from: "blogs",
        localField: "_id",
        foreignField: "category",
        as: "blogs",
        pipeline: [
          { $match: { status: "active" } },
          { $project: { title: 1, slug: 1, thumbnail: 1, createdAt: 1 } },
        ],
      },
    },
    { $sort: { createdAt: -1 } },
  ]);
  return categories;
};
```

**Lợi ích:**

- Giảm số queries
- Tăng performance với dữ liệu lớn

---

### 12. 🟡 Compression Middleware (Trung bình - Dễ)

**Vấn đề hiện tại:**

- Không có compression cho responses

**Giải pháp:**

```bash
npm install compression
```

```javascript
// backend/src/index.js
import compression from "compression";

app.use(compression());
```

**Lợi ích:**

- Giảm 60-80% response size
- Tăng tốc độ transfer

---

### 13. 🟡 Rate Limiting (Trung bình - Dễ)

**Vấn đề hiện tại:**

- Không có rate limiting
- Dễ bị abuse

**Giải pháp:**

```bash
npm install express-rate-limit
```

```javascript
// backend/src/middlewares/rateLimiter.js
import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // 100 requests
  message: "Quá nhiều requests, vui lòng thử lại sau",
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts
  message: "Quá nhiều lần đăng nhập, vui lòng thử lại sau",
});
```

**Lợi ích:**

- Bảo vệ server khỏi abuse
- Cải thiện security

---

### 14. 🟡 Pagination Optimization (Trung bình - Dễ)

**Vấn đề hiện tại:**

- Một số endpoints chưa có pagination
- Pagination chưa tối ưu

**Vị trí cần sửa:**

- `backend/src/services/blogService.js`

**Giải pháp:**

```javascript
// Sử dụng cursor-based pagination cho performance tốt hơn
getBlogsActive: async (cursor = null, limit = 10) => {
  const query = { status: "active" };
  if (cursor) {
    query._id = { $lt: cursor };
  }

  const blogs = await Blog.find(query)
    .select("-content")
    .populate("author", "displayName avatarUrl")
    .populate("category", "title slug")
    .sort({ _id: -1 })
    .limit(limit + 1)
    .lean();

  const hasMore = blogs.length > limit;
  if (hasMore) blogs.pop();

  return {
    blogs,
    nextCursor: hasMore ? blogs[blogs.length - 1]._id : null,
  };
};
```

**Lợi ích:**

- Performance tốt hơn với offset lớn
- Consistent results

---

## 🌐 GENERAL OPTIMIZATIONS

### 15. 🔴 Cloudinary Image Transformations (Cao - Dễ)

**Vấn đề hiện tại:**

- Images từ Cloudinary chưa có transformation parameters
- Không responsive

**Giải pháp:**

```javascript
// backend/src/services/uploadService.js
const streamUpload = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: process.env.CLOUDINARY_FOLDER_NAME,
        format: "webp",
        resource_type: "image",
        quality: "auto:good",
        transformation: [
          { width: 1200, height: 630, crop: "fill", quality: "auto" },
          { fetch_format: "auto" },
        ],
      }
      // ...
    );
  });

// Frontend - Sử dụng responsive images
const getOptimizedImageUrl = (url, width) => {
  if (!url) return "";
  return url.replace(
    "/upload/",
    `/upload/w_${width},h_auto,c_fill,f_auto,q_auto/`
  );
};
```

**Lợi ích:**

- Giảm 40-60% image size
- Responsive images
- Better performance

---

### 16. 🟡 Service Worker / PWA (Trung bình - Khó)

**Vấn đề hiện tại:**

- Không có offline support
- Không có caching strategy

**Giải pháp:**
Sử dụng Workbox hoặc Vite PWA plugin

**Lợi ích:**

- Offline support
- Better caching
- App-like experience

---

### 17. 🟡 HTTP/2 Server Push (Thấp - Khó)

**Vấn đề hiện tại:**

- Chưa tận dụng HTTP/2 features

**Lợi ích:**

- Faster resource loading
- Better multiplexing

---

## 📈 Monitoring & Metrics

### 18. 🟡 Performance Monitoring (Trung bình - Trung bình)

**Giải pháp:**

- Thêm logging cho slow queries
- Monitor API response times
- Track Core Web Vitals

```javascript
// backend/src/middlewares/performanceLogger.js
const performanceLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (duration > 1000) {
      console.warn(
        `Slow request: ${req.method} ${req.path} took ${duration}ms`
      );
    }
  });

  next();
};
```

---

## 🎯 Priority Implementation Order

### Phase 1 (Quick Wins - 1-2 ngày):

1. ✅ Image lazy loading và optimization (#1)
2. ✅ React Query cache configuration (#2)
3. ✅ Database indexes (#8)
4. ✅ Select only needed fields (#9)
5. ✅ Cloudinary transformations (#15)

### Phase 2 (Medium Impact - 3-5 ngày):

6. ✅ API response caching (#10)
7. ✅ Unnecessary data fetching (#3)
8. ✅ Component memoization (#4)
9. ✅ Vite build optimization (#5)
10. ✅ Compression middleware (#12)

### Phase 3 (Long-term - 1-2 tuần):

11. ✅ N+1 query optimization (#11)
12. ✅ Rate limiting (#13)
13. ✅ Pagination optimization (#14)
14. ✅ Service Worker / PWA (#16)

---

## 📊 Expected Performance Improvements

Sau khi implement các optimizations trên:

- **Initial Load Time**: Giảm 40-60%
- **Time to Interactive**: Giảm 30-50%
- **Bundle Size**: Giảm 20-30%
- **API Response Time**: Giảm 50-70%
- **Database Query Time**: Giảm 60-80%
- **Image Size**: Giảm 40-60%
- **Overall Lighthouse Score**: Tăng 20-30 điểm

---

## 🔧 Tools để đo lường

1. **Lighthouse** - Core Web Vitals
2. **React DevTools Profiler** - Component performance
3. **React Query Devtools** - Cache monitoring
4. **MongoDB Explain** - Query performance
5. **Redis Monitor** - Cache hit rate

---

## 📝 Notes

- Test kỹ sau mỗi optimization
- Monitor production metrics
- A/B test nếu có thể
- Document changes

---

**Last Updated**: 2024
**Maintained by**: Development Team
