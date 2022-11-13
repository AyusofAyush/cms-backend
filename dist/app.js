"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const PostRoutes_1 = __importDefault(require("./routes/PostRoutes"));
const TokenGuard_1 = require("./controllers/TokenGuard");
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
dotenv_1.default.config();
mongoose_1.default.connect("mongodb://localhost:27017/cms-db", () => {
    console.log("connection to mongodb done !!!");
});
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
// Helmet helps for securing Express apps by setting various HTTP headers
app.use((0, helmet_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json()); // middleware
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.status(200).send("Hello World!!");
});
new UserRoutes_1.default(app).configureRoutes();
// middleware
app.use(TokenGuard_1.tokenGuard);
new PostRoutes_1.default(app).configureRoutes();
// globally catching unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at promise " + promise + " reason ", reason);
    console.log("Server is still running...\n");
});
// globally catching unhandled exceptions
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception is thrown with ", error + "\n");
    process.exit();
});
server.listen(process.env.PORT || 8000, () => console.log("server started!!! on port", process.env.PORT || 8000));
//# sourceMappingURL=app.js.map