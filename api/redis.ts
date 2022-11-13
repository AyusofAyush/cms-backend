import { createClient } from "redis";
require("dotenv").config();

class redisClient {
  client: any;
  constructor() {
    this.client = createClient({
      socket: { host: process.env.REDIS_HOST, port: 6379 },
    });
    this.client.connect();
    this.client.on("connect", function () {
      console.log("Redis Database connected" + "\n");
    });

    this.client.on("reconnecting", function () {
      console.log("Redis client reconnecting");
    });

    this.client.on("ready", function () {
      console.log("Redis client is ready");
    });

    this.client.on("error", function (err: any) {
      console.log("Something went wrong " + err);
    });

    this.client.on("end", function () {
      console.log("\nRedis client disconnected");
      console.log("Server is going down now...");
      process.exit();
    });
  }
  async set(key: string, value: string) {
    // console.log("Someone is calling set", key, value);
    await this.client.set(key, value);
    return "done";
  }
  async get(key: string) {
    // console.log("Someone is calling GET", key);
    const res = await this.client.get(key);
    return JSON.parse(res);
  }
  async del(key: string) {
    await this.client.del(key);
    return "done";
  }
  close() {
    this.client.close();
  }
}

export default redisClient;
