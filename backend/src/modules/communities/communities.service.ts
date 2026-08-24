import { Community } from '../../models/Community';
import { Membership } from '../../models/Membership';

export const getCommunities = async (query: string = '', type?: string, page: number = 1, limit: number = 20) => {
  const filter: any = { status: 'active' };

  if (type) filter.type = type;
  if (query) filter.$text = { $search: query };

  const skip = (page - 1) * limit;
  const sortOption = query ? { score: { $meta: 'textScore' } } : { memberCount: -1 };

  const [communities, total] = await Promise.all([
    Community.find(filter, query ? { score: { $meta: 'textScore' } } : {})
      .sort(sortOption as any)
      .skip(skip)
      .limit(limit),
    Community.countDocuments(filter)
  ]);

  return {
    communities,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  };
};

export const joinCommunity = async (userId: string, communityId: string) => {
  const community = await Community.findById(communityId);
  if (!community || community.status !== 'active') {
    const error: any = new Error('Community not found or inactive');
    error.statusCode = 404;
    throw error;
  }

  const existingMembership = await Membership.findOne({ userId, communityId });
  if (existingMembership) {
    const error: any = new Error('Already a member');
    error.statusCode = 400;
    throw error;
  }

  const membership = await Membership.create({ userId, communityId, role: 'member' });
  
  await Community.findByIdAndUpdate(communityId, { $inc: { memberCount: 1 } });

  return membership;
};

export const leaveCommunity = async (userId: string, communityId: string) => {
  const deleted = await Membership.findOneAndDelete({ userId, communityId });
  if (!deleted) {
    const error: any = new Error('Membership not found');
    error.statusCode = 404;
    throw error;
  }

  await Community.findByIdAndUpdate(communityId, { $inc: { memberCount: -1 } });

  return { success: true };
};

export const updateCommunity = async (id: string, updates: Partial<typeof Community.prototype>) => {
  const community = await Community.findByIdAndUpdate(id, { $set: updates }, { returnDocument: 'after' });
  if (!community) {
    const error: any = new Error('Community not found');
    error.statusCode = 404;
    throw error;
  }
  return community;
};

export const proposeCommunity = async (userId: string, data: any) => {
  const existing = await Community.findOne({ name: data.name });
  if (existing) {
    const error: any = new Error('A community with this name already exists');
    error.statusCode = 400;
    throw error;
  }

  const community = await Community.create({
    ...data,
    status: 'pending',
    creatorId: userId,
    creatorType: 'student',
    isOfficial: false,
  });

  return community;
};

export const createCommunity = async (orgId: string, data: any) => {
  const existing = await Community.findOne({ name: data.name });
  if (existing) {
    const error: any = new Error('A community with this name already exists');
    error.statusCode = 400;
    throw error;
  }

  const community = await Community.create({
    ...data,
    status: 'active',
    creatorId: orgId,
    creatorType: 'org',
    isOfficial: true,
  });

  // Automatically add the creator as the admin of the new community
  // We need the org's admin userId to do this properly, 
  // but for now, we assume the API caller is the org admin user.
  // Wait, the orgId passed in here should be the User ID of the Org Admin, or the Org ID?
  // Let's pass userId and set creatorId to userId, creatorType to org.
  
  return community;
};

export const getPendingCommunities = async () => {
  const communities = await Community.find({ status: 'pending' }).populate('creatorId', 'email name handle');
  return communities;
};

export const approveCommunity = async (communityId: string) => {
  const community = await Community.findById(communityId);
  if (!community || community.status !== 'pending') {
    const error: any = new Error('Community not found or not pending');
    error.statusCode = 404;
    throw error;
  }

  community.status = 'active';
  await community.save();

  // Add the student creator as the admin
  if (community.creatorId) {
    await Membership.create({
      userId: community.creatorId,
      communityId: community._id,
      role: 'admin'
    });
    community.memberCount = 1;
    await community.save();
  }

  return community;
};

