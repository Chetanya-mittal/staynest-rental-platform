export interface User {
  _id: string
  name: string
  email: string
  role: "guest" | "host" | "admin"
  avatar: string
}

export interface Location {
  city: string
  state: string
  country: string
}

export interface Property {
  _id: string
  host: User
  title: string
  description: string
  location: Location
  pricePerNight: number
  maxGuests: number
  bedrooms: number
  bathrooms: number
  amenities: string[]
  images: string[]
  isAvailable: boolean
  createdAt: string
}

export interface PropertyWithoutPopulate {
  _id: string
  host: string
  title: string
  description: string
  location: Location
  pricePerNight: number
  maxGuests: number
  bedrooms: number
  bathrooms: number
  amenities: string[]
  images: string[]
  isAvailable: boolean
  createdAt: string
}

export interface PropertyPayload {
  title: string
  description: string
  location: Location
  pricePerNight: number
  maxGuests: number
  bedrooms: number
  bathrooms: number
  amenities?: string[]
  images?: string[]
}

export interface Booking {
  _id: string
  property: {
    _id: string
    host: string
    title: string
    location: Location
    pricePerNight: number
    images: string[]
  }
  guest: { _id: string; name: string; email: string }
  checkIn: string
  checkOut: string
  totalPrice: number
  totalNights: number
  guestsCount: number
  status: "pending" | "confirmed" | "cancelled"
  createdAt: string
}

export interface ApiResponse<T> {
  statusCode: number
  success: boolean
  message: string
  data: T | null
}

export interface PaginatedPropertiesData {
  properties: PropertyWithoutPopulate[]
  currentPage: number
  totalPages: number
  totalProperties: number
  hasNextPage: boolean
}
