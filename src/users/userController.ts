import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import User from "./userModel";
import bcrypt from "bcrypt"

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      const error = createHttpError(400, "All Field are required");
      return next(error);
    }
    // Create user logic here
    const user = await User.findOne({ email: email });
    if (user) {
      const error = createHttpError(400, "Email already exist");
      return next(error);
    }
    const hasshPassword = await bcrypt.hash(password,10,)
  } catch (error) {
    console.log(error);
  }
};
export { createUser };
