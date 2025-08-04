import mongoose, { Schema, Document, models } from 'mongoose';

/**
 * Interface for the User document in our local database.
 * This user is a synced copy of the user from Clerk.
 */
export interface IUser extends Document {
  clerkId: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    // The unique ID from Clerk. This is the key link between the two systems.
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    // The user's role, pulled from Clerk's public metadata.
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

export default models.User || mongoose.model<IUser>('User', UserSchema);
