import { Request, Response } from "express";

import PostService from "../services/PostService";

class PostController {
  async listPosts(req: any, res: Response) {
    try {
      const Posts = await PostService.getPosts(req.query.type);
      res.status(201).json(Posts);
    } catch (err) {
      res.status(401).json(err);
    }
  }

  async getPostById(req: Request, res: Response) {
    try {
      const Post = await PostService.getPostById(req.params.id);
      res.status(201).json(Post);
    } catch (err) {
      res.status(401).json(err);
    }
  }

  async createPost(req: Request, res: Response) {
    try {
      const msg = await PostService.createPost(req.body);
      res.status(201).json(msg);
    } catch (err) {
      res.status(401).json(err);
    }
  }
  async updatePost(req: Request, res: Response) {
    try {
      const msg = await PostService.updatePost(req.body);
      res.status(201).json(msg);
    } catch (err) {
      res.status(401).json(err);
    }
  }

  async deletePost(req: Request, res: Response) {
    try {
      const msg = await PostService.deletePost(req.params.id);
      res.status(201).json(msg);
    } catch (err) {
      res.status(401).json(err);
    }
  }
}

export default new PostController();
