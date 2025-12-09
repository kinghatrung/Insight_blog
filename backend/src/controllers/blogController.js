import blogService from "../services/blogService.js";

const blogController = {
  getBlogs: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 5;

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
  getBlogsActive: async (req, res) => {
    try {
      const { search } = req.query;
      const blogsActive = await blogService.getBlogsActive(search);

      res.status(200).json({ blogsActive });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getBlogBySlug: async (req, res) => {
    try {
      const slugBlog = req.params.slug;
      const blog = await blogService.getBlogBySlug(slugBlog);

      res.status(200).json({ blog });
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
