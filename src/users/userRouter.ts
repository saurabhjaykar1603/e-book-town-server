import { Router } from "express";
import { createUser } from "./userController";

const userRouter = Router();
// routes
userRouter.post("/register", createUser);

export default userRouter;
