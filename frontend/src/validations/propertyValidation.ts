import { z } from 'zod';

export const propertySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  pricePerNight: z.coerce.number().min(1, 'Price must be at least 1'),
  maxGuests: z.coerce.number().min(1, 'Must allow at least 1 guest'),
  bedrooms: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(0),
  amenities: z.string().optional(),
  images: z.string().optional(),
});

export type PropertyFormData = z.infer<typeof propertySchema>;
