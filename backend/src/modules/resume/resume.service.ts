import { Resume } from '../../models/Resume';
import { Profile } from '../../models/Profile';
import { Job } from '../../models/Job';

export const generateResume = async (userId: string, targetJobId?: string, title: string = 'My AI Resume') => {
  const profile = await Profile.findOne({ userId }).populate('projects');
  if (!profile) throw new Error('Profile not found');

  let jobDesc = '';
  if (targetJobId) {
    const job = await Job.findById(targetJobId);
    if (job) jobDesc = job.description;
  }

  // AI GATEWAY SEAM: In Part 2, Claude takes profile data + jobDesc and returns a structured resume JSON.
  // const aiDraft = await callAiGateway({ profile, jobDesc }, 'generate_resume');

  // Baseline Draft Generation
  const sections = [
    {
      title: 'Experience & Projects',
      content: profile.projects.length > 0 ? 'List of relevant projects...' : 'No projects listed yet.',
      order: 1
    },
    {
      title: 'Skills',
      content: profile.skills.map(s => s.name).join(', '),
      order: 2
    },
    {
      title: 'Education',
      content: profile.education.join('\n'),
      order: 3
    }
  ];

  const resume = await Resume.create({
    userId,
    targetJobId,
    title,
    summary: profile.about || 'A passionate student ready for opportunities.',
    sections,
    status: 'draft',
  });

  return resume;
};

export const getResumes = async (userId: string) => {
  return Resume.find({ userId }).sort({ updatedAt: -1 });
};

export const updateResume = async (userId: string, resumeId: string, updates: any) => {
  const resume = await Resume.findOneAndUpdate(
    { _id: resumeId, userId },
    { $set: updates },
    { new: true }
  );
  if (!resume) throw new Error('Resume not found or unauthorized');
  return resume;
};

export const exportResume = async (userId: string, resumeId: string) => {
  const resume = await Resume.findOne({ _id: resumeId, userId });
  if (!resume) throw new Error('Resume not found or unauthorized');

  // Here we would typically render a PDF buffer and return it,
  // or return the standardized JSON for the frontend to render.
  return {
    success: true,
    message: 'Resume ready for export',
    exportData: resume
  };
};
