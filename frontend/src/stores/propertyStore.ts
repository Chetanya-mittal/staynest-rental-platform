import { create } from "zustand"
import type { Property } from "@/types"

interface PropertyStore {
  properties: Property[]
  selectedProperty: Property | null
  totalPages: number
  currentPage: number
  totalProperties: number
  hasNextPage: boolean

  setProperties: (data: {
    properties: Property[]
    totalPages: number
    currentPage: number
    totalProperties: number
    hasNextPage: boolean
  }) => void
  setSelectedProperty: (property: Property | null) => void
}

export const usePropertyStore = create<PropertyStore>((set) => ({
  // Initial State
  properties: [],
  selectedProperty: null,
  totalPages: 1,
  currentPage: 1,
  totalProperties: 0,
  hasNextPage: false,

  // Actions
  setProperties: (data) =>
    set({
      properties: data.properties,
      totalPages: data.totalPages,
      currentPage: data.currentPage,
      totalProperties: data.totalProperties,
      hasNextPage: data.hasNextPage,
    }),
  setSelectedProperty: (property) => set({ selectedProperty: property }),
}))
