import express, { Application, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "./config/env.js";
import AppError from "./utils/AppError.js";
import errorHandler from "./middleware/errorMiddleware.js";
import authRouter from "./routes/auth.route.js";
import propertyRouter from "./routes/property.route.js";
import bookingRouter from "./routes/booking.route.js";

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

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/properties", propertyRouter);
app.use("/api/v1/bookings", bookingRouter);

// Base Route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "StayNest API is running 🏡" });
});

// Catch all undefined routes
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
});

// Global error handler — must be last, must have 4 params
app.use(errorHandler);

export default app;
