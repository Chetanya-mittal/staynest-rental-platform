import axiosInstance from "./axiosInstance"
import type { Property, ApiResponse, PaginatedPropertiesData } from "@/types"

export interface PropertyFilters {
  city?: string
  state?: string
  country?: string
  minPrice?: string
  maxPrice?: string
  guests?: string
  page?: number
  limit?: number
}

export const getAllPropertiesApi = async (
  filters: PropertyFilters
): Promise<ApiResponse<PaginatedPropertiesData>> => {
  // Remove empty/undefined values so we don't send ?city=&minPrice= etc.
  const cleanParams = Object.fromEntries(
    Object.entries(filters).filter(
      ([, value]) => value !== "" && value !== undefined
    )
  )

  const res = await axiosInstance.get<ApiResponse<PaginatedPropertiesData>>(
    "/properties",
    {
      params: cleanParams,
    }
  )
  return res.data
}

export const getPropertyByIdApi = async (
  id: string
): Promise<ApiResponse<{ property: Property }>> => {
  const res = await axiosInstance.get<ApiResponse<{ property: Property }>>(
    `/properties/${id}`
  )
  return res.data
}
