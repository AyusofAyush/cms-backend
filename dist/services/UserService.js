"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../model/User"));
const jwt = __importStar(require("jsonwebtoken"));
const bcrypt = require("bcrypt");
const redis_1 = __importDefault(require("../redis"));
class UserService {
    constructor() {
        this.__jwtSecret = "topsecret123";
        this.redisClient = new redis_1.default();
    }
    register({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(email && password))
                return Promise.reject("Invalid Creds");
            const cacheUser = yield this.redisClient.get(email);
            if (cacheUser) {
                return Promise.reject("User Already Exist");
            }
            // const userExist = await User.findOne({ email: email });
            // if (userExist) return Promise.reject("User Already Exist");
            const user = new User_1.default({ email, password });
            const salt = yield bcrypt.genSalt(10);
            user.password = yield bcrypt.hash(password, salt);
            user.save((err, user) => {
                if (err) {
                    console.log("Error while saving User", err);
                    return Promise.reject(err);
                }
                this.redisClient.set(user.email, JSON.stringify(user));
                console.log("Save User in DB", user.email);
                return Promise.resolve(user.email);
            });
        });
    }
    login({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheLogin = yield this.redisClient.get(`${email}-login`);
            if (cacheLogin)
                return cacheLogin;
            const user = yield User_1.default.findOne({ email: email });
            if (user) {
                const validPassword = yield bcrypt.compare(password, user.password);
                if (validPassword) {
                    console.log("User Successfully logged in", email);
                    const signature = yield jwt.sign({
                        id: user._id,
                        email: user.email,
                        iat: Date.now(),
                        iss: "intuit",
                    }, this.__jwtSecret);
                    yield this.redisClient.set(`${email}-login`, JSON.stringify({ token: signature }));
                    return Promise.resolve({
                        token: signature,
                    });
                }
                else {
                    return Promise.reject("Invalid Email/Password");
                }
            }
            else {
                return Promise.reject("User does not exist");
            }
        });
    }
    // Used for middleware
    verifyToken(token) {
        return new Promise((resolve, reject) => {
            try {
                const decoded = jwt.verify(token, this.__jwtSecret);
                if (decoded) {
                    resolve(true);
                }
            }
            catch (err) {
                // console.log("err while decoded token", err);
                reject(false);
            }
        });
    }
}
exports.default = new UserService();
//# sourceMappingURL=UserService.js.map