import { Router } from "express";
import { createBook } from "./bookController";

const bookRouter = Router();
// routes
bookRouter.post("/create", createBook);

export default bookRouter;
