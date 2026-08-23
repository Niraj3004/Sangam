// This is a stub for the Nodemailer configuration.
// To be fully implemented in Phase B6 (Reminders & Digests).
import { env } from './env.config';

export const sendEmail = async (to: string, subject: string, body: string) => {
  console.log(`[MAILER STUB] Sending email to: ${to}`);
  console.log(`[MAILER STUB] Subject: ${subject}`);
  return true;
};
