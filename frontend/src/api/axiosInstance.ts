import axios from "axios"
import env from "@/config/env"
import { useAuthStore } from "@/stores/authStore"
import { refreshTokenApi } from "./authApi"

const axiosInstance = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true, // sends HttpOnly cookie automatically
})

// Attach access token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto-refresh access token on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      try {
        const data = await refreshTokenApi();

        useAuthStore.getState().setAccessToken(data.data!.accessToken)
        original.headers.Authorization = `Bearer ${data.data!.accessToken}`
        return axiosInstance(original) // retry original request
      } catch {
        useAuthStore.getState().logout()
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
