import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connect } from "./config/db.js";
import authMiddleware from "./middlewares/authMiddleware.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import blogRouter from "./routes/blogRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/blogs", blogRouter);

app.use(authMiddleware.isAuthorized);
app.use("/api/users", userRouter);

connect().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
});
