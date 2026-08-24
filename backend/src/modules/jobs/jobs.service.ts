import { Job, IJob } from '../../models/Job';
import { Organization } from '../../models/Organization';
import { Application } from '../../models/Application';
import { User } from '../../models/User';
import { Profile } from '../../models/Profile';
import { runModerationHook } from '../moderation/moderation.service';
import { sendEmail } from '../../config/mailer';
import { env } from '../../config/env.config';

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

  const job = await Job.create({ ...data, organizationId: data.organizationId });
  
  // Async AI Moderation Hook (B13)
  runModerationHook(job._id as unknown as string, 'Job', `${job.title} ${job.description}`).catch(console.error);

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

  const applicant = await User.findById(userId);
  const applicantProfile = await Profile.findOne({ userId });
  const applicantName = applicantProfile?.handle || 'A student';
  const org = await Organization.findById(job.organizationId);

  if (org) {
    const admins = org.members.filter(m => m.role === 'admin' || m.role === 'recruiter');
    for (const admin of admins) {
      const adminUser = await User.findById(admin.userId);
      if (adminUser) {
        sendEmail(
          adminUser.email,
          `New Application for ${job.title}`,
          'New Job Application',
          `<p><strong>${applicantName}</strong> has applied for the <strong>${job.title}</strong> role at your organization.</p>
           ${coverLetter ? `<p><strong>Cover Letter:</strong> "${coverLetter}"</p>` : ''}
           <p>Log in to review their application and resume.</p>`,
          `${env.CLIENT_URL}/organizations/${org._id}/applications`,
          'Review Application'
        ).catch(console.error);
      }
    }
  }

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

  const applicant = await User.findById(app.applicantId);
  const org = await Organization.findById(job.organizationId);

  if (applicant && org) {
    const title = status === 'accepted' ? 'Application Accepted! 🎉' : 'Application Update';
    const body = status === 'accepted'
      ? `<p>Congratulations! Your application for <strong>${job.title}</strong> at <strong>${org.name}</strong> has been accepted.</p>
         <p>The organization will reach out to you with next steps.</p>`
      : (status === 'rejected' 
         ? `<p>Your application for <strong>${job.title}</strong> at <strong>${org.name}</strong> has been reviewed but was not accepted at this time.</p>
            <p>Keep exploring other opportunities on Sangam!</p>`
         : `<p>Your application for <strong>${job.title}</strong> at <strong>${org.name}</strong> has been updated to <strong>${status}</strong>.</p>`);

    if (status !== 'applied') { // Only send on actual state changes
      sendEmail(
        applicant.email,
        `Job Application ${status === 'accepted' ? 'Accepted' : 'Update'}`,
        title,
        body,
        `${env.CLIENT_URL}/jobs/${job._id}`,
        'View Job'
      ).catch(console.error);
    }
  }

  return app;
};
