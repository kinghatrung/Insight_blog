import { createClient } from "redis";

let client;

const initRedis = async () => {
  if (client) return client;

  client = createClient({
    url: process.env.REDIS_URL,
  });

  client.on("connect", () => console.log("REDIS CONNECTED"));
  client.on("end", () => console.log("REDIS CONNECTION ENDED"));
  client.on("reconnecting", () => console.log("REDIS RECONNECTING..."));
  client.on("error", (err) => console.error("REDIS CLIENT ERROR", err));

  await client.connect();

  return client;
};

const getRedis = () => {
  if (!client) {
    throw new Error("Redis client is not initialized. Call initRedis() first.");
  }
  return client;
};

const closeRedis = async () => {
  if (client) {
    await client.quit();
    client = null;
    console.log("Redis connection closed.");
  }
};

export { initRedis, getRedis, closeRedis };
