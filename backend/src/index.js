import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { initRedis, closeRedis } from "./config/redis.js";
import { connect } from "./config/db.js";
import { startViewCountSyncJob } from "./jobs/syncViewCounts.js";
import authMiddleware from "./middlewares/authMiddleware.js";
import blogViewService from "./services/blogViewService.js";

import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import blogRouter from "./routes/blogRouter.js";
import uploadRouter from "./routes/uploadRouter.js";
import categoryRouter from "./routes/categoryRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

await initRedis();
startViewCountSyncJob();

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
app.use("/api/categories", categoryRouter);
app.use("/api/blogs", blogRouter);

app.use(authMiddleware.isAuthorized);
app.use("/api/users", userRouter);
app.use("/api/upload", uploadRouter);

connect().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
});

// Graceful shutdown
const shutdown = async () => {
  console.log("Shutting down... syncing view counts");
  try {
    await blogViewService.syncAllViewCounts();
    await closeRedis();
    process.exit(0);
  } catch (error) {
    console.error("Shutdown error:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
