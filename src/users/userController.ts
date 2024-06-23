import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    const error = createHttpError(400, "All Field are required");
    return next(error);
  }
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const error = createHttpError(
        400,
        "User already exists with this email."
      );
      return next(error);
    }
  } catch (err) {
    return next(createHttpError(500, "Error while getting user"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  let newUser: User;
  try {
    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (err) {
    return next(createHttpError(500, "Error while creating user."));
  }

  try {
    const token = sign({ userId: newUser._id }, config.jwtSecret as string, {
      expiresIn: "1h",
    });
    res
      .status(201)
      .json({ accessToken: token, message: "User Created Successfully" });
  } catch (error) {
    return next(createHttpError(500, "Error while signing the jwt token"));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Validate request body
  if (!email || !password) {
    return next(createHttpError(400, "All fields are required"));
  }

  try {
    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createHttpError(401, "Invalid credentials"));
    }

    // Generate JWT token
    const token = sign({ sub: user._id }, config.jwtSecret as string, {
      expiresIn: "1h",
    });

    // Respond with the token
    return res.status(200).json({
      accessToken: token,
      message: "User logged in successfully",
    });
  } catch (error) {
    // Handle any errors
    if (error instanceof createHttpError.HttpError) {
      return next(error);
    }
    return next(createHttpError(500, "Error while logging in"));
  }
};

export { createUser, loginUser };
