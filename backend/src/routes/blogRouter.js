import { Router } from "express";
import blogController from "../controllers/blogController.js";

const router = Router();

router.get("/", blogController.getBlogs);
router.get("/active", blogController.getBlogsActive);
router.get("/:slug", blogController.getBlogBySlug);
router.post("/blog", blogController.createBlog);
router.put("/blog/:id", blogController.editBlog);
router.delete("/del/:id", blogController.deleteBlog);

export default router;
