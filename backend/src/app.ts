import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "./config/env.js";

const app: Application = express();

// Middleware
app.use(helmet()); // for security
if (env.NODE_ENV === "development") {
  app.use(morgan("dev")); // for concise logs
} else {
  app.use(morgan("combined")); // for detailed logs
}
app.use(cors()); // to allow frontend to make request to backend
app.use(express.json()); // to read JSON from request body
app.use(express.urlencoded({ extended: true })); // to read HTML form data
app.use(cookieParser()); // to read req.cookies

// Base Route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "StayNest API is running 🏡" });
});

export default app;
