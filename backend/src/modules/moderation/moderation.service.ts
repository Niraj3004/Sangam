import { Report } from '../../models/Report';
import { Opportunity } from '../../models/Opportunity';
import { Project } from '../../models/Project';
import { ModerationFlag } from '../../models/ModerationFlag';
import { Post } from '../../models/Post';
import { Job } from '../../models/Job';
import { Comment } from '../../models/Comment';

export const getReportsQueue = async () => {
  const reports = await Report.find({ status: 'pending' })
    .sort({ createdAt: 1 })
    .populate('reporterId', 'email role verifyTier');
    
  return reports;
};

export const resolveReport = async (reportId: string, resolverId: string, action: 'delete' | 'ignore') => {
  const report = await Report.findById(reportId);
  
  if (!report) {
    const error: any = new Error('Report not found');
    error.statusCode = 404;
    throw error;
  }

  if (report.status !== 'pending') {
    const error: any = new Error('Report is already resolved');
    error.statusCode = 400;
    throw error;
  }

  if (action === 'delete') {
    if (report.entityModel === 'Opportunity') {
      await Opportunity.findByIdAndDelete(report.reportedEntityId);
    } else if (report.entityModel === 'Project') {
      await Project.findByIdAndDelete(report.reportedEntityId);
    } else if (report.entityModel === 'Post') {
      await Post.findByIdAndDelete(report.reportedEntityId);
    } else if (report.entityModel === 'Job') {
      await Job.findByIdAndDelete(report.reportedEntityId);
    } else if (report.entityModel === 'Comment') {
      await Comment.findByIdAndDelete(report.reportedEntityId);
    }
    
    // Automatically dismiss any other pending reports for this same entity
    await Report.updateMany(
      { reportedEntityId: report.reportedEntityId, status: 'pending' },
      { $set: { status: 'resolved', resolvedBy: resolverId } }
    );
  } else {
    report.status = 'dismissed';
    report.resolvedBy = resolverId as any;
    await report.save();
  }

  return report;
};

export const getFlagsQueue = async () => {
  const flags = await ModerationFlag.find({ status: 'pending' })
    .sort({ confidenceScore: -1, createdAt: 1 });
    
  return flags;
};

export const actOnFlag = async (flagId: string, moderatorId: string, action: 'approved' | 'rejected') => {
  const flag = await ModerationFlag.findById(flagId);
  if (!flag) {
    const error: any = new Error('Flag not found');
    error.statusCode = 404;
    throw error;
  }

  if (action === 'approved') {
    // Flag approved means content is indeed bad and should be removed
    if (flag.entityModel === 'Opportunity') {
      await Opportunity.findByIdAndDelete(flag.entityId);
    } else if (flag.entityModel === 'Project') {
      await Project.findByIdAndDelete(flag.entityId);
    } else if (flag.entityModel === 'Post') {
      await Post.findByIdAndDelete(flag.entityId);
    } else if (flag.entityModel === 'Job') {
      await Job.findByIdAndDelete(flag.entityId);
    } else if (flag.entityModel === 'Comment') {
      await Comment.findByIdAndDelete(flag.entityId);
    }
  }

  flag.status = action;
  await flag.save();

  return flag;
};
