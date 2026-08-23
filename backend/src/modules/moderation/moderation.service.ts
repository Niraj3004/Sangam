import { Report } from '../../models/Report';
import { Opportunity } from '../../models/Opportunity';
import { Project } from '../../models/Project';

export const submitReport = async (reporterId: string, reportedEntityId: string, entityModel: string, reason: string) => {
  try {
    const report = await Report.create({
      reporterId,
      reportedEntityId,
      entityModel: entityModel as 'Opportunity' | 'Project' | 'User',
      reason,
    });
    return report;
  } catch (error: any) {
    if (error.code === 11000) {
      const err: any = new Error('You have already reported this entity.');
      err.statusCode = 400;
      throw err;
    }
    throw error;
  }
};

export const getQueue = async () => {
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
    } else if (report.entityModel === 'User') {
      // For MVP, we won't automatically delete users via simple report resolution, 
      // maybe just suspend them in a future iteration.
      // But we'll leave it as a no-op for Users right now to prevent accidental account deletion.
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
