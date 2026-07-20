import { z } from "zod";

// Normalizes any Date to UTC midnight of its own UTC calendar day
const toUTCMidnight = (d: Date) =>
  new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

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
  // Ensure checkIn is not in the past
  .refine(
    (data) => {
      const today = toUTCMidnight(new Date());
      const checkInDay = toUTCMidnight(data.checkIn);
      return checkInDay >= today;
    },
    {
      error: "Check-in date cannot be in the past",
      path: ["checkIn"],
    },
  )
  .refine(
    (data) => {
      const today = toUTCMidnight(new Date());
      const maxBookingDate = new Date(today);
      maxBookingDate.setUTCMonth(maxBookingDate.getUTCMonth() + 2);
      return data.checkIn <= maxBookingDate;
    },
    {
      error: "Bookings can only be made up to 2 months in advance",
      path: ["checkIn"],
    },
  )
  .refine(
    (data) => {
      const today = toUTCMidnight(new Date());
      const maxBookingDate = new Date(today);
      maxBookingDate.setUTCMonth(maxBookingDate.getUTCMonth() + 2);
      return data.checkOut <= maxBookingDate;
    },
    {
      error: "Bookings can only be made up to 2 months in advance",
      path: ["checkOut"],
    },
  )
  .refine(
    (data) => {
      const oneMonthLater = new Date(data.checkIn);
      oneMonthLater.setUTCMonth(oneMonthLater.getUTCMonth() + 1);
      return data.checkOut <= oneMonthLater;
    },
    {
      error: "Booking duration cannot exceed 1 month",
      path: ["checkOut"],
    },
  );

export type createBookingType = z.infer<typeof createBookingSchema>;
