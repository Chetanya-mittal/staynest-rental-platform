import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "Name is required" : "Name must be text",
    })
    .min(1, { error: "Name cannot be empty" })
    .trim(),

  email: z
    .email({
      error: (issue) =>
        issue.input === undefined
          ? "Email is required"
          : "Invalid email format",
    })
    .trim()
    .toLowerCase(),

  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Password is required"
          : "Password must be text",
    })
    .min(6, { error: "Password must be at least 6 characters" }),
});

export type RegisterType = z.infer<typeof registerSchema>;

export const loginSchema = registerSchema.pick({
  email: true,
  password: true,
});

export type LoginType = z.infer<typeof loginSchema>;
