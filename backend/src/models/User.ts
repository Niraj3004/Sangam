import mongoose, { Schema, Document } from 'mongoose';
import { ROLES, VERIFY_TIERS, Role, VerifyTier } from '../constants/roles';

export interface IUser extends Document {
  email: string;
  secondaryEmail?: string;
  password?: string;
  googleId?: string;
  role: Role;
  verifyTier: VerifyTier;
  isEmailVerified: boolean;
  notificationPrefs: {
    emailDigests: boolean;
    emailReminders: boolean;
    pushNotifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    secondaryEmail: { type: String, unique: true, sparse: true, index: true },
    password: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.STUDENT },
    verifyTier: { type: String, enum: Object.values(VERIFY_TIERS), default: VERIFY_TIERS.EMAIL },
    isEmailVerified: { type: Boolean, default: false },
    notificationPrefs: {
      emailDigests: { type: Boolean, default: true },
      emailReminders: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
