import dotenv from "dotenv";
dotenv.config();

import Redis from "ioredis";

const redis = new Redis.default(process.env.REDIS_URL!, {
  maxRetriesPerRequest: 3,
  enableOfflineQueue: false,
});

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err: Error) => {
  console.error("Redis error:", err.message);
});

export default redis;
