import { Router } from "express";
import userController from "../controllers/userController.js";

const router = Router();

router.get("/", userController.getUsers);
router.get("/me", userController.authMe);
router.post("/user", userController.createUser);
router.put("/user/:id", userController.editUser);
router.delete("/del/:id", userController.deleteUser);

export default router;
