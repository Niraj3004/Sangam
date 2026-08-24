import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User, IUser } from '../../models/User';
import { VerificationRequest } from '../../models/VerificationRequest';
import { env } from '../../config/env.config';
import { VERIFY_TIERS, ROLES, VerifyTier } from '../../constants/roles';
import { JwtPayload } from '../../middlewares/auth';
import { sendEmail } from '../../config/mailer';
import { Profile } from '../../models/Profile';

const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

const determineVerifyTier = (email: string): VerifyTier => {
  const domain = email.split('@')[1];
  const allowedDomains = env.COLLEGE_EMAIL_DOMAINS.split(',').map(d => d.trim().toLowerCase());
  
  if (allowedDomains.includes(domain?.toLowerCase())) {
    return VERIFY_TIERS.COLLEGE;
  }
  return VERIFY_TIERS.EMAIL;
};

const generateTokens = (user: IUser) => {
  const payload: JwtPayload = {
    userId: user._id.toString(),
    role: user.role,
    verifyTier: user.verifyTier,
  };

  const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: user._id }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  return { user, accessToken, refreshToken };
};

export const register = async (email: string, passwordRaw: string, handle: string) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error: any = new Error('Email already in use');
    error.code = 'EMAIL_EXISTS';
    error.statusCode = 400;
    throw error;
  }

  // Check if handle is taken
  const existingProfile = await Profile.findOne({ handle });
  if (existingProfile) {
    const error: any = new Error('Username/Handle already taken');
    error.code = 'HANDLE_EXISTS';
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(passwordRaw, salt);
  const verifyTier = determineVerifyTier(email);

  const user = await User.create({ email, password, verifyTier, role: ROLES.STUDENT });
  await Profile.create({ userId: user._id, handle, completionScore: 10 });

  // Fire and forget welcome email
  sendEmail(
    email,
    'Welcome to Sangam! 🇳🇵',
    'Welcome to the Sangam Platform',
    `<p>We are thrilled to have you here! Sangam is the number one platform for Nepali students at home and abroad to collaborate, find opportunities, and build their careers.</p>
     <p>Your next step is to set up your profile so you can start matching with projects and peers.</p>`,
    `${env.CLIENT_URL}/profile/setup`,
    'Setup Your Profile'
  ).catch(console.error);

  return generateTokens(user);
};

export const login = async (email: string, passwordRaw: string) => {
  console.log(`[LOGIN ATTEMPT] Email: ${email}, Password length: ${passwordRaw?.length}`);
  const user = await User.findOne({ 
    $or: [ { email }, { secondaryEmail: email } ] 
  });
  
  if (!user) {
    console.log(`[LOGIN FAILED] User not found for email: ${email}`);
    const error: any = new Error('Invalid credentials');
    error.code = 'INVALID_CREDENTIALS';
    error.statusCode = 401;
    throw error;
  }
  
  if (!user.password) {
    console.log(`[LOGIN FAILED] User has no password set (OAuth?): ${email}`);
    const error: any = new Error('Invalid credentials');
    error.code = 'INVALID_CREDENTIALS';
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(passwordRaw, user.password);
  console.log(`[LOGIN BCRYPT] Match result: ${isMatch}`);
  
  if (!isMatch) {
    console.log(`[LOGIN FAILED] Password mismatch for: ${email}`);
    const error: any = new Error('Invalid credentials');
    error.code = 'INVALID_CREDENTIALS';
    error.statusCode = 401;
    throw error;
  }

  return generateTokens(user);
};

export const refresh = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId);
    if (!user) throw new Error('User not found');
    
    return generateTokens(user);
  } catch (err) {
    const error: any = new Error('Invalid refresh token');
    error.code = 'INVALID_TOKEN';
    error.statusCode = 401;
    throw error;
  }
};

export const googleAuth = async (idToken: string) => {
  if (!env.GOOGLE_CLIENT_ID) {
    throw new Error('Google OAuth is not configured');
  }

  const ticket = await client.verifyIdToken({
    idToken,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    const error: any = new Error('Invalid Google token');
    error.code = 'INVALID_GOOGLE_TOKEN';
    error.statusCode = 400;
    throw error;
  }

  const { email, sub: googleId, email_verified } = payload;

  let user = await User.findOne({ email });

  if (!user) {
    const verifyTier = determineVerifyTier(email);
    user = await User.create({
      email,
      googleId,
      isEmailVerified: email_verified,
      verifyTier,
      role: ROLES.STUDENT,
    });
  } else if (!user.googleId) {
    user.googleId = googleId;
    user.isEmailVerified = user.isEmailVerified || email_verified || false;
    await user.save();
  }

  return generateTokens(user);
};

export const getMe = async (userId: string) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    const error: any = new Error('User not found');
    error.code = 'NOT_FOUND';
    error.statusCode = 404;
    throw error;
  }
  return user;
};

export const submitVerificationRequest = async (userId: string, evidence: string, tierRequested: string) => {
  const existing = await VerificationRequest.findOne({ userId, status: 'pending' });
  if (existing) {
    const error: any = new Error('You already have a pending verification request');
    error.statusCode = 400;
    throw error;
  }

  const request = await VerificationRequest.create({
    userId,
    evidence,
    tierRequested: tierRequested as VerifyTier,
    status: 'pending',
  });

  return request;
};

export const getVerificationRequests = async () => {
  const requests = await VerificationRequest.find({ status: 'pending' })
    .populate('userId', 'email role verifyTier');
  return requests;
};

export const resolveVerificationRequest = async (requestId: string, action: 'approve' | 'reject', notes?: string) => {
  const request = await VerificationRequest.findById(requestId);
  if (!request) {
    const error: any = new Error('Request not found');
    error.statusCode = 404;
    throw error;
  }
  
  if (request.status !== 'pending') {
    const error: any = new Error('Request is already resolved');
    error.statusCode = 400;
    throw error;
  }

  request.status = action === 'approve' ? 'approved' : 'rejected';
  if (notes) request.notes = notes;
  await request.save();

  const user = await User.findById(request.userId);

  if (action === 'approve') {
    await User.findByIdAndUpdate(request.userId, { verifyTier: request.tierRequested });
    if (user) {
      sendEmail(
        user.email,
        'Account Verification Approved ✅',
        'Verification Successful',
        `<p>Great news! Your request to upgrade to the <strong>${request.tierRequested}</strong> tier has been approved by our moderation team.</p>
         <p>You now have full access to post opportunities, create verified organizations, and connect with peers without limits.</p>`,
        `${env.CLIENT_URL}/dashboard`,
        'Go to Dashboard'
      ).catch(console.error);
    }
  } else if (user) {
    sendEmail(
      user.email,
      'Account Verification Update ℹ️',
      'Verification Status Update',
      `<p>Your request to upgrade to the ${request.tierRequested} tier has been reviewed.</p>
       <p>Unfortunately, we could not approve it at this time. <strong>Reason:</strong> ${notes || 'Information provided did not meet our verification standards.'}</p>
       <p>You can try submitting your evidence again from your account settings.</p>`,
      `${env.CLIENT_URL}/settings/verification`,
      'Review Request'
    ).catch(console.error);
  }

  return request;
};

export const addSecondaryEmail = async (userId: string, secondaryEmail: string) => {
  const existing = await User.findOne({ 
    $or: [{ email: secondaryEmail }, { secondaryEmail }] 
  });
  
  if (existing) {
    const error: any = new Error('Email is already in use by another account');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findByIdAndUpdate(userId, { secondaryEmail }, { new: true });
  if (!user) throw new Error('User not found');
  
  return user;
};
