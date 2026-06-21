import jwt, { SignOptions } from "jsonwebtoken";
import env from "../config/env.js";
import { Types } from "mongoose";

export const generateAccessToken = (userId: Types.ObjectId | string) => {
  return jwt.sign({ id: userId }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"],
  });
};

export const generateRefreshToken = (userId: Types.ObjectId | string) => {
  return jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"],
  });
};
