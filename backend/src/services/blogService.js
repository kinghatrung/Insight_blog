import mongoose from "mongoose";

import Blog from "../models/Blog.js";
import User from "../models/User.js";
import Like from "../models/Like.js";
import Save from "../models/Save.js";
import { slugify } from "../utils/slugify.js";
import { parseDDMMYYYY } from "../utils/parseDDMMYYYY.js";

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
      const now = new Date();

      // Tính toán ngày bắt đầu tháng hiện tại và tháng trước
      const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

      // Tính toán ngày hôm nay
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

      // 1. Tổng blogs hiện tại
      const total = await Blog.countDocuments();

      // 2. Tổng blogs tháng trước
      const totalLastMonth = await Blog.countDocuments({
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      });

      // 3. Tổng blogs tháng này
      const totalCurrentMonth = await Blog.countDocuments({
        createdAt: { $gte: startOfCurrentMonth },
      });

      // 4. Blogs đăng hôm nay
      const todayCount = await Blog.countDocuments({
        createdAt: { $gte: startOfToday, $lte: endOfToday },
      });

      // 5. Tính % tăng/giảm so với tháng trước
      let growthPercent = 0;
      let isIncrease = true;

      if (totalLastMonth > 0) {
        const diff = totalCurrentMonth - totalLastMonth;
        growthPercent = parseFloat(((diff / totalLastMonth) * 100).toFixed(1));
        isIncrease = diff >= 0;
      } else if (totalCurrentMonth > 0) {
        growthPercent = 100.0;
        isIncrease = true;
      }

      // 6. Thống kê theo status
      const statusStats = await Blog.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const stats = {
        active: 0,
        processing: 0,
        error: 0,
      };

      statusStats.forEach((item) => {
        if (item._id === "active") stats.active = item.count;
        if (item._id === "processing") stats.processing = item.count;
        if (item._id === "error") stats.error = item.count;
      });

      const result = {
        total,
        todayCount,
        growthPercent,
        isIncrease,
        currentMonth: totalCurrentMonth,
        lastMonth: totalLastMonth,
        stats,
      };
      return result;
    } catch (error) {
      throw error;
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

      const [isLiked, likesCount, isSaved] = await Promise.all([
        userId ? Like.exists({ blogId: blog._id, userId }) : false,
        Like.countDocuments({ blogId: blog._id }),
        userId ? Save.exists({ blogId: blog._id, userId }) : false,
      ]);

      return { ...blog, isLiked: !!isLiked, likesCount, isSaved };
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
