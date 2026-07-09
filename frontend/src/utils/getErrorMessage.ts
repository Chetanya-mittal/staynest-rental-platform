import axios from "axios"

export function getErrorMessage(error: unknown): string {
  let message = "Something went wrong. Please try again."

  if (axios.isAxiosError(error)) {
    message = error.response?.data?.message ?? error.message
  } else if (error instanceof Error) {
    message = error.message
  }

  return message
}
