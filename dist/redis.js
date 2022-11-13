"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
class redisClient {
    constructor() {
        this.config = { url: "redis://127.0.0.1:6379" };
        this.client = (0, redis_1.createClient)(this.config);
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
        this.client.on("error", function (err) {
            console.log("Something went wrong " + err);
        });
        this.client.on("end", function () {
            console.log("\nRedis client disconnected");
            console.log("Server is going down now...");
            process.exit();
        });
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("Someone is calling set", key, value);
            yield this.client.set(key, value);
            return "done";
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("Someone is calling GET", key);
            const res = yield this.client.get(key);
            return JSON.parse(res);
        });
    }
    del(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.del(key);
            return "done";
        });
    }
    close() {
        this.client.close();
    }
}
exports.default = redisClient;
//# sourceMappingURL=redis.js.map