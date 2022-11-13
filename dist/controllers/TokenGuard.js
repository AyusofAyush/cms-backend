"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenGuard = void 0;
const UserService_1 = __importDefault(require("../services/UserService"));
function getTokenFromHeaders(headers) {
    const header = headers.authorization;
    if (!header)
        return header;
    return header.split(" ")[1];
}
function tokenGuard(req, res, next) {
    const token = getTokenFromHeaders(req.headers || req.query.token || req.body.token || "");
    const hasAccess = UserService_1.default.verifyToken(token);
    hasAccess
        .then((valid) => {
        if (!valid)
            return res.status(403).send({ message: "No access" });
        next();
    })
        .catch((err) => {
        console.log("Invalid Token. Please relogin", err);
        return res.status(404).send({ message: "Invalid Token" });
    });
}
exports.tokenGuard = tokenGuard;
//# sourceMappingURL=TokenGuard.js.map