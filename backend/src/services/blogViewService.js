import { getRedis } from "../config/redis.js";
import Blog from "../models/Blog.js";

const VIEW_COOLDOWN = 1;

const blogViewService = {
  incrementView: async (blogId, userId, ipAddress) => {
    try {
      const redis = getRedis();

      // Ưu tiên userId, fallback IP
      const identifier = userId || ipAddress;
      if (!identifier) return { success: false };

      const viewKey = `blog:${blogId}:view:${identifier}`;

      // Đã view trong cooldown → không tính
      const hasViewed = await redis.exists(viewKey);
      if (hasViewed) {
        return { success: false, message: "Already viewed" };
      }

      // Set cooldown chống spam
      await redis.setEx(viewKey, VIEW_COOLDOWN, "1");

      // 1️⃣ TỔNG VIEW CỦA BLOG (logic cũ)
      const viewCountKey = `blog:${blogId}:viewCount`;
      await redis.incr(viewCountKey);

      // ============================
      // 🔥 PHẦN MỚI: VIEW THEO NGÀY
      // ============================

      // YYYY-MM-DD (theo giờ VN)
      const today = new Date().toLocaleDateString("sv-SE", {
        timeZone: "Asia/Ho_Chi_Minh",
      });
      // ví dụ: 2025-12-22

      // 2️⃣ VIEW BLOG TRONG NGÀY
      await redis.incr(`blog:${blogId}:viewCount:${today}`);

      // 3️⃣ TỔNG VIEW TOÀN HỆ THỐNG TRONG NGÀY
      await redis.incr(`blog:views:total:${today}`);

      // Async sync DB (giữ nguyên)
      await blogViewService
        .syncViewCountToDatabase(blogId)
        .catch((err) => console.error(`Sync view error for blog ${blogId}:`, err));

      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  getViewCount: async (blogId) => {
    try {
      const redis = getRedis();
      const viewCountKey = `blog:${blogId}:viewCount`;

      // Lấy từ Redis
      let count = await redis.get(viewCountKey);

      if (count !== null) {
        return parseInt(count, 10);
      }

      // Redis không có → lấy từ DB và cache lại
      const blog = await Blog.findById(blogId).select("viewCount");
      if (!blog) return 0;

      await redis.set(viewCountKey, blog.viewCount.toString());
      return blog.viewCount;
    } catch (error) {
      try {
        const blog = await Blog.findById(blogId).select("viewCount");
        return blog?.viewCount || 0;
      } catch {
        return 0;
      }
    }
  },
  syncViewCountToDatabase: async (blogId) => {
    try {
      const redis = getRedis();
      const viewCountKey = `blog:${blogId}:viewCount`;
      const count = await redis.get(viewCountKey);
      if (count !== null) {
        await Blog.findByIdAndUpdate(blogId, { viewCount: parseInt(count, 10) });
      }
    } catch (error) {
      throw error;
    }
  },
  syncAllViewCounts: async () => {
    try {
      const redis = getRedis();
      const keys = await redis.keys("blog:*:viewCount");

      for (const key of keys) {
        const blogId = key.split(":")[1];
        await blogViewService.syncViewCountToDatabase(blogId);
      }

      return keys.length;
    } catch (error) {
      throw error;
    }
  },
};

export default blogViewService;
