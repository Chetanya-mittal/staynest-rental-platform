import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import env from "../config/env.js";
import AppError from "../utils/AppError.js";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: object[] | undefined;

  // Custom application errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Zod validation errors
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";

    errors = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
  }

  // Mongoose CastError
  else if (err?.name === "CastError") {
    statusCode = 404;
    message = "Resource not found";
  }

  // Mongoose duplicate key
  else if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    err.code === 11000
  ) {
    statusCode = 409;

    const field =
      "keyValue" in err && err.keyValue && typeof err.keyValue === "object"
        ? Object.keys(err.keyValue)[0]
        : "Field";

    message = `${field} already exists`;
  }

  // Mongoose validation error
  else if (err?.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
  }

  // JWT errors
  else if (err?.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err?.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  if (env.NODE_ENV !== "production") {
    console.error(err);
  }

  res.status(statusCode).json({
    statusCode,
    success: false,
    message,
    errors,
    ...(env.NODE_ENV === "development" && {
      stack: err instanceof Error ? err.stack : undefined,
    }),
  });
};

export default errorHandler;
