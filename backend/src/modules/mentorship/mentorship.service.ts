import { Mentorship, IMentorship } from '../../models/Mentorship';

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
  return mentorship;
};
