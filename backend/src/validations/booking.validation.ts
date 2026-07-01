import { z } from "zod";

export const createBookingSchema = z
  .object({
    // Mongoose ObjectIds come through as strings in the JSON body
    propertyId: z
      .string({ error: "Property ID is required" })
      .trim()
      .min(1, { error: "Property ID cannot be empty" }),

    // z.coerce.date transforms the ISO string from the frontend into a native Date object
    checkIn: z.coerce.date({ error: "Check-in date is required or invalid" }),

    checkOut: z.coerce.date({ error: "Check-out date is required or invalid" }),

    guestsCount: z
      .number({ error: "Guests count is required" })
      .int({ error: "Guests count must be a whole number" })
      .min(1, { error: "At least 1 guest required" }),
  })
  // Ensures checkOut is strictly AFTER checkIn
  .refine((data) => data.checkOut > data.checkIn, {
    error: "Check-out date must be after the check-in date",
    path: ["checkOut"], // Attaches the error specifically to the checkOut field
  })
  // Optional: Ensure checkIn is not in the past
  .refine(
    (data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Strip time to compare just the dates
      return data.checkIn >= today;
    },
    {
      error: "Check-in date cannot be in the past",
      path: ["checkIn"],
    },
  );

export type createBookingType = z.infer<typeof createBookingSchema>;
