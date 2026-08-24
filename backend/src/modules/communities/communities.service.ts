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
  const community = await Community.findByIdAndUpdate(id, { $set: updates }, { new: true });
  if (!community) {
    const error: any = new Error('Community not found');
    error.statusCode = 404;
    throw error;
  }
  return community;
};
