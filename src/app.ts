import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();

//Routes

app.use(globalErrorHandler);
export default app;
