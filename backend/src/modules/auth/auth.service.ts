import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User, IUser } from '../../models/User';
import { VerificationRequest } from '../../models/VerificationRequest';
import { OTP } from '../../models/OTP';
import { BlacklistedToken } from '../../models/BlacklistedToken';
import { env } from '../../config/env.config';
import { VERIFY_TIERS, ROLES, VerifyTier } from '../../constants/roles';
import { JwtPayload } from '../../middlewares/auth';
import { sendEmail } from '../../config/mailer';
import { Profile } from '../../models/Profile';
import { Organization } from '../../models/Organization';

const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

const determineVerifyTier = (email: string): VerifyTier => {
  const domain = email.split('@')[1];
  const allowedDomains = env.COLLEGE_EMAIL_DOMAINS.split(',').map(d => d.trim().toLowerCase());
  
  if (allowedDomains.includes(domain?.toLowerCase())) {
    return VERIFY_TIERS.COLLEGE;
  }
  return VERIFY_TIERS.EMAIL;
};

const generateTokens = (user: IUser, org?: any) => {
  const payload: JwtPayload = {
    userId: user._id.toString(),
    role: user.role,
    verifyTier: user.verifyTier,
  };

  if (org) {
    payload.orgId = org._id.toString();
    payload.orgType = org.type;
  }

  const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: user._id }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  return { user, accessToken, refreshToken, orgType: org?.type };
};

const generateOTPCode = () => Math.floor(100000 + Math.random() * 900000).toString();

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

  // Generate OTP for primary email verification
  const code = generateOTPCode();
  await OTP.create({
    email,
    code,
    purpose: 'verify_email',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 mins
  });

  sendEmail(
    email,
    'Verify your Sangam Account 🔐',
    'Email Verification',
    `<p>Welcome to Sangam! Your verification code is:</p>
     <h2 style="font-size: 32px; letter-spacing: 5px; color: #333;">${code}</h2>
     <p>This code will expire in 10 minutes.</p>`,
    `${env.CLIENT_URL}/verify`,
    'Enter Code'
  ).catch(console.error);

  return generateTokens(user);
};

export const registerOrganization = async (
  email: string, passwordRaw: string, handle: string, 
  orgName: string, orgType: 'employer' | 'college', 
  orgWebsite: string | undefined, orgDescription: string
) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error: any = new Error('Email already in use');
    error.statusCode = 400;
    throw error;
  }

  const existingProfile = await Profile.findOne({ handle });
  if (existingProfile) {
    const error: any = new Error('Username/Handle already taken');
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(passwordRaw, salt);

  // Users who register organizations get the ORG role
  const user = await User.create({ email, password, verifyTier: VERIFY_TIERS.MANUAL, role: ROLES.ORG });
  await Profile.create({ userId: user._id, handle, completionScore: 10 });

  // Create the Organization and link the user
  const org = await Organization.create({
    name: orgName,
    description: orgDescription,
    website: orgWebsite,
    type: orgType,
    verified: false,
    members: [{ userId: user._id, role: 'admin' }]
  });

  const code = generateOTPCode();
  await OTP.create({
    email,
    code,
    purpose: 'verify_email',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000)
  });

  sendEmail(
    email,
    'Verify your Sangam Business Account 🔐',
    'Email Verification',
    `<p>Welcome to Sangam! Your business account verification code is:</p>
     <h2 style="font-size: 32px; letter-spacing: 5px; color: #333;">${code}</h2>
     <p>This code will expire in 10 minutes.</p>`,
    `${env.CLIENT_URL}/verify`,
    'Enter Code'
  ).catch(console.error);

  return generateTokens(user, org);
};

export const verifyEmailOTP = async (userId: string, code: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  if (user.isEmailVerified) {
    const err: any = new Error('Email is already verified');
    err.statusCode = 400;
    throw err;
  }

  const otp = await OTP.findOne({ email: user.email, code, purpose: 'verify_email' });
  if (!otp) {
    const err: any = new Error('Invalid or expired verification code');
    err.statusCode = 400;
    throw err;
  }

  user.isEmailVerified = true;
  await user.save();
  await OTP.deleteOne({ _id: otp._id });

  return user;
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

  let org = null;
  if (user.role === ROLES.ORG) {
    // Find the organization this user belongs to
    org = await Organization.findOne({ 'members.userId': user._id });
  }

  return generateTokens(user, org);
};

export const refresh = async (refreshToken: string) => {
  try {
    const isBlacklisted = await BlacklistedToken.exists({ token: refreshToken });
    if (isBlacklisted) throw new Error('Token is revoked');

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

  // Generate OTP for secondary email
  const code = generateOTPCode();
  await OTP.create({
    email: secondaryEmail,
    code,
    purpose: 'secondary_email',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000)
  });

  sendEmail(
    secondaryEmail,
    'Verify your Secondary Email 🔐',
    'Secondary Email Verification',
    `<p>You requested to link this email as a recovery address for your Sangam account. Your verification code is:</p>
     <h2 style="font-size: 32px; letter-spacing: 5px; color: #333;">${code}</h2>
     <p>This code will expire in 10 minutes.</p>`,
    `${env.CLIENT_URL}/settings`,
    'Go to Settings'
  ).catch(console.error);

  return true;
};

export const verifySecondaryEmailOTP = async (userId: string, secondaryEmail: string, code: string) => {
  const otp = await OTP.findOne({ email: secondaryEmail, code, purpose: 'secondary_email' });
  if (!otp) {
    const err: any = new Error('Invalid or expired verification code');
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findByIdAndUpdate(userId, { secondaryEmail }, { new: true });
  if (!user) throw new Error('User not found');
  
  await OTP.deleteOne({ _id: otp._id });
  return user;
};

export const logout = async (refreshToken: string) => {
  if (!refreshToken) return;
  try {
    const decoded = jwt.decode(refreshToken) as any;
    const expiresAt = decoded && decoded.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await BlacklistedToken.create({ token: refreshToken, expiresAt });
  } catch (err) {
    // Ignore invalid tokens on logout
  }
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ $or: [{ email }, { secondaryEmail: email }] });
  if (!user) return; // Silent return for security

  const targetEmail = user.secondaryEmail && email === user.secondaryEmail ? user.secondaryEmail : user.email;
  const resetToken = jwt.sign({ userId: user._id }, env.JWT_SECRET, { expiresIn: '15m' });

  sendEmail(
    targetEmail,
    'Reset your Sangam Password 🔒',
    'Password Reset Request',
    `<p>We received a request to reset your password. Click the link below to set a new password.</p>
     <p>This link is valid for 15 minutes.</p>`,
    `${env.CLIENT_URL}/reset-password?token=${resetToken}`,
    'Reset Password'
  ).catch(console.error);
};

export const resetPassword = async (token: string, newPasswordRaw: string) => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId);
    if (!user) throw new Error('User not found');

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPasswordRaw, salt);
    await user.save();

    return true;
  } catch (err) {
    const error: any = new Error('Invalid or expired reset token');
    error.statusCode = 400;
    throw error;
  }
};
