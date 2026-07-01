import { z } from "zod";

export const propertyQuerySchema = z
  .object({
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    minPrice: z.coerce.number().positive().optional(),
    maxPrice: z.coerce.number().positive().optional(),
    guests: z.coerce.number().positive().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
  })
  .refine(
    (data) => {
      // Ensure maxPrice isn't lower than minPrice if both exist
      if (data.minPrice && data.maxPrice) {
        return data.maxPrice >= data.minPrice;
      }
      return true;
    },
    {
      message: "maxPrice must be greater than or equal to minPrice",
      path: ["maxPrice"],
    },
  );

export type PropertyQueryType = z.infer<typeof propertyQuerySchema>;

// Helper functions for Zod v4's new error callback signature
const requiredStr = (field: string) => ({
  error: (iss: any) =>
    iss.input === undefined
      ? `${field} is required`
      : `${field} must be a string`,
});

const requiredNum = (field: string) => ({
  error: (iss: any) =>
    iss.input === undefined
      ? `${field} is required`
      : `${field} must be a number`,
});

export const createPropertySchema = z.object({
  title: z
    .string(requiredStr("Title"))
    .trim()
    .min(1, { error: "Title cannot be empty" })
    .max(100, { error: "Title cannot exceed 100 characters" }),

  description: z
    .string(requiredStr("Description"))
    .trim()
    .min(1, { error: "Description cannot be empty" })
    .max(1000, { error: "Description cannot exceed 1000 characters" }),

  location: z.object(
    {
      city: z
        .string(requiredStr("City"))
        .trim()
        .min(1, { error: "City cannot be empty" }),
      state: z
        .string(requiredStr("State"))
        .trim()
        .min(1, { error: "State cannot be empty" }),
      country: z
        .string(requiredStr("Country"))
        .trim()
        .min(1, { error: "Country cannot be empty" }),
    },
    { error: "Location details are required" },
  ),

  pricePerNight: z.coerce
    .number(requiredNum("Price per night"))
    .min(1, { error: "Price must be at least 1" }),

  maxGuests: z.coerce
    .number(requiredNum("Max guests"))
    .int({ error: "Max guests must be a whole number" })
    .min(1, { error: "Must allow at least 1 guest" }),

  bedrooms: z.coerce
    .number({ error: "Bedrooms must be a number" })
    .int({ error: "Bedrooms must be a whole number" })
    .min(0, { error: "Bedrooms cannot be negative" })
    .optional(), // Falls back to Mongoose default if not provided

  bathrooms: z.coerce
    .number({ error: "Bathrooms must be a number" })
    .min(0, { error: "Bathrooms cannot be negative" })
    .optional(), // Intentionally omitting .int() in case of half-baths (e.g., 1.5)

  amenities: z
    .array(z.string({ error: "Amenities must be strings" }))
    .optional(),

  images: z
    .array(z.url({ error: "Each image must be a valid URL" }))
    .optional(),
});

export type CreatePropertyType = z.infer<typeof createPropertySchema>;
