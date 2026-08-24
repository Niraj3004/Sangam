import mongoose, { Schema, Document } from 'mongoose';

export interface IOTP extends Document {
  email: string;
  code: string;
  purpose: 'verify_email' | 'secondary_email' | 'reset_password';
  expiresAt: Date;
  createdAt: Date;
}

const OTPSchema: Schema = new Schema(
  {
    email: { type: String, required: true, index: true },
    code: { type: String, required: true },
    purpose: { type: String, enum: ['verify_email', 'secondary_email', 'reset_password'], required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// TTL Index: automatically delete document when expiresAt is reached
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OTP = mongoose.model<IOTP>('OTP', OTPSchema);
