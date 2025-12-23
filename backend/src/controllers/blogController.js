import blogService from "../services/blogService.js";
import blogViewService from "../services/blogViewService.js";
import { getClientIp } from "../utils/ipHelper.js";

const blogController = {
  getBlogs: async (req, res) => {
    try {
      const page = parseInt(req.query.page);
      const pageSize = parseInt(req.query.pageSize);

      const filters = {
        title: req.query.title || "",
        description: req.query.description || "",
        status: req.query.status || "",
        startTime: req.query.startTime || "",
        endTime: req.query.endTime || "",
        author: req.query.author || "",
        category: req.query.category || "",
      };

      const blogs = await blogService.getBlogs(page, pageSize, filters);

      res.status(200).json(blogs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getChartData: async (req, res) => {
    try {
      const blogs = await blogViewService.getChartData();
      res.status(200).json(blogs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getBlogsStats: async (req, res) => {
    try {
      const blogs = await blogService.getBlogsStats();
      res.status(200).json(blogs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getBlogsActive: async (req, res) => {
    try {
      const { search } = req.query;
      const blogsActive = await blogService.getBlogsActive(search);

      res.status(200).json({ blogsActive });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getBlogsActiveForAuthor: async (req, res) => {
    try {
      const idUser = req.params.id;
      const blogs = await blogService.getBlogsActiveForAuthor(idUser);
      res.status(200).json({ blogs });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getBlogBySlug: async (req, res) => {
    try {
      const slugBlog = req.params.slug;
      const userId = req?.user?.id || null;
      const ipAddress = getClientIp(req);
      const blog = await blogService.getBlogBySlug(slugBlog, userId);
      await blogViewService
        .incrementView(blog._id, userId, ipAddress)
        .catch((err) => console.error("Track view error:", err));

      res.status(200).json({ blog });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getLikeBlog: async (req, res) => {
    try {
      const userId = req.params.id;
      const blogs = await blogService.getLikeBlog(userId);
      res.status(200).json({ blogs });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  likeBlog: async (req, res) => {
    try {
      const userId = req.user.id;
      const id = req.params.id;
      await blogService.likeBlog(id, userId);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteLikeBlog: async (req, res) => {
    try {
      const userId = req.user.id;
      const id = req.params.id;
      await blogService.deleteLikeBlog(id, userId);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getSaveBlog: async (req, res) => {
    try {
      const userId = req.params.id;
      const blogs = await blogService.getSaveBlog(userId);
      res.status(200).json({ blogs });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  saveBlog: async (req, res) => {
    try {
      const userId = req.user.id;
      const id = req.params.id;
      await blogService.saveBlog(id, userId);
      res.status(200).json({ message: "Lưu blog thành công" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteSaveBlog: async (req, res) => {
    try {
      const userId = req.user.id;
      const id = req.params.id;
      await blogService.deleteSaveBlog(id, userId);
      res.status(200).json({ message: "Bỏ lưu blog thành công" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  createBlog: async (req, res) => {
    try {
      const { title, content, thumbnail, status, author, description, category } = req.body;

      const blog = await blogService.createBlog(title, content, thumbnail, status, author, description, category);
      res.status(200).json({ blog, message: "Tạo blog thành công" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  editBlog: async (req, res) => {
    try {
      const idBlog = req.params.id;
      const { title, content, thumbnail, status, description, category } = req.body;
      const updatedBlog = await blogService.editBlog(idBlog, title, content, thumbnail, status, description, category);

      res.status(200).json({ message: "Sửa blog thành công", updatedBlog });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteBlog: async (req, res) => {
    try {
      const idBlog = req.params.id;
      await blogService.deleteBlog(idBlog);

      res.status(200).json({ message: "Xóa blog thành công" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default blogController;
