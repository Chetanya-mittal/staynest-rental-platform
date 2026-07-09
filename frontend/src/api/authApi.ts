import axios from "axios"
import env from "@/config/env"
import axiosInstance from "./axiosInstance"
import type { User, ApiResponse } from "@/types"

interface AuthResponseData extends User {
  accessToken: string
}

export const registerApi = async (payload: {
  name: string
  email: string
  password: string
}): Promise<ApiResponse<AuthResponseData>> => {
  const res = await axiosInstance.post<ApiResponse<AuthResponseData>>(
    "/auth/register",
    payload
  )
  return res.data
}

export const loginApi = async (payload: {
  email: string
  password: string
}): Promise<ApiResponse<AuthResponseData>> => {
  const res = await axiosInstance.post<ApiResponse<AuthResponseData>>(
    "/auth/login",
    payload
  )
  return res.data
}

export const logoutApi = async (): Promise<void> => {
  await axiosInstance.post("/auth/logout")
}

export const logoutAllApi = async (): Promise<void> => {
  await axiosInstance.post("/auth/logout-all")
}

export const getMeApi = async (): Promise<ApiResponse<User>> => {
  const res = await axiosInstance.get<ApiResponse<User>>("/auth/me")
  return res.data
}

// Uses plain axios (not axiosInstance) — avoids triggering the interceptor loop
export const refreshTokenApi = async (): Promise<ApiResponse<{ accessToken: string }>> => {
  const res = await axios.post<ApiResponse<{ accessToken: string }>>(
    `${env.VITE_API_URL}/auth/refresh`,
    {},
    { withCredentials: true }
  )
  return res.data
}
