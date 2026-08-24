import { User } from '../../models/User';
import { Profile } from '../../models/Profile';
import { Opportunity } from '../../models/Opportunity';
import { Project } from '../../models/Project';

export const globalSearch = async (query: string, type: string = 'all', page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;

  // AI Semantic Search Seam (Part 2 A8)
  // if (useAiSemanticSearch) { return await semanticSearch(query, ...); }

  const results: any = {};
  const searchConfig = { $text: { $search: query } };
  const sortConfig: any = { score: { $meta: 'textScore' } };

  if (type === 'all' || type === 'users') {
    // Search profiles (skills, interests indexed)
    const profiles = await Profile.find(searchConfig, sortConfig)
      .sort(sortConfig)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'role verifyTier email');
    results.users = profiles;
  }

  if (type === 'all' || type === 'opportunities') {
    const opportunities = await Opportunity.find(searchConfig, sortConfig)
      .sort(sortConfig)
      .skip(skip)
      .limit(limit)
      .populate('posterId', 'role verifyTier');
    results.opportunities = opportunities;
  }

  if (type === 'all' || type === 'projects') {
    const projects = await Project.find(searchConfig, sortConfig)
      .sort(sortConfig)
      .skip(skip)
      .limit(limit)
      .populate('ownerId', 'role verifyTier');
    results.projects = projects;
  }

  return results;
};
