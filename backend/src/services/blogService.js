import Blog from "../models/Blog.js";
import User from "../models/User.js";
import { slugify } from "../utils/slugify.js";
import { parseDDMMYYYY } from "../utils/parseDDMMYYYY.js";

const blogService = {
  getBlogs: async (page = 1, pageSize = 5, filters = {}) => {
    try {
      const { title, status, startTime, endTime, author, description } = filters;
      const query = {};
      if (title) {
        query.title = { $regex: title, $options: "i" };
      }

      if (description) {
        query.description = { $regex: description, $options: "i" };
      }

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

      const skip = (page - 1) * pageSize;
      const total = await Blog.countDocuments(query);
      const blogs = await Blog.find(query)
        .populate("author", "username displayName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean();

      return {
        data: blogs,
        total,
      };
    } catch (error) {
      throw error;
    }
  },
  getBlogsActive: async () => {
    try {
      const blogsActive = await Blog.find({ status: "active" }).populate("author", "username displayName avatarUrl");
      return blogsActive;
    } catch (error) {
      throw error;
    }
  },
  getBlogBySlug: async (slugBlog) => {
    try {
      const blog = await Blog.findOne({ slug: slugBlog }).populate("author", "username displayName avatarUrl").lean();
      return blog;
    } catch (error) {
      throw error;
    }
  },

  createBlog: async (title, content, thumbnail, status, author, description) => {
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
      });

      await newBlog.save();

      return newBlog;
    } catch (error) {
      throw error;
    }
  },

  editBlog: async (idBlog, title, content, thumbnail, status, description) => {
    try {
      const blog = await Blog.findById(idBlog);
      if (!blog) throw new Error("Blog không tồn tại");

      const updateData = {};
      if (title) {
        updateData.title = title;
        updateData.slug = slugify(title);
      }
      if (description) updateData.description = description;
      if (content) updateData.content = content;
      if (thumbnail) updateData.thumbnail = thumbnail;
      if (status !== undefined) updateData.status = status;
      const updatedBlog = await Blog.findByIdAndUpdate(idBlog, { $set: updateData }, { new: true });

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
