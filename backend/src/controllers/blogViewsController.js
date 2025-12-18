import blogViewsService from "../services/blogViewsService.js";

const blogViewsController = {
  trackBlogView: async (req, res) => {
    try {
      const { blogId } = req.params;
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers["user-agent"];
      const userId = req?.user?._id;

      const result = await blogViewsService.trackView(blogId, ipAddress, userAgent, userId);

      return res.status(200).json({ result });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getViewsStats: async (req, res) => {
    try {
      const stats = await blogViewsService.getViewsStats();
      return res.status(200).json({ stats });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getBlogViews: async (req, res) => {
    try {
      const { blogId } = req.params;
      const views = await blogViewsService.getBlogViews(blogId);
      return res.status(200).json({ views });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

export default blogViewsController;
