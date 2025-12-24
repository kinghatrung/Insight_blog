import cron from "node-cron";
import blogViewService from "../services/blogViewService.js";

export const startViewCountSyncJob = () => {
  // Chạy mỗi 1 tiếng: 0 * * * *
  cron.schedule("0 * * * *", async () => {
    try {
      console.log("[CRON] Starting view count sync...");
      const count = await blogViewService.syncAllViewCounts();
      console.log(`[CRON] Synced ${count} blogs`);
    } catch (error) {
      console.error("[CRON] Sync error:", error);
    }
  });

  console.log("✅ View count sync job started (every 1 hour)");
};
