import cron from 'node-cron';
import { connectDB } from '../config/db';

const extractStructuredData = async (text: string) => {
  return {
    title: 'Stub Opportunity',
    description: 'Extracted description stub.',
    confidence: 0.9,
  };
};
import { ReviewQueueItem } from '../models/ReviewQueueItem';
import { Opportunity } from '../models/Opportunity';
import { processDeadlineReminders } from './reminders';
import { processWeeklyDigests } from './digest';

const runRadarEngine = async () => {
  console.log('[WORKER] Starting Radar Engine fetch cycle...');
  
  try {
    // 1. Stub: Fetch from an RSS or API source
    const rawData = "Raw data from an external RSS feed about an internship at TechCorp.";

    // 2. AI Extraction
    const extracted = await extractStructuredData(rawData);
    console.log(`[WORKER] Extracted: ${extracted.title}`);

    // 3. Deduplication (Stub logic)
    const existing = await Opportunity.findOne({ title: extracted.title });
    if (existing) {
      console.log('[WORKER] Item already exists. Skipping.');
      return;
    }

    // Create the Opportunity with status 'review' (requires dummy or system posterId)
    // For MVP, we'll use a hardcoded or empty posterId, but our schema requires one.
    // Let's create a stub system user ID: '000000000000000000000000'
    const opportunity = await Opportunity.create({
      title: extracted.title,
      description: extracted.description,
      posterId: '000000000000000000000000', // stub
      type: 'project',
      status: extracted.confidence >= 0.9 ? 'active' : 'draft',
      // We don't have relevanceScore in our Opportunity model right now, so we skip it.
    });

    if (opportunity.status === 'draft') {
      await ReviewQueueItem.create({
        entityId: opportunity._id,
        entityModel: 'Opportunity',
        reason: 'Low confidence AI extraction',
      });
      console.log('[WORKER] Low confidence. Sent to Review Queue.');
    } else {
      console.log('[WORKER] High confidence. Auto-published.');
    }

  } catch (error) {
    console.error('[WORKER] Error in Radar Engine:', error);
  }
};

const bootWorker = async () => {
  await connectDB();
  console.log('[WORKER] Connected to DB. Worker is running.');

  // Schedule Radar Engine
  cron.schedule('*/5 * * * *', () => {
    runRadarEngine();
  });

  // Schedule Deadline Reminders (Daily at 9:00 AM)
  cron.schedule('0 9 * * *', () => {
    processDeadlineReminders();
  });

  // Schedule Weekly Digests (Sunday at 9:00 AM)
  cron.schedule('0 9 * * 0', () => {
    processWeeklyDigests();
  });
};

bootWorker();
