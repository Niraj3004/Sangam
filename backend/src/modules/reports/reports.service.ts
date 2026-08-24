import { Report, IReport } from '../../models/Report';

export const createReport = async (reporterId: string, entityId: string, entityModel: string, reason: string) => {
  // Prevent spamming reports
  const existing = await Report.findOne({ reporterId, entityId });
  if (existing) {
    const error: any = new Error('You have already reported this item.');
    error.statusCode = 400;
    throw error;
  }

  const report = await Report.create({
    reporterId,
    reportedEntityId: entityId,
    entityModel: entityModel as any,
    reason,
    status: 'pending'
  });

  return report;
};
