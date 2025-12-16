import { Router } from "express";
import blogController from "../controllers/blogController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", blogController.getBlogs);
router.get("/active", blogController.getBlogsActive);
router.get("/active/:id", blogController.getBlogsActiveForAuthor);
router.get("/:slug", authMiddleware.optionalAuth, blogController.getBlogBySlug);
router.get("/:id/like", authMiddleware.isAuthorized, blogController.getLikeBlog);
router.get("/:id/save", authMiddleware.isAuthorized, blogController.getSaveBlog);
router.post("/:id/like", authMiddleware.isAuthorized, blogController.likeBlog);
router.post("/:id/save", authMiddleware.isAuthorized, blogController.saveBlog);
router.post("/blog", blogController.createBlog);
router.put("/blog/:id", blogController.editBlog);
router.delete("/:id/like", authMiddleware.isAuthorized, blogController.deleteLikeBlog);
router.delete("/:id/save", authMiddleware.isAuthorized, blogController.deleteSaveBlog);
router.delete("/del/:id", blogController.deleteBlog);

export default router;
