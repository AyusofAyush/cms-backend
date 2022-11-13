"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserController_1 = __importDefault(require("../controllers/UserController"));
class UserRoutes {
    constructor(app) {
        this.app = app;
    }
    configureRoutes() {
        this.app.route("/v1/register").post(UserController_1.default.register);
        this.app.route("/v1/login").post(UserController_1.default.login);
        return this.app;
    }
}
exports.default = UserRoutes;
//# sourceMappingURL=UserRoutes.js.map