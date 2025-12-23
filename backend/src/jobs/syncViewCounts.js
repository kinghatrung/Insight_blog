import cron from "node-cron";
import blogViewService from "../services/blogViewService.js";

export const startViewCountSyncJob = () => {
  // Chạy mỗi 5 phút: */5 * * * *
  cron.schedule("*/30 * * * *", async () => {
    try {
      console.log("[CRON] Starting view count sync...");
      const count = await blogViewService.syncAllViewCounts();
      console.log(`[CRON] Synced ${count} blogs`);
    } catch (error) {
      console.error("[CRON] Sync error:", error);
    }
  });

  console.log("✅ View count sync job started (every 30 minutes)");
};
