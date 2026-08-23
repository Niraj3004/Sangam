import { Request, Response } from 'express';
import { Profile } from '../../models/Profile';
import { User } from '../../models/User';
import { sendSuccess } from '../../utils/response';

export const getDiscoverPeople = async (req: Request, res: Response) => {
  const { skill, college, country, interest, page = '1', limit = '10' } = req.query;

  const filter: any = {};

  if (skill) {
    filter['skills.name'] = { $regex: new RegExp(skill as string, 'i') };
  }
  if (college) {
    filter['education'] = { $regex: new RegExp(college as string, 'i') };
  }
  if (country) {
    filter['location'] = { $regex: new RegExp(country as string, 'i') };
  }
  if (interest) {
    filter['interests'] = { $regex: new RegExp(interest as string, 'i') };
  }

  // Exclude current user
  filter.userId = { $ne: req.user!.userId };

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  const [profiles, total] = await Promise.all([
    Profile.find(filter)
      .populate('userId', 'email verifyTier role')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 }),
    Profile.countDocuments(filter)
  ]);

  sendSuccess(res, {
    profiles,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  }, 200);
};
