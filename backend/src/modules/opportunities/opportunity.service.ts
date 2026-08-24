import { Opportunity, IOpportunity } from '../../models/Opportunity';
import { User } from '../../models/User';
import { ReviewQueueItem } from '../../models/ReviewQueueItem';
import { SavedItem } from '../../models/SavedItem';
import { runModerationHook } from '../moderation/moderation.service';

export const createOpportunity = async (userId: string, data: Partial<IOpportunity>) => {
  const opportunity = await Opportunity.create({ ...data, posterId: userId });
  await runModerationHook(opportunity._id as any, 'Opportunity', data.title + ' ' + data.description);
  return opportunity;
};

export const getOpportunities = async (
  query: string = '', 
  page: number = 1, 
  limit: number = 10, 
  type?: string,
  field?: string,
  deadline?: string,
  location?: string,
  remote?: string
) => {
  const filter: any = { status: 'active' };
  
  if (type) filter.type = type;
  if (field) filter.field = field;
  if (location) filter.location = { $regex: new RegExp(location, 'i') };
  if (remote !== undefined) filter.isRemote = remote === 'true';

  if (deadline === 'upcoming') {
    filter.deadline = { $gte: new Date() };
  } else if (deadline === 'past') {
    filter.deadline = { $lt: new Date() };
  }

  if (query) {
    filter.$text = { $search: query };
  }

  const skip = (page - 1) * limit;

  // If there's a text search query, sort by text match score. Otherwise, sort by newest.
  const sortOption = query ? { score: { $meta: 'textScore' } } : { createdAt: -1 };

  const [opportunities, total] = await Promise.all([
    Opportunity.find(filter, query ? { score: { $meta: 'textScore' } } : {})
      .sort(sortOption as any)
      .skip(skip)
      .limit(limit)
      .populate('posterId', 'role verifyTier'),
    Opportunity.countDocuments(filter)
  ]);

  return {
    opportunities,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  };
};

export const getOpportunityById = async (id: string) => {
  const opportunity = await Opportunity.findById(id).populate('posterId', 'role verifyTier');
  if (!opportunity) {
    const error: any = new Error('Opportunity not found');
    error.code = 'NOT_FOUND';
    error.statusCode = 404;
    throw error;
  }
  return opportunity;
};

export const updateOpportunity = async (id: string, data: Partial<IOpportunity>) => {
  const opportunity = await Opportunity.findByIdAndUpdate(id, { $set: data }, { returnDocument: 'after', runValidators: true });
  if (!opportunity) {
    const error: any = new Error('Opportunity not found');
    error.code = 'NOT_FOUND';
    error.statusCode = 404;
    throw error;
  }
  return opportunity;
};

export const deleteOpportunity = async (id: string) => {
  const opportunity = await Opportunity.findByIdAndDelete(id);
  if (!opportunity) {
    const error: any = new Error('Opportunity not found');
    error.code = 'NOT_FOUND';
    error.statusCode = 404;
    throw error;
  }
  return opportunity;
};

export const saveOpportunity = async (userId: string, opportunityId: string) => {
  // Ensure it exists first
  const opportunity = await Opportunity.findById(opportunityId);
  if (!opportunity) {
    const error: any = new Error('Opportunity not found');
    error.statusCode = 404;
    throw error;
  }

  try {
    const saved = await SavedItem.create({
      userId,
      entityId: opportunityId,
      entityModel: 'Opportunity'
    });
    return saved;
  } catch (error: any) {
    if (error.code === 11000) {
      // Already saved
      return await SavedItem.findOne({ userId, entityId: opportunityId });
    }
    throw error;
  }
};

export const unsaveOpportunity = async (userId: string, opportunityId: string) => {
  const deleted = await SavedItem.findOneAndDelete({
    userId,
    entityId: opportunityId,
    entityModel: 'Opportunity'
  });
  
  if (!deleted) {
    const error: any = new Error('Saved item not found');
    error.statusCode = 404;
    throw error;
  }

  return { message: 'Unsaved successfully' };
};

