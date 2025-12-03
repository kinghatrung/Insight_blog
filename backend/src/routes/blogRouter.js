import { Router } from "express";
import blogController from "../controllers/blogController.js";

const router = Router();

router.get("/", blogController.getBlogs);
router.get("/:id", blogController.getBlog);
router.post("/blog", blogController.createBlog);
router.put("/blog/:id", blogController.editBlog);
router.delete("/del/:id", blogController.deleteBlog);

export default router;
