import { IncomingHttpHeaders } from "http";
import { NextFunction, Request, Response } from "express";
import UserService from "../services/UserService";

function getTokenFromHeaders(headers: IncomingHttpHeaders) {
  const header = headers.authorization as string;
  if (!header) return header;
  return header.split(" ")[1];
}

export function tokenGuard(req: Request, res: Response, next: NextFunction) {
  const token = getTokenFromHeaders(
    req.headers || req.query.token || req.body.token || "",
  );
  const hasAccess = UserService.verifyToken(token);
  hasAccess
    .then((valid) => {
      if (!valid) return res.status(403).send({ message: "No access" });
      next();
    })
    .catch((err) => {
      console.log("Invalid Token. Please relogin", err);
      return res.status(404).send({ message: "Invalid Token" });
    });
}
