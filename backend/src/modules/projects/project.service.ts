import { Project, IProject } from '../../models/Project';
import { Profile } from '../../models/Profile';
import { Connection } from '../../models/Connection';
import { ProjectApplication } from '../../models/ProjectApplication';
import { runModerationHook } from '../moderation/moderation.service';

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
  runModerationHook(project._id as unknown as string, 'Project', `${project.title} ${project.description}`).catch(console.error);

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

export const applyToRole = async (userId: string, projectId: string, roleTitle: string, message?: string) => {
  const project = await Project.findById(projectId);
  if (!project) {
    const error: any = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  const role = project.openRoles?.find(r => r.title === roleTitle);
  if (!role) {
    const error: any = new Error('Role not found on this project');
    error.statusCode = 404;
    throw error;
  }

  if (role.isFilled) {
    const error: any = new Error('This role is already filled');
    error.statusCode = 400;
    throw error;
  }

  const application = await ProjectApplication.create({
    userId,
    projectId,
    roleTitle,
    message
  });

  return application;
};

export const getApplications = async (projectId: string) => {
  return await ProjectApplication.find({ projectId }).populate('userId', 'email verifyTier role');
};

export const resolveApplication = async (projectId: string, appId: string, status: 'accepted' | 'rejected') => {
  const application = await ProjectApplication.findOneAndUpdate(
    { _id: appId, projectId, status: 'pending' },
    { status },
    { new: true }
  );

  if (!application) {
    const error: any = new Error('Pending application not found');
    error.statusCode = 404;
    throw error;
  }

  if (status === 'accepted') {
    // Add user to contributors and mark role as filled
    await Project.updateOne(
      { _id: projectId, 'openRoles.title': application.roleTitle },
      { 
        $addToSet: { contributors: application.userId },
        $set: { 'openRoles.$.isFilled': true }
      }
    );
  }

  return application;
};
