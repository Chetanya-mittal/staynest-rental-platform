import mongoose, { InferSchemaType } from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true, // Indexing this field dramatically speeds up queries
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Indexing this field dramatically speeds up queries
    },
    checkIn: {
      type: Date,
      required: [true, "Check-in date is required"],
    },
    checkOut: {
      type: Date,
      required: [true, "Check-out date is required"],
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    totalNights: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed",
    },
    guestsCount: {
      type: Number,
      required: true,
      min: [1, "At least 1 guest required"],
    },
  },
  {
    timestamps: true,
  },
);

export type IBooking = InferSchemaType<typeof bookingSchema>;

export const Booking = mongoose.model("Booking", bookingSchema);
