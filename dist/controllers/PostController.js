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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PostService_1 = __importDefault(require("../services/PostService"));
class PostController {
    listPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Posts = yield PostService_1.default.getPosts(req.query.type);
                res.status(201).json(Posts);
            }
            catch (err) {
                res.status(401).json(err);
            }
        });
    }
    getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Post = yield PostService_1.default.getPostById(req.params.id);
                res.status(201).json(Post);
            }
            catch (err) {
                res.status(401).json(err);
            }
        });
    }
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const msg = yield PostService_1.default.createPost(req.body);
                res.status(201).json(msg);
            }
            catch (err) {
                res.status(401).json(err);
            }
        });
    }
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const msg = yield PostService_1.default.updatePost(req.body);
                res.status(201).json(msg);
            }
            catch (err) {
                res.status(401).json(err);
            }
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const msg = yield PostService_1.default.deletePost(req.params.id);
                res.status(201).json(msg);
            }
            catch (err) {
                res.status(401).json(err);
            }
        });
    }
}
exports.default = new PostController();
//# sourceMappingURL=PostController.js.map