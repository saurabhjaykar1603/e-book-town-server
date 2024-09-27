import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./users/userRouter";
import bookRouter from "./book/bookRouter";
import cors from "cors";
import { config } from "./config/config";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: config.frontedDomain,
    credentials: true,
  })
);
//Routes
app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

app.use(globalErrorHandler);
export default app;
