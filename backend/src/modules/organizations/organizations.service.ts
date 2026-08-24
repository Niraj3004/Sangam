import { Organization, IOrganization } from '../../models/Organization';

export const createOrganization = async (userId: string, data: Partial<IOrganization>) => {
  // Organizations are unverified by default. The user who creates it becomes the first admin.
  const org = await Organization.create({
    ...data,
    verified: false,
    members: [{ userId, role: 'admin' }]
  });

  return org;
};

export const getVerifiedOrganizations = async (page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;

  const [orgs, total] = await Promise.all([
    Organization.find({ verified: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Organization.countDocuments({ verified: true })
  ]);

  return {
    orgs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  };
};

export const getOrganizationById = async (id: string) => {
  const org = await Organization.findById(id).populate('members.userId', 'email verifyTier');
  if (!org) {
    const error: any = new Error('Organization not found');
    error.statusCode = 404;
    throw error;
  }
  return org;
};
