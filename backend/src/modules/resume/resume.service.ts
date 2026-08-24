import { Resume } from '../../models/Resume';
import { Profile } from '../../models/Profile';
import { Job } from '../../models/Job';
import { gateway } from '../ai-gateway';
import { aiConfig } from '../../config/ai';
import { resumeBuilderSchema } from '../../models/ai-schemas/resume.schema';

export const generateResume = async (userId: string, targetJobId?: string, targetRole?: string, title: string = 'My AI Resume') => {
  const profile = await Profile.findOne({ userId }).populate('projects');
  if (!profile) throw new Error('Profile not found');

  let jobDesc = '';
  if (targetJobId) {
    const job = await Job.findById(targetJobId);
    if (job) jobDesc = job.description;
  }

  const textPayload = `
    Student Profile:
    - Education: ${(profile.education || []).join(', ')}
    - Skills: ${(profile.skills || []).map(s => s.name).join(', ')}
    - About: ${profile.about || ''}
    - Projects: ${(profile.projects || []).map((p: any) => p.title).join(', ')}

    Target Job Description (Tailor the resume to match this if provided):
    ${jobDesc ? jobDesc : targetRole ? `Target Role: ${targetRole}` : 'No specific job targeted. Make it a general, strong resume.'}
    
    Generate a highly professional resume draft with tailored sections and a summary.
  `;

  try {
    const aiDraft = await gateway.extract(resumeBuilderSchema, textPayload, aiConfig.taskProfiles.explain);

    const resume = await Resume.create({
      userId,
      targetJobId,
      title: targetRole ? `${targetRole} Resume` : title,
      summary: aiDraft.summary || profile.about || 'A passionate student ready for opportunities.',
      sections: aiDraft.sections || [],
      status: 'draft',
    });

    return resume;
  } catch (e) {
    console.error('[ResumeService] AI Resume Generation Failed:', e);
    throw new Error('Failed to generate AI resume.');
  }
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
