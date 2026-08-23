import { Opportunity, IOpportunity } from '../../models/Opportunity';

export const createOpportunity = async (userId: string, data: Partial<IOpportunity>) => {
  const opportunity = await Opportunity.create({ ...data, posterId: userId });
  return opportunity;
};

export const getOpportunities = async (query: string = '', page: number = 1, limit: number = 10, type?: string) => {
  const filter: any = { status: 'active' };
  
  if (type) {
    filter.type = type;
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
  const opportunity = await Opportunity.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
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
