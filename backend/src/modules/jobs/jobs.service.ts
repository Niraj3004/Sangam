import { Job, IJob } from '../../models/Job';
import { Organization } from '../../models/Organization';
import { Application } from '../../models/Application';
import { evaluateModeration } from '../../ai-gateway/moderation';

const checkOrgPermission = async (userId: string, organizationId: string) => {
  const org = await Organization.findById(organizationId);
  if (!org) {
    const error: any = new Error('Organization not found');
    error.statusCode = 404;
    throw error;
  }

  if (!org.verified) {
    const error: any = new Error('Only verified organizations can post jobs or manage applications.');
    error.statusCode = 403;
    throw error;
  }

  const isMember = org.members.some(m => m.userId.toString() === userId);
  if (!isMember) {
    const error: any = new Error('You do not have permission for this organization.');
    error.statusCode = 403;
    throw error;
  }

  return org;
};

export const createJob = async (userId: string, data: Partial<IJob>) => {
  await checkOrgPermission(userId, data.organizationId as any);

  const job = await Job.create(data);
  
  // Async AI Moderation Hook (B13)
  evaluateModeration(job._id, 'Job', `${job.title} ${job.description}`).catch(console.error);

  return job;
};

export const getJobs = async (page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;

  const [jobs, total] = await Promise.all([
    Job.find({ status: 'open' })
      .populate('organizationId', 'name logoUrl verified')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Job.countDocuments({ status: 'open' })
  ]);

  return {
    jobs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  };
};

export const getJobById = async (jobId: string) => {
  const job = await Job.findById(jobId).populate('organizationId', 'name logoUrl verified description');
  if (!job) {
    const error: any = new Error('Job not found');
    error.statusCode = 404;
    throw error;
  }
  return job;
};

export const applyForJob = async (userId: string, jobId: string, resumeUrl?: string, coverLetter?: string) => {
  const job = await Job.findById(jobId);
  if (!job || job.status !== 'open') {
    const error: any = new Error('Job is not available');
    error.statusCode = 400;
    throw error;
  }

  const existing = await Application.findOne({ jobId, applicantId: userId });
  if (existing) {
    const error: any = new Error('You have already applied to this job');
    error.statusCode = 400;
    throw error;
  }

  const application = await Application.create({
    jobId,
    applicantId: userId,
    resumeUrl,
    coverLetter,
    status: 'applied'
  });

  return application;
};

export const updateApplicationStatus = async (userId: string, jobId: string, appId: string, status: string) => {
  const job = await Job.findById(jobId);
  if (!job) {
    const error: any = new Error('Job not found');
    error.statusCode = 404;
    throw error;
  }

  // Ensure caller is an admin/recruiter of the organization that owns the job
  await checkOrgPermission(userId, job.organizationId.toString());

  const app = await Application.findOneAndUpdate(
    { _id: appId, jobId },
    { status },
    { new: true }
  );

  if (!app) {
    const error: any = new Error('Application not found');
    error.statusCode = 404;
    throw error;
  }

  return app;
};
