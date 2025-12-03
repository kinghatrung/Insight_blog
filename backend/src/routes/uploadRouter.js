import { Router } from "express";

import upload from "../middlewares/multer.js";
import uploadController from "../controllers/uploadController.js";

const router = Router();

router.post("/", upload.single("thumbnail"), uploadController.uploadImage);

export default router;
