import axiosInstance from "./axiosInstance"
import type { ApiResponse, Booking } from "@/types"

export interface CreateBookingPayload {
  propertyId: string
  checkIn: string
  checkOut: string
  guestsCount: number
}

export interface PropertyBookingDates {
  checkIn: string
  checkOut: string
  status: "pending" | "confirmed" | "cancelled"
}

export const createBookingApi = async (
  payload: CreateBookingPayload
): Promise<ApiResponse<{ booking: Booking }>> => {
  const res = await axiosInstance.post<ApiResponse<{ booking: Booking }>>("/bookings", payload)
  return res.data
}

export const getPropertyBookingsApi = async (
  propertyId: string
): Promise<ApiResponse<{ bookings: PropertyBookingDates[] }>> => {
  const res = await axiosInstance.get<ApiResponse<{ bookings: PropertyBookingDates[] }>>(`/bookings/property/${propertyId}`)
  return res.data
}

export const getMyBookingsApi = async (): Promise<ApiResponse<{ bookings: Booking[] }>> => {
  const res = await axiosInstance.get<ApiResponse<{ bookings: Booking[] }>>("/bookings/my")
  return res.data
}

export const cancelBookingApi = async (
  bookingId: string
): Promise<ApiResponse<null>> => {
  const res = await axiosInstance.delete<ApiResponse<null>>(`/bookings/${bookingId}`)
  return res.data
}
