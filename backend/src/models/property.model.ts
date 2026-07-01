import mongoose, { InferSchemaType } from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // links to the User model
      required: true,
      index: true, // Indexing this field dramatically speeds up queries
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxLength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxLength: [1000, "Description cannot exceed 1000 characters"],
    },
    location: {
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
    },
    pricePerNight: {
      type: Number,
      required: [true, "Price per night is required"],
      min: [1, "Price must be at least 1"],
    },
    maxGuests: {
      type: Number,
      required: [true, "Max guests is required"],
      min: [1, "Must allow at least 1 guest"],
    },
    bedrooms: { type: Number, default: 1, min: 0 },
    bathrooms: { type: Number, default: 1, min: 0 },
    amenities: {
      type: [String], // array of strings e.g. ['WiFi', 'Parking']
      default: [],
    },
    images: {
      type: [String], // array of image URLs
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export type IProperty = InferSchemaType<typeof propertySchema>;

export const Property = mongoose.model("Property", propertySchema);
