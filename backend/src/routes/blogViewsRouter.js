import { Router } from "express";

import blogViewsController from "../controllers/blogViewsController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

// Track view khi user xem blog
router.post("/:blogId/view", authMiddleware.optionalAuth, blogViewsController.trackBlogView);
// Lấy stats cho dashboard
router.get("/stats", blogViewsController.getViewsStats);
// Lấy views của 1 blog
router.get("/:blogId", blogViewsController.getBlogViews);

export default router;
