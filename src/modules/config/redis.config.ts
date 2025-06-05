import { RedisClient } from "bun";
import Elysia from "elysia";

const redis = new RedisClient(
    process.env.REDIS_URL || "redis://127.0.0.1:6379"
);

export const RedisPlugin = new Elysia({ name: "redis-plugin" })
  .decorate("redis", redis)
  .onStart(() => {
    console.log("🔌 Redis client initialized");
  });