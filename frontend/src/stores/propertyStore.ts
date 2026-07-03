import { create } from "zustand"
import type { Property } from "@/types" 

interface PropertyStore {
  properties: Property[]
  selectedProperty: Property | null
  isLoading: boolean
  error: string | null
  totalPages: number
  currentPage: number
  totalProperties: number

  setProperties: (data: {
    properties: Property[]
    totalPages: number
    currentPage: number
    totalProperties: number
  }) => void
  setSelectedProperty: (property: Property | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export const usePropertyStore = create<PropertyStore>((set) => ({
  // Initial State
  properties: [],
  selectedProperty: null,
  isLoading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  totalProperties: 0,

  // Actions
  setProperties: (data) =>
    set({
      properties: data.properties,
      totalPages: data.totalPages,
      currentPage: data.currentPage,
      totalProperties: data.totalProperties,
    }),
  setSelectedProperty: (property) => set({ selectedProperty: property }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}))
