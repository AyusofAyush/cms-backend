"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PostController_1 = __importDefault(require("../controllers/PostController"));
class PostRoutes {
    constructor(app) {
        this.app = app;
    }
    configureRoutes() {
        this.app.route("/v1/posts").get(PostController_1.default.listPosts);
        this.app
            .route("/v1/post/:id")
            .get(PostController_1.default.getPostById)
            .delete(PostController_1.default.deletePost);
        this.app
            .route("/v1/post")
            .post(PostController_1.default.createPost)
            .put(PostController_1.default.updatePost);
        return this.app;
    }
}
exports.default = PostRoutes;
//# sourceMappingURL=PostRoutes.js.map