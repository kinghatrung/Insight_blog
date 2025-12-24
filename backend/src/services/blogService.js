import mongoose from "mongoose";
import { getRedis } from "../config/redis.js";

import Blog from "../models/Blog.js";
import User from "../models/User.js";
import Like from "../models/Like.js";
import Save from "../models/Save.js";
import Category from "../models/Category.js";

import blogViewService from "../services/blogViewService.js";
import { slugify } from "../utils/slugify.js";
import { parseDDMMYYYY } from "../utils/parseDDMMYYYY.js";
import { getLastNDays } from "../utils/getDay.js";

const TARGET = 1200;

const blogService = {
  getBlogs: async (page = null, pageSize = null, filters = {}) => {
    try {
      const { title, status, startTime, endTime, author, description, category } = filters;
      const query = {};
      if (title) {
        query.title = { $regex: title, $options: "i" };
      }

      if (description) {
        query.description = { $regex: description, $options: "i" };
      }

      // if (category) {
      //   query.category = { $regex: category, $options: "i" };
      // }

      if (status) {
        query.status = status;
      }

      if (startTime && endTime) {
        const start = parseDDMMYYYY(startTime);
        const end = parseDDMMYYYY(endTime);
        end.setHours(23, 59, 59, 999);

        query.createdAt = { $gte: start, $lte: end };
      }

      if (author) {
        const users = await User.find({
          $or: [{ displayName: { $regex: author, $options: "i" } }],
        }).select("_id");

        const userIds = users.map((u) => u._id);
        query.author = { $in: userIds };
      }

      const total = await Blog.countDocuments(query);
      let blogQuery = Blog.find(query)
        .populate("author", "username displayName")
        .populate("category", "title slug")
        .sort({ createdAt: -1 });

      if (page && pageSize) {
        const skip = (page - 1) * pageSize;
        blogQuery = blogQuery.skip(skip).limit(pageSize);
      }

      const blogs = await blogQuery.lean();

      return {
        data: blogs,
        total,
      };
    } catch (error) {
      throw error;
    }
  },
  getBlogsStats: async () => {
    try {
      const redis = getRedis();
      const now = new Date();
      const year = now.getFullYear();

      /* ========= TIME RANGE ========= */
      const startOfToday = new Date(year, now.getMonth(), now.getDate());
      const endOfToday = new Date(year, now.getMonth(), now.getDate(), 23, 59, 59, 999);

      const startOfCurrentMonth = new Date(year, now.getMonth(), 1);
      const startOfLastMonth = new Date(year, now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(year, now.getMonth(), 0, 23, 59, 59, 999);

      const startOfYear = new Date(year, 0, 1);
      const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

      const todayKey = now.toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
      const last7Days = getLastNDays(7);

      /* ========= PARALLEL DB ========= */
      const [
        total,
        totalLastMonth,
        totalCurrentMonth,
        todayCount,
        totalLikes,
        todayLikes,
        totalViewsAgg,
        statusAgg,
        yearlyViewsAgg,
        monthlyBlogsAgg,
        registeredThisMonth,
        categoryAgg,
      ] = await Promise.all([
        Blog.countDocuments(),
        Blog.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
        Blog.countDocuments({ createdAt: { $gte: startOfCurrentMonth } }),
        Blog.countDocuments({ createdAt: { $gte: startOfToday, $lte: endOfToday } }),

        Like.countDocuments(),
        Like.countDocuments({ createdAt: { $gte: startOfToday, $lte: endOfToday } }),

        Blog.aggregate([{ $group: { _id: null, totalViews: { $sum: "$viewCount" } } }]),
        Blog.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
        Blog.aggregate([
          { $match: { createdAt: { $gte: startOfYear, $lte: endOfYear } } },
          { $group: { _id: { $month: "$createdAt" }, value: { $sum: "$viewCount" } } },
        ]),

        Blog.aggregate([
          { $match: { createdAt: { $gte: startOfCurrentMonth } } },
          {
            $group: {
              _id: { $dayOfMonth: "$createdAt" },
              count: { $sum: 1 },
            },
          },
        ]),

        User.countDocuments({ createdAt: { $gte: startOfLastMonth } }),

        Category.aggregate([
          { $lookup: { from: "blogs", localField: "_id", foreignField: "category", as: "blogs" } },
          { $project: { _id: 0, name: "$title", count: { $size: "$blogs" } } },
        ]),
      ]);

      /* ========= GROWTH ========= */
      const diff = totalCurrentMonth - totalLastMonth;
      const growthPercent =
        totalLastMonth > 0 ? +((diff / totalLastMonth) * 100).toFixed(1) : totalCurrentMonth > 0 ? 100 : 0;
      const isIncrease = diff >= 0;

      /* ========= STATUS ========= */
      const stats = { active: 0, processing: 0, error: 0 };
      statusAgg.forEach((i) => (stats[i._id] = i.count));

      /* ========= REDIS ========= */
      const todayViews = Number(await redis.get(`blog:views:total:${todayKey}`)) || 0;

      const viewsChartData = await Promise.all(
        last7Days.map(async ({ key, formattedDate }) => ({
          date: formattedDate,
          value: Number(await redis.get(`blog:views:total:${key}`)) || 0,
        }))
      );

      /* ========= YEAR CHART ========= */
      const yearlyViewsChartData = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        return {
          month: `T${month}`,
          value: yearlyViewsAgg.find((m) => m._id === month)?.value || 0,
        };
      });

      const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate();
      const monthlyBlogsChartData = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        return {
          day: `${day}`,
          value: monthlyBlogsAgg.find((d) => d._id === day)?.count || 0,
        };
      });

      /* ========= LIKES CHART ========= */
      const likesChartData = await Promise.all(
        last7Days.map(async ({ formattedDate }) => {
          const [d, m, y] = formattedDate.split("/").map(Number);
          const start = new Date(y, m - 1, d);
          const end = new Date(y, m - 1, d, 23, 59, 59, 999);
          return {
            date: formattedDate,
            value: await Like.countDocuments({ createdAt: { $gte: start, $lte: end } }),
          };
        })
      );

      /* ========= RESPONSE ========= */
      return {
        total,
        todayCount,
        currentMonth: totalCurrentMonth,
        lastMonth: totalLastMonth,
        growthPercent,
        isIncrease,

        totalViews: totalViewsAgg[0]?.totalViews || 0,
        todayViews,
        viewsChartData,
        yearlyViewsChartData,

        monthlyBlogsChartData,
        categoriesStats: categoryAgg,

        totalLikes,
        todayLikes,
        likesChartData,
        registeredThisMonth,
        progressPercent: Math.min(100, Math.round((registeredThisMonth / TARGET) * 100)),
        stats,
      };
    } catch (err) {
      throw err;
    }
  },
  getBlogsActive: async (search) => {
    try {
      const query = { status: "active" };
      if (search) {
        query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }];
      }
      const blogsActive = await Blog.find(query)
        .populate("author", "username displayName avatarUrl")
        .populate("category", "title")
        .sort({ createdAt: -1 });
      return blogsActive;
    } catch (error) {
      throw error;
    }
  },
  getBlogsActiveForAuthor: async (idUser) => {
    try {
      const blogs = await Blog.find({
        author: idUser,
        status: "active",
      })
        .populate("author", "username displayName avatarUrl")
        .populate("category", "title")
        .sort({ createdAt: -1 });
      return blogs;
    } catch (error) {
      throw error;
    }
  },
  getBlogBySlug: async (slugBlog, userId) => {
    try {
      const blog = await Blog.findOne({ slug: slugBlog })
        .populate("author", "username displayName avatarUrl")
        .populate("category", "title slug")
        .lean();

      if (!blog) return null;

      const [isLiked, likesCount, isSaved, viewCount] = await Promise.all([
        userId ? Like.exists({ blogId: blog._id, userId }) : false,
        Like.countDocuments({ blogId: blog._id }),
        userId ? Save.exists({ blogId: blog._id, userId }) : false,
        await blogViewService.getViewCount(blog._id),
      ]);

      return {
        ...blog,
        isLiked: !!isLiked,
        likesCount,
        isSaved,
        viewCount,
      };
    } catch (error) {
      throw error;
    }
  },
  getLikeBlog: async (userId) => {
    try {
      const likes = await Like.find({ userId }).select("blogId").lean();

      const blogIds = likes.map((like) => like.blogId);

      if (!blogIds.length) return [];
      const blogs = await Blog.find({
        _id: { $in: blogIds },
        status: "active",
      })
        .sort({ createdAt: -1 })
        .populate("author", "displayName avatarUrl")
        .populate("category", "title slug");

      return blogs;
    } catch (error) {
      throw error;
    }
  },
  likeBlog: async (id, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await Like.create([{ blogId: id, userId }], { session });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      if (error.code === 11000) return;
      throw error;
    } finally {
      session.endSession();
    }
  },
  deleteLikeBlog: async (id, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await Like.deleteOne({ blogId: id, userId }, { session });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },
  getSaveBlog: async (userId) => {
    try {
      const likes = await Save.find({ userId }).select("blogId").lean();

      const blogIds = likes.map((like) => like.blogId);

      if (!blogIds.length) return [];
      const blogs = await Blog.find({
        _id: { $in: blogIds },
        status: "active",
      })
        .sort({ createdAt: -1 })
        .populate("author", "displayName avatarUrl")
        .populate("category", "title slug");

      return blogs;
    } catch (error) {
      throw error;
    }
  },
  saveBlog: async (id, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await Save.create([{ blogId: id, userId }], { session });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      if (error.code === 11000) return;
      throw error;
    } finally {
      session.endSession();
    }
  },
  deleteSaveBlog: async (id, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await Save.deleteOne({ blogId: id, userId }, { session });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },
  createBlog: async (title, content, thumbnail, status, author, description, category) => {
    try {
      const slug = slugify(title);
      const blog = await Blog.findOne({ slug });
      if (blog) throw new Error("Blog này đã tồn tại");

      const newBlog = new Blog({
        title,
        slug,
        content,
        thumbnail,
        status,
        author,
        description,
        category,
      });

      await newBlog.save();

      return newBlog;
    } catch (error) {
      throw error;
    }
  },

  editBlog: async (idBlog, title, content, thumbnail, status, description, category) => {
    try {
      const updateData = {};
      if (title) {
        updateData.title = title;
        updateData.slug = slugify(title);
      }
      if (description) updateData.description = description;
      if (content) updateData.content = content;
      if (thumbnail) updateData.thumbnail = thumbnail;
      if (status !== undefined) updateData.status = status;
      if (category) updateData.category = category;
      const updatedBlog = await Blog.findByIdAndUpdate(
        idBlog,
        { $set: updateData },
        { new: true, runValidators: true }
      );
      if (!updatedBlog) {
        throw new Error("Blog không tồn tại");
      }
      return updatedBlog;
    } catch (error) {
      throw error;
    }
  },

  deleteBlog: async (idBlog) => {
    try {
      await Blog.findByIdAndDelete(idBlog);

      return true;
    } catch (error) {
      throw error;
    }
  },
};

export default blogService;
