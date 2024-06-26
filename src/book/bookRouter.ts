import { Router } from "express";
import { createBook } from "./bookController";
import multer from "multer";
import path from "node:path";
import authMiddleware from "../middlewares/authMiddleware";

const bookRouter = Router();

const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: {
    fileSize: 3e7,
  },
});
// routes
bookRouter.post(
  "/create",
  authMiddleware,
  upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
    {
      name: "file",
      maxCount: 1,
    },
  ]),
  createBook
);

export default bookRouter;
