import { Router } from "express";
import { createUser,loginUser } from "./userController";

const userRouter = Router();
// routes
userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);

export default userRouter;
