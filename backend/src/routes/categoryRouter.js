import { Router } from "express";

import categoryController from "../controllers/categoryController.js";

const router = Router();

router.get("/", categoryController.getCategories);
router.post("/category", categoryController.createCategory);
router.put("/category/:id", categoryController.editCategory);
router.delete("/del/:id", categoryController.deleteCategory);

export default router;
