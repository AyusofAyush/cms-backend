import express, { Request, Response } from "express";
import { Server, createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";

import mongoose from "mongoose";
import UserRoutes from "./routes/UserRoutes";
import PostRoutes from "./routes/PostRoutes";
import { tokenGuard } from "./controllers/TokenGuard";
import bodyParser from "body-parser";
import helmet from "helmet";

dotenv.config();

mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/cms-db`, () => {
  console.log("connection to mongodb done !!!");
});

const app: express.Application = express();

const server: Server = createServer(app);

// Helmet helps for securing Express apps by setting various HTTP headers
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json()); // middleware
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello World!!");
});

new UserRoutes(app).configureRoutes();

// middleware
app.use(tokenGuard);

new PostRoutes(app).configureRoutes();

// globally catching unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error(
    "Unhandled Rejection at promise " + promise + " reason ",
    reason,
  );
  console.log("Server is still running...\n");
});

// globally catching unhandled exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception is thrown with ", error + "\n");
  process.exit();
});

server.listen(process.env.PORT || 8000, () =>
  console.log("server started!!! on port", process.env.PORT || 8000),
);
