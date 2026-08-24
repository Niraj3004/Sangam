import { Mentorship, IMentorship } from '../../models/Mentorship';
import { User } from '../../models/User';
import { Profile } from '../../models/Profile';
import { sendEmail } from '../../config/mailer';
import { env } from '../../config/env.config';

export const requestMentorship = async (menteeId: string, mentorId: string, purpose: string) => {
  if (menteeId === mentorId) {
    const error: any = new Error('You cannot request mentorship from yourself.');
    error.statusCode = 400;
    throw error;
  }

  const existing = await Mentorship.findOne({
    mentorId,
    menteeId,
    status: { $in: ['pending', 'accepted'] }
  });

  if (existing) {
    const error: any = new Error(`You already have a ${existing.status} mentorship request with this person.`);
    error.statusCode = 400;
    throw error;
  }

  const mentorship = await Mentorship.create({
    menteeId,
    mentorId,
    purpose,
    status: 'pending'
  });

  const mentor = await User.findById(mentorId);
  const menteeProfile = await Profile.findOne({ userId: menteeId });
  const menteeName = menteeProfile?.handle || 'A student';

  if (mentor) {
    sendEmail(
      mentor.email,
      `New Mentorship Request from ${menteeName}`,
      'New Mentorship Request',
      `<p><strong>${menteeName}</strong> has requested you as a mentor on Sangam.</p>
       <p><strong>Purpose:</strong> ${purpose}</p>
       <p>Review their profile and decide if you'd like to guide them.</p>`,
      `${env.CLIENT_URL}/mentorship/requests`,
      'View Request'
    ).catch(console.error);
  }

  return mentorship;
};

export const getMyRequests = async (userId: string) => {
  // Requests where I am the mentor
  const requests = await Mentorship.find({ mentorId: userId, status: 'pending' })
    .populate('menteeId', 'email verifyTier')
    .sort({ createdAt: -1 });

  return requests;
};

export const getMyMentorships = async (userId: string) => {
  // All my accepted/completed mentorships (as mentee or mentor)
  const mentorships = await Mentorship.find({
    $or: [{ menteeId: userId }, { mentorId: userId }],
    status: { $in: ['accepted', 'completed'] }
  })
    .populate('mentorId menteeId', 'email verifyTier')
    .sort({ scheduledAt: 1 });

  return mentorships;
};

export const acceptMentorship = async (userId: string, id: string, scheduledAt: Date, meetingLink?: string) => {
  const mentorship = await Mentorship.findById(id);
  if (!mentorship || mentorship.status !== 'pending') {
    const error: any = new Error('Pending request not found');
    error.statusCode = 404;
    throw error;
  }

  if (mentorship.mentorId.toString() !== userId) {
    const error: any = new Error('Only the requested mentor can accept this.');
    error.statusCode = 403;
    throw error;
  }

  mentorship.status = 'accepted';
  mentorship.scheduledAt = scheduledAt;
  if (meetingLink) mentorship.meetingLink = meetingLink;

  await mentorship.save();

  const mentee = await User.findById(mentorship.menteeId);
  const mentorProfile = await Profile.findOne({ userId: mentorship.mentorId });
  const mentorName = mentorProfile?.handle || 'Your requested mentor';

  if (mentee) {
    sendEmail(
      mentee.email,
      'Mentorship Request Accepted! 🎉',
      'Mentorship Accepted',
      `<p>Great news! <strong>${mentorName}</strong> has accepted your mentorship request.</p>
       <p><strong>Scheduled for:</strong> ${scheduledAt.toLocaleString()}</p>
       ${meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>` : ''}
       <p>Prepare your questions and make the most out of this session!</p>`,
      `${env.CLIENT_URL}/mentorship/sessions`,
      'View Details'
    ).catch(console.error);
  }

  return mentorship;
};

export const declineMentorship = async (userId: string, id: string) => {
  const mentorship = await Mentorship.findById(id);
  if (!mentorship || mentorship.status !== 'pending') {
    const error: any = new Error('Pending request not found');
    error.statusCode = 404;
    throw error;
  }

  if (mentorship.mentorId.toString() !== userId) {
    const error: any = new Error('Only the requested mentor can decline this.');
    error.statusCode = 403;
    throw error;
  }

  mentorship.status = 'declined';
  await mentorship.save();

  const mentee = await User.findById(mentorship.menteeId);
  const mentorProfile = await Profile.findOne({ userId: mentorship.mentorId });
  const mentorName = mentorProfile?.handle || 'The requested mentor';

  if (mentee) {
    sendEmail(
      mentee.email,
      'Mentorship Request Update',
      'Mentorship Update',
      `<p><strong>${mentorName}</strong> has reviewed your mentorship request, but cannot accept it at this time.</p>
       <p>Don't be discouraged! There are many other experienced students and alumni on Sangam who would love to help.</p>`,
      `${env.CLIENT_URL}/mentors`,
      'Find Another Mentor'
    ).catch(console.error);
  }

  return mentorship;
};
