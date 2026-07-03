import { z } from "zod"

const envSchema = z.object({
  VITE_API_URL: z.url().default("http://localhost:5000/api/v1"),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  console.error("\nInvalid frontend environment variables: \n")
  console.error(z.prettifyError(parsed.error))
  throw new Error(
    "Invalid frontend environment variables. Check your .env file."
  )
}

const env = Object.freeze(parsed.data)

export default env
