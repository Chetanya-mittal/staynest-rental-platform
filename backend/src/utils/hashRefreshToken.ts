import crypto from "crypto";

// Reusable helper to hash the refreshToken
export const hashRefreshToken = (refreshToken: string): string => {
  return crypto.createHash("sha256").update(refreshToken).digest("hex");
};