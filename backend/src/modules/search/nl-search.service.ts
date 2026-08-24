import { gateway } from '../ai-gateway';
import { aiConfig } from '../../config/ai';
import { nlSearchSchema } from '../../models/ai-schemas/search.schema';
import { Opportunity } from '../../models/Opportunity';
import { Profile } from '../../models/Profile';
import { Project } from '../../models/Project';

export interface NLSearchParams {
  targetEntity: 'opportunities' | 'users' | 'projects';
  skills: string[];
  location?: string;
  isRemote?: boolean;
  type?: string;
  searchText?: string;
}

export const parseNLQuery = async (query: string): Promise<NLSearchParams> => {
  const textPayload = `
    Natural Language Query: "${query}"
    
    Please parse this search query into structured database filters. 
    Figure out if they are looking for jobs/opportunities, other students/users, or projects to join.
  `;

  try {
    const result = await gateway.extract(nlSearchSchema, textPayload, aiConfig.taskProfiles.extract);
    
    return {
      targetEntity: result.targetEntity || 'opportunities',
      skills: result.skills || [],
      location: result.location,
      isRemote: result.isRemote,
      type: result.type,
      searchText: result.searchText
    };
  } catch (error) {
    console.error('[NLSearchService] Parsing failed:', error);
    throw new Error('Failed to parse search query.');
  }
};

export const executeNLSearch = async (query: string) => {
  const filters = await parseNLQuery(query);
  console.log('[NLSearchService] Parsed Filters:', filters);

  const dbQuery: any = {};

  if (filters.isRemote) {
    if (filters.targetEntity === 'opportunities' || filters.targetEntity === 'projects') {
      dbQuery.isRemote = true;
    } else if (filters.targetEntity === 'users') {
      dbQuery.availability = 'remote';
    }
  }

  if (filters.location && filters.location.trim() !== '') {
    dbQuery.location = { $regex: new RegExp(filters.location, 'i') };
  }

  // Text search for remaining keywords or skills
  const searchTerms = [...(filters.skills || []), filters.searchText || ''].filter(Boolean).join(' ');
  if (searchTerms.trim()) {
    dbQuery.$text = { $search: searchTerms };
  }

  let results: any = [];

  if (filters.targetEntity === 'opportunities') {
    if (filters.type) {
      // Basic fuzzy match for type if provided
      dbQuery.type = { $regex: new RegExp(filters.type, 'i') };
    }
    dbQuery.status = 'active';
    
    let queryObj = Opportunity.find(dbQuery);
    if (dbQuery.$text) {
      queryObj = queryObj.select({ score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } } as any);
    } else {
      queryObj = queryObj.sort({ createdAt: -1 });
    }
    results = await queryObj.limit(20).lean();

  } else if (filters.targetEntity === 'projects') {
    dbQuery.status = 'active';
    
    let queryObj = Project.find(dbQuery);
    if (dbQuery.$text) {
      queryObj = queryObj.select({ score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } } as any);
    } else {
      queryObj = queryObj.sort({ createdAt: -1 });
    }
    results = await queryObj.limit(20).lean();

  } else if (filters.targetEntity === 'users') {
    let queryObj = Profile.find(dbQuery).populate('userId', 'email');
    if (dbQuery.$text) {
      queryObj = queryObj.select({ score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } } as any);
    } else {
      queryObj = queryObj.sort({ updatedAt: -1 });
    }
    results = await queryObj.limit(20).lean();
  }

  return {
    parsedFilters: filters,
    results
  };
};
