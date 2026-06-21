import mongoose, { InferSchemaType } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["guest", "host", "admin"],
      default: "guest",
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // auto adds createdAt and updatedAt
  },
);

export type IUser = InferSchemaType<typeof userSchema>;

export const User = mongoose.model("User", userSchema);
