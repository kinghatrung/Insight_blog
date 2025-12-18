import BlogView from "../models/BlogView.js";
import Blog from "../models/Blog.js";

const blogViewsService = {
  trackView: async (blogId, ipAddress, userAgent, userId = null) => {
    try {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Kiểm tra xem IP này đã view blog này trong 24h chưa
      // (Tránh spam views)
      const existingView = await BlogView.findOne({
        blogId,
        ipAddress,
        viewedAt: { $gte: oneDayAgo },
      });

      if (existingView) {
        return {
          success: false,
        };
      }

      // Tạo view mới
      const newView = await BlogView.create({
        blogId,
        ipAddress,
        userAgent,
        userId,
        viewedAt: now,
      });

      // Tăng viewCount của blog
      await Blog.findByIdAndUpdate({ slug: blogId }, { $inc: { viewCount: 1 } });

      return {
        success: true,
        data: newView,
      };
    } catch (error) {
      throw error;
    }
  },

  // Lấy views stats cho dashboard
  getViewsStats: async () => {
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 30);
      thirtyDaysAgo.setHours(0, 0, 0, 0);

      // 1. Aggregate views theo ngày trong 30 ngày qua
      const viewsByDay = await BlogView.aggregate([
        {
          $match: {
            viewedAt: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$viewedAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      console.log("📊 Views by day:", viewsByDay);

      // 2. Tạo array 30 ngày với giá trị 0 nếu không có data
      const last30Days = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];

        const dayData = viewsByDay.find((d) => d._id === dateStr);
        last30Days.push({
          date: dateStr,
          value: dayData ? dayData.count : 0,
          index: 29 - i,
        });
      }

      // 3. Tổng views (từ Blog.viewCount)
      const totalViewsResult = await Blog.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$viewCount" },
          },
        },
      ]);

      // 4. Views hôm nay
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const todayViews = await BlogView.countDocuments({
        viewedAt: { $gte: startOfToday },
      });

      // 5. Tính % tăng/giảm so với 30 ngày trước
      const sixtyDaysAgo = new Date(now);
      sixtyDaysAgo.setDate(now.getDate() - 60);
      const thirtyOneDaysAgo = new Date(now);
      thirtyOneDaysAgo.setDate(now.getDate() - 31);

      const viewsLast30Days = await BlogView.countDocuments({
        viewedAt: { $gte: thirtyDaysAgo },
      });

      const viewsPrevious30Days = await BlogView.countDocuments({
        viewedAt: { $gte: sixtyDaysAgo, $lte: thirtyOneDaysAgo },
      });

      let growthPercent = 0;
      let isIncrease = true;

      if (viewsPrevious30Days > 0) {
        const diff = viewsLast30Days - viewsPrevious30Days;
        growthPercent = parseFloat(((diff / viewsPrevious30Days) * 100).toFixed(1));
        isIncrease = diff >= 0;
      } else if (viewsLast30Days > 0) {
        growthPercent = 100.0;
        isIncrease = true;
      }

      const result = {
        total: totalViewsResult[0]?.total || 0,
        todayCount: todayViews,
        growthPercent: Math.abs(growthPercent),
        isIncrease,
        chartData: last30Days,
      };
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Lấy views của 1 blog cụ thể
  getBlogViews: async (blogId) => {
    try {
      const blog = await Blog.findById(blogId).select("viewCount");
      const viewsHistory = await BlogView.find({ blogId }).sort({ viewedAt: -1 }).limit(100);

      return {
        totalViews: blog?.viewCount || 0,
        recentViews: viewsHistory,
      };
    } catch (error) {
      throw error;
    }
  },
};

export default blogViewsService;
