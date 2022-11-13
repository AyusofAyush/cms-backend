import { Request, Response } from "express";
import UserService from "../services/UserService";

class UserController {
  async register(req: Request, res: Response) {
    try {
      const user = await UserService.register({
        email: req.body.email,
        password: String(req.body.password),
      });
      res.status(201).json(user);
    } catch (err) {
      res.status(401).json(err);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const token = await UserService.login({
        email: req.body.email,
        password: String(req.body.password),
      });
      res.status(201).json(token);
    } catch (err) {
      res.status(401).json(err);
    }
  }
}

export default new UserController();
