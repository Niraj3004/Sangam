import { Idea, IIdea } from '../../models/Idea';
import { runModerationHook } from '../moderation/moderation.service';

export const createIdea = async (authorId: string, data: Partial<IIdea>) => {
  const idea = await Idea.create({ ...data, authorId });
  runModerationHook(idea._id as unknown as string, 'Idea', `${idea.title} ${idea.problem} ${idea.solution}`).catch(console.error);
  return idea;
};

export const getIdeas = async (query: string = '', status?: string) => {
  const filter: any = {};
  if (status) filter.status = status;
  if (query) filter.$text = { $search: query };

  const ideas = await Idea.find(filter)
    .sort(query ? { score: { $meta: 'textScore' } } : { createdAt: -1 } as any)
    .populate('authorId', 'email role');
  
  return ideas;
};

export const getIdeaById = async (id: string) => {
  const idea = await Idea.findById(id).populate('authorId', 'email role');
  if (!idea) {
    const error: any = new Error('Idea not found');
    error.statusCode = 404;
    throw error;
  }
  return idea;
};

export const updateIdea = async (id: string, data: Partial<IIdea>) => {
  const idea = await Idea.findByIdAndUpdate(id, data, { returnDocument: 'after' });
  if (!idea) {
    const error: any = new Error('Idea not found');
    error.statusCode = 404;
    throw error;
  }
  return idea;
};

export const deleteIdea = async (id: string) => {
  const idea = await Idea.findByIdAndDelete(id);
  if (!idea) {
    const error: any = new Error('Idea not found');
    error.statusCode = 404;
    throw error;
  }
  return idea;
};

