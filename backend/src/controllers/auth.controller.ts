import { Response, RequestHandler } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import { User } from "../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";
import { Session } from "../models/session.model.js";

// Reusable helper to set the refresh token cookie
const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie("refreshToken", token, {
    httpOnly: true, // JS cannot read this
    secure: env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict", // prevents CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });
};

// Reusable helper to hash the refreshToken
const hashRefreshToken = (refreshToken: string): string => {
  return crypto.createHash("sha256").update(refreshToken).digest("hex");
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = registerSchema.parse(req.body);

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({ name, email, password: hashedPassword });

  const refreshToken = generateRefreshToken(user._id);

  const refreshTokenHash = hashRefreshToken(refreshToken);

  const session = await Session.create({
    userId: user._id,
    refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  const accessToken = generateAccessToken(user._id, session._id);

  setRefreshTokenCookie(res, refreshToken);

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken, // store in frontend state memory
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const refreshToken = generateRefreshToken(user._id);

  const refreshTokenHash = hashRefreshToken(refreshToken);

  const session = await Session.create({
    userId: user._id,
    refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  const accessToken = generateAccessToken(user._id, session._id);

  setRefreshTokenCookie(res, refreshToken);

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
    },
  });
});

// @desc    Get logged in user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe: RequestHandler = (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Protected (Refresh Token Required)
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError("No refresh token", 401);
  }

  const decoded = jwt.verify(
    refreshToken,
    env.JWT_REFRESH_SECRET,
  ) as jwt.JwtPayload;

  const refreshTokenHash = hashRefreshToken(refreshToken);

  const session = await Session.findOne({
    refreshTokenHash,
    revoke: false,
  });

  if (!session) {
    throw new AppError("Invalid refresh token", 401);
  }

  const newRefreshToken = generateRefreshToken(decoded.id);

  const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

  session.refreshTokenHash = newRefreshTokenHash;
  await session.save();

  const newAccessToken = generateAccessToken(decoded.id, session._id);

  setRefreshTokenCookie(res, newRefreshToken);

  res
    .status(200)
    .json({ success: true, data: { accessToken: newAccessToken } });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Protected (Refresh Token Required)
export const logoutUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError("No refresh token", 401);
  }

  const refreshTokenHash = hashRefreshToken(refreshToken);

  const session = await Session.findOne({
    refreshTokenHash,
    revoke: false,
  });

  if (!session) {
    throw new AppError("Invalid refresh token", 401);
  }

  session.revoke = true;
  await session.save();

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// @desc    Logout all
// @route   POST /api/auth/logout-all
// @access  Protected (Refresh Token Required)
export const logoutAll = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError("No refresh token", 401);
  }

  const decoded = jwt.verify(
    refreshToken,
    env.JWT_REFRESH_SECRET,
  ) as jwt.JwtPayload;

  await Session.updateMany(
    {
      userId: decoded.id,
      revoke: false,
    },
    {
      revoke: true,
    },
  );

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Logged out from all devices successfully",
  });
});
