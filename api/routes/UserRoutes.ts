import * as express from "express";
import UserController from "../controllers/UserController";

export default class UserRoutes {
  constructor(private app: express.Application) {}

  configureRoutes(): express.Application {
    this.app.route("/v1/register").post(UserController.register);
    this.app.route("/v1/login").post(UserController.login);
    return this.app;
  }
}
