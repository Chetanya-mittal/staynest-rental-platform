import { z } from "zod"

export const registerSchema = z
  .object({
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

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // shows the error under this specific field
  })

export type RegisterType = z.infer<typeof registerSchema>

export const loginSchema = z.object({
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
})

export type LoginType = z.infer<typeof loginSchema>
