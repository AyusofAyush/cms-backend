import express from "express";
import PostController from "../controllers/PostController";

export default class PostRoutes {
  constructor(private app: express.Application) {}

  configureRoutes(): express.Application {
    this.app.route("/v1/posts").get(PostController.listPosts);
    this.app
      .route("/v1/post/:id")
      .get(PostController.getPostById)
      .delete(PostController.deletePost);
    this.app
      .route("/v1/post")
      .post(PostController.createPost)
      .put(PostController.updatePost);
    return this.app;
  }
}
