import { format } from "date-fns"

// Calculate number of nights between two dates
export const calculateNights = (
  checkIn: string | Date,
  checkOut: string | Date
) => {
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const diffMs = end.getTime() - start.getTime()
  const diffNights = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  return diffNights
}

// for backend
export const formatDateForApi = (date: string | Date): string => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

// for frontend
export const formatDate = (date?: Date) => {
  return date ? format(date, "MMM dd, yyyy") : "";
};
