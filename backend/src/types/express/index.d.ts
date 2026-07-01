import { Types } from "mongoose";
import { IUser } from "../../models/user.model.ts";

declare global {
  namespace Express {
    interface Request {
      user?: Omit<IUser, "password"> & { _id: Types.ObjectId };
    }
  }
}
