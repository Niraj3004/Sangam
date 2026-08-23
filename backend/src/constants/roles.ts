export const ROLES = {
  STUDENT: 'student',
  VERIFIED_STUDENT: 'verified_student',
  CURATOR: 'curator',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
  ORG: 'org',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const VERIFY_TIERS = {
  EMAIL: 'email',
  COLLEGE: 'college',
  MANUAL: 'manual',
} as const;

export type VerifyTier = typeof VERIFY_TIERS[keyof typeof VERIFY_TIERS];
