import { Resume } from '../../models/Resume';
import { Profile } from '../../models/Profile';
import { Job } from '../../models/Job';
import { gateway } from '../ai-gateway';
import { aiConfig } from '../../config/ai';
import { resumeBuilderSchema } from '../../models/ai-schemas/resume.schema';

export const generateResume = async (userId: string, targetJobId?: string, targetRole?: string, title: string = 'My AI Resume', additionalContext?: string) => {
  const profile = await Profile.findOne({ userId }).populate('projects');
  if (!profile) throw new Error('Profile not found');

  let jobDesc = '';
  if (targetJobId) {
    const job = await Job.findById(targetJobId);
    if (job) jobDesc = job.description;
  }

  const formatEducation = (edu: any[]) => edu.map(e => `${e.degree || 'Student'} at ${e.institution} (${e.startYear || 'N/A'} - ${e.endYear || 'Present'})`).join('; ');
  const formatExperience = (exp: any[]) => exp.map(e => `${e.title} at ${e.company} (${e.startDate || 'N/A'} - ${e.endDate || 'Present'}): ${e.description || ''}`).join(' | ');
  const formatCertifications = (certs: any[]) => certs.map(c => `${c.name} by ${c.issuer} (${c.issueDate || ''})`).join(' | ');
  const formatProjects = (projs: any[]) => projs.map(p => `${p.title}: ${p.description}`).join(' | ');
  const formatGithub = (repos: any[]) => repos.map(r => `${r.name} (${r.language || 'Unknown'}): ${r.description || 'No description'} [Stars: ${r.stars || 0}]`).join(' | ');

  const textPayload = `
    Student Profile Details:
    - Name/Handle: ${profile.name || profile.handle}
    - Location: ${profile.location || 'Not specified'}
    - Contact Phone: ${profile.phone || 'Not specified'}
    - Career Goal: ${profile.careerGoal || 'Not specified'}
    - Availability: ${profile.availability || 'Not specified'}
    - Looking For: ${(profile.lookingFor || []).join(', ') || 'Not specified'}
    - Interests: ${(profile.interests || []).join(', ') || 'Not specified'}
    - Languages: ${(profile.languages || []).join(', ') || 'Not specified'}
    - About: ${profile.about || ''}
    
    Education & Experience:
    - Education: ${formatEducation(profile.education || [])}
    - Experience: ${formatExperience(profile.experience || [])}
    - Certifications: ${formatCertifications(profile.certifications || [])}
    
    Skills & Accomplishments:
    - Skills: ${(profile.skills || []).map(s => s.name).join(', ')}
    - Projects: ${formatProjects(profile.projects || [])}
    - GitHub Repositories: ${formatGithub(profile.githubRepositories || [])}
    - Achievements: ${(profile.achievements || []).join(', ')}

    Target Job Description (Tailor the resume to match this if provided):
    ${jobDesc ? jobDesc : targetRole ? `Target Role: ${targetRole}` : 'No specific job targeted. Make it a general, strong resume.'}
    
    ${additionalContext ? `USER'S SPECIAL INSTRUCTIONS FOR YOU:\n    ${additionalContext}\n\n    CRITICAL: If the user instructions ask you to focus on specific items or exclude others, YOU MUST STRICTLY OBEY. Do not blindly copy all education or projects if the user specifically asked to only include certain ones.` : ''}
    
    CRITICAL FORMATTING RULES:
    1. For any item with a date (Education, Experience), format the first line EXACTLY like this:
       **Item Title or Degree** | YYYY-YYYY
    2. For projects, format the first line EXACTLY like this:
       **Project Name** - Tech Stack
    3. For achievements, explicitly state the exact name of the award/achievement in bold first, followed by a description. (e.g. "**AWS Certified Developer** - Achieved highest score...")
    4. Use professional, ATS-friendly bullet points.
    5. Keep the summary under 4 lines.
    
    Generate a highly professional resume draft with tailored sections and a summary matching the requested style.
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
  } catch (e: any) {
    console.error('[ResumeService] AI Resume Generation Failed:', e);
    throw new Error('Failed to generate AI resume: ' + (e.message || String(e)));
  }
};

export const getResumes = async (userId: string) => {
  return Resume.find({ userId }).sort({ updatedAt: -1 });
};

export const getResumeById = async (userId: string, resumeId: string) => {
  const resume = await Resume.findOne({ _id: resumeId, userId });
  if (!resume) throw new Error('Resume not found');
  return resume;
};

export const updateResume = async (userId: string, resumeId: string, updates: any) => {
  const resume = await Resume.findOneAndUpdate(
    { _id: resumeId, userId },
    { $set: updates },
    { returnDocument: 'after' }
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
export const deleteResume = async (userId: string, resumeId: string) => {
  const result = await Resume.deleteOne({ _id: resumeId, userId });
  if (result.deletedCount === 0) {
    throw new Error('Resume not found or unauthorized');
  }
  return { success: true };
};
