import { Profile } from '../../models/Profile';

export const getPortfolio = async (handle: string) => {
  // First try to find by customUrlSlug, then by the default handle
  let profile = await Profile.findOne({ 'portfolioConfig.customUrlSlug': handle })
    .populate('userId', 'email verifyTier')
    .populate('projects', 'title description technologies demoUrl repositoryUrl');

  if (!profile) {
    profile = await Profile.findOne({ handle })
      .populate('userId', 'email verifyTier')
      .populate('projects', 'title description technologies demoUrl repositoryUrl');
  }

  if (!profile) throw new Error('Portfolio not found');

  // Here we would typically map the data to match the public portfolio view
  // Respecting the `visibleSections` configuration.
  const config = profile.portfolioConfig || { theme: 'light', visibleSections: ['about', 'skills', 'projects', 'education'] };
  
  const publicData: any = {
    handle: profile.handle,
    theme: config.theme,
    user: profile.userId, // Contains verifyTier which is important for trust
    links: profile.links,
  };

  if (config.visibleSections.includes('about')) publicData.about = profile.about;
  if (config.visibleSections.includes('skills')) publicData.skills = profile.skills;
  if (config.visibleSections.includes('projects')) publicData.projects = profile.projects;
  if (config.visibleSections.includes('education')) publicData.education = profile.education;
  if (config.visibleSections.includes('github')) publicData.githubRepositories = profile.githubRepositories;

  return publicData;
};

export const updatePortfolioConfig = async (userId: string, updates: any) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) throw new Error('Profile not found');

  if (!profile.portfolioConfig) {
    profile.portfolioConfig = { theme: 'light', visibleSections: [], customUrlSlug: '' };
  }

  if (updates.theme) profile.portfolioConfig.theme = updates.theme;
  if (updates.visibleSections) profile.portfolioConfig.visibleSections = updates.visibleSections;
  if (updates.customUrlSlug) profile.portfolioConfig.customUrlSlug = updates.customUrlSlug;

  await profile.save();
  return profile.portfolioConfig;
};
