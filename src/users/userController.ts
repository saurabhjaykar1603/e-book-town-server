import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const createUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      const error = createHttpError(400, "All Field are required");
      return next(error);
    }
    // Create user logic here
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
  }
};
export { createUser };
