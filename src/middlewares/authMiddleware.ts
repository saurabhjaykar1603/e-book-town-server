import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";

export interface AuthRequest extends Request {
  userId: string;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (!token) {
    const error = createHttpError(401, "Authorization token is required");
    return next(error);
  }
  try {
    const parseToken = token.split(" ").at(-1);
    if (!parseToken) {
      const error = createHttpError(401, "Invalid token format");
      return next(error);
    }
    const decode = verify(parseToken, config.jwtSecret as string);
    console.log("decoded token", decode);
    const _req = req as AuthRequest;
    _req.userId = decode.sub as string;
    next();
  } catch (error) {
    const httpError = createHttpError(401, "Invalid token Or expired");
    return next(httpError);
  }
};
export default authMiddleware;
