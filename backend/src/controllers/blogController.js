import blogService from "../services/blogService.js";

const blogController = {
  getBlogs: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 5;

      const blogs = await blogService.getBlogs(page, pageSize);

      res.status(200).json(blogs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getBlog: async (req, res) => {
    try {
      const idBlog = req.params.id;
      const blog = await blogService.getBlog(idBlog);

      res.status(200).json({ blog });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createBlog: async (req, res) => {
    try {
      const { title, content, thumbnail, status, author } = req.body;

      const blog = await blogService.createBlog(title, content, thumbnail, status, author);
      res.status(200).json({ blog, message: "Tạo blog thành công" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  editBlog: async (req, res) => {
    try {
      const idBlog = req.params.id;
      const { title, content, thumbnail, status } = req.body;
      const updatedBlog = await blogService.editBlog(idBlog, title, content, thumbnail, status);

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
