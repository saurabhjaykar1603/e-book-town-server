import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import User from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

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
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashPassword });
    await newUser.save();

    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "2h",
    });

    return res.status(201).json({
      accessToken: token,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
export { createUser };
