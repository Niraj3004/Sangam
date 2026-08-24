import { Profile } from '../../models/Profile';
import { SavedItem } from '../../models/SavedItem';
import { Application } from '../../models/Application';
import { Project } from '../../models/Project';
import { Community } from '../../models/Community';

export const getStudentDashboard = async (userId: string) => {
  // 1. Fetch profile and calculate completion score dynamically
  const profile = await Profile.findOne({ userId });
  let completionScore = 0;
  
  if (profile) {
    let score = 20; // Base score for having a profile
    if (profile.about) score += 10;
    if (profile.education && profile.education.length > 0) score += 20;
    if (profile.skills && profile.skills.length > 0) score += 20;
    if (profile.careerGoal) score += 15;
    if (profile.projects && profile.projects.length > 0) score += 15;
    completionScore = Math.min(score, 100);
  }

  // 2. Fetch recent saved opportunities
  const savedItems = await SavedItem.find({ userId, entityModel: 'Opportunity' })
    .sort({ createdAt: -1 })
    .limit(5); // In a real app we'd populate the entity

  // 3. Fetch applications and their statuses
  const applications = await Application.find({ applicantId: userId })
    .sort({ updatedAt: -1 })
    .limit(5)
    .populate('jobId', 'title org');

  // 4. Fetch active projects
  const activeProjects = await Project.find({
    $or: [
      { ownerId: userId },
      { 'members.userId': userId }
    ],
    status: 'active'
  }).select('title status');

  // 5. Build the AI recommended next actions (stub)
  const aiNextActions = [];
  if (completionScore < 100) {
    aiNextActions.push({
      type: 'profile_incomplete',
      message: 'Complete your profile to get better recommendations.',
      action: '/profile/edit'
    });
  }
  if (applications.length === 0) {
    aiNextActions.push({
      type: 'no_applications',
      message: 'You haven\'t applied to any jobs yet. Check out your personalized feed.',
      action: '/jobs'
    });
  }

  return {
    profile: {
      handle: profile?.handle,
      careerGoal: profile?.careerGoal,
      completionScore,
    },
    activity: {
      savedOpportunitiesCount: await SavedItem.countDocuments({ userId, entityModel: 'Opportunity' }),
      activeApplicationsCount: await Application.countDocuments({ applicantId: userId, status: { $nin: ['rejected', 'offer'] } }),
      activeProjectsCount: activeProjects.length,
    },
    recentApplications: applications,
    activeProjects,
    aiNextActions,
  };
};
