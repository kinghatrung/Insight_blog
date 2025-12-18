import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connect } from "./config/db.js";
import authMiddleware from "./middlewares/authMiddleware.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import blogRouter from "./routes/blogRouter.js";
import uploadRouter from "./routes/uploadRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
import blogViewsRouter from "./routes/blogViewsRouter.js";

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

// const delayMiddleware =
//   (ms = 2000) =>
//   (req, res, next) => {
//     setTimeout(next, ms);
//   };
// app.use(delayMiddleware(100000));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/blog-views", blogViewsRouter);

app.use(authMiddleware.isAuthorized);
app.use("/api/users", userRouter);
app.use("/api/upload", uploadRouter);

connect().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
});
