import mongoose, { InferSchemaType } from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Indexing this field dramatically speeds up queries like "log out all devices"
    },
    refreshTokenHash: {
      type: String,
      required: true,
      index: true, // for fast lookup by Token
    },
    ip: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    revoke: {
      type: Boolean,
      default: false, // Sessions are active by default
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: "30d", // for TTL (Time-To-Live) Index
    },
  },
  {
    timestamps: true,
  },
);

export type ISession = InferSchemaType<typeof sessionSchema>;

export const Session = mongoose.model("Session", sessionSchema);
