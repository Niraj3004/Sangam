import cron from 'node-cron';
import { connectDB } from '../config/db';

import { extractOpportunity } from '../modules/extraction/extraction.service';
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
    const extracted = await extractOpportunity(rawData);
    console.log(`[WORKER] Extracted: ${extracted.title} (Confidence: ${extracted.confidence})`);

    // 3. Deduplication (Check by title or url)
    const existing = await Opportunity.findOne({ 
      $or: [
        { title: extracted.title, posterId: '000000000000000000000000' }
      ]
    });

    if (existing) {
      console.log('[WORKER] Item already exists. Skipping.');
      return;
    }

    // Create the Opportunity with status based on confidence
    const opportunity = await Opportunity.create({
      title: extracted.title,
      description: extracted.description,
      posterId: '000000000000000000000000', // system worker user
      type: extracted.type as any,
      endDate: extracted.deadline,
      isExternal: !!extracted.url,
      externalLink: extracted.url,
      tags: extracted.eligibility,
      status: extracted.confidence >= 0.8 ? 'active' : 'draft',
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
