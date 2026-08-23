import { Project, IProject } from '../../models/Project';
import { Profile } from '../../models/Profile';
import { Connection } from '../../models/Connection';

export const createProject = async (userId: string, data: Partial<IProject>) => {
  // Check if contributors are actually connected with the owner (for V1 constraint)
  if (data.contributors && data.contributors.length > 0) {
    const connections = await Connection.find({
      $or: [{ requesterId: userId }, { recipientId: userId }],
      status: 'accepted'
    });
    const connectedUserIds = connections.map(c => 
      c.requesterId.toString() === userId ? c.recipientId.toString() : c.requesterId.toString()
    );

    for (const contributorId of data.contributors) {
      if (!connectedUserIds.includes(contributorId.toString()) && contributorId.toString() !== userId) {
        const error: any = new Error(`Cannot add user ${contributorId} as contributor because they are not connected with you.`);
        error.statusCode = 403;
        throw error;
      }
    }
  }

  const project = await Project.create({ ...data, ownerId: userId });

  // Sync to Profile
  await Profile.findOneAndUpdate(
    { userId },
    { $addToSet: { projects: project._id } }
  );

  return project;
};

export const getProjects = async (query: string = '', page: number = 1, limit: number = 10, userId?: string) => {
  const filter: any = {};
  
  if (userId) {
    filter.ownerId = userId;
  }

  if (query) {
    filter.$text = { $search: query };
  }

  const skip = (page - 1) * limit;

  // If there's a text search query, sort by text match score. Otherwise, sort by newest.
  const sortOption = query ? { score: { $meta: 'textScore' } } : { createdAt: -1 };

  const [projects, total] = await Promise.all([
    Project.find(filter, query ? { score: { $meta: 'textScore' } } : {})
      .sort(sortOption as any)
      .skip(skip)
      .limit(limit)
      .populate('ownerId contributors', 'email role verifyTier'),
    Project.countDocuments(filter)
  ]);

  return {
    projects,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  };
};

export const getProjectById = async (id: string) => {
  const project = await Project.findById(id).populate('ownerId contributors', 'email role verifyTier');
  if (!project) {
    const error: any = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }
  return project;
};

export const updateProject = async (id: string, data: Partial<IProject>) => {
  const project = await Project.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
  if (!project) {
    const error: any = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }
  return project;
};

export const deleteProject = async (id: string) => {
  const project = await Project.findByIdAndDelete(id);
  if (!project) {
    const error: any = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }
  return project;
};
