import { Router } from "express";
import {
  createBook,
  deleteBook,
  getSingleBook,
  listBooks,
  updateBook,
} from "./bookController";
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
bookRouter.patch(
  "/:bookId",
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
  updateBook
);
bookRouter.get("/", listBooks);
bookRouter.get("/:id", getSingleBook);
bookRouter.delete("/:id", authMiddleware, deleteBook);

export default bookRouter;
