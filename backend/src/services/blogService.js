import Blog from "../models/Blog.js";
import { slugify } from "../utils/slugify.js";

const blogService = {
  getBlogs: async () => {
    try {
      const blogs = await Blog.find().populate("author", "username displayName").lean();
      return blogs;
    } catch (error) {
      throw error;
    }
  },

  getBlog: async (idBlog) => {
    try {
      const blog = await Blog.findOne({ _id: idBlog }).populate("author", "username displayName").lean();
      return blog;
    } catch (error) {
      throw error;
    }
  },

  createBlog: async (title, content, thumbnail, status, author) => {
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
      });

      await newBlog.save();

      return newBlog;
    } catch (error) {
      throw error;
    }
  },

  editBlog: async (idBlog, title, content, thumbnail, status) => {
    try {
      const blog = await Blog.findById(idBlog);
      if (!blog) throw new Error("Blog không tồn tại");

      const updateData = {};
      if (title) {
        updateData.title = title;
        updateData.slug = slugify(title);
      }
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
