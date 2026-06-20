import dotenv from "dotenv";
import { z } from "zod";

// Load environment variables from the .env file into process.env
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(5000),

  MONGO_URI: z.string().min(1, "MONGO_URI is required"),

  JWT_ACCESS_SECRET: z
    .string()
    .min(32, "JWT_ACCESS_SECRET should be at least 32 characters"),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, "JWT_REFRESH_SECRET should be at least 32 characters"),
  ACCESS_TOKEN_EXPIRY: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRY: z.string().default("7d"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables: ");

  parsed.error.issues.forEach((issue) => {
    const variableName = issue.path.join('.'); 
    console.error(`${variableName}: ${issue.message}`);
  });

  process.exit(1);
}

const env = Object.freeze(parsed.data);

export default env;
