import crypto from 'crypto';
import { Profile, IProfile } from '../../models/Profile';
import { User } from '../../models/User';

const generateHandle = (email: string): string => {
  const prefix = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const randomSuffix = crypto.randomBytes(3).toString('hex');
  return `${prefix}-${randomSuffix}`;
};

export const calculateCompleteness = (profile: IProfile): number => {
  let score = 0;
  if (profile.about && profile.about.trim().length > 0) score += 20;
  if (profile.education && profile.education.length > 0) score += 20;
  if (profile.skills && profile.skills.length > 0) score += 20;
  if (profile.interests && profile.interests.length > 0) score += 10;
  if (profile.location && profile.location.trim().length > 0) score += 10;
  if (profile.lookingFor && profile.lookingFor.length > 0) score += 10;
  if (profile.links && (profile.links.github || profile.links.linkedin || profile.links.portfolio)) score += 10;
  return score;
};

export const getMyProfile = async (userId: string) => {
  let profile = await Profile.findOne({ userId });

  if (!profile) {
    const user = await User.findById(userId);
    if (!user) {
      const error: any = new Error('User not found');
      error.code = 'NOT_FOUND';
      error.statusCode = 404;
      throw error;
    }
    const handle = generateHandle(user.email);
    profile = await Profile.create({ userId, handle });
  }

  const score = calculateCompleteness(profile);
  return { ...profile.toObject(), completenessScore: score };
};

export const patchMyProfile = async (userId: string, data: Partial<IProfile>) => {
  let profile = await Profile.findOne({ userId });

  if (!profile) {
    const user = await User.findById(userId);
    if (!user) {
      const error: any = new Error('User not found');
      error.code = 'NOT_FOUND';
      error.statusCode = 404;
      throw error;
    }
    const handle = generateHandle(user.email);
    profile = await Profile.create({ userId, handle });
  }

  const updatedProfile = await Profile.findOneAndUpdate(
    { userId },
    { $set: data },
    { returnDocument: 'after', runValidators: true }
  );

  const score = calculateCompleteness(updatedProfile!);
  return { ...updatedProfile!.toObject(), completenessScore: score };
};

export const getProfileByHandle = async (handle: string) => {
  console.log(`[getProfileByHandle] Searching for handle: "${handle}"`);
  const profile = await Profile.findOne({ handle }).populate('userId', 'verifyTier role');
  
  if (!profile) {
    const error: any = new Error(`Profile not found for handle: "${handle}"`);
    error.code = 'NOT_FOUND';
    error.statusCode = 404;
    throw error;
  }

  return profile;
};

