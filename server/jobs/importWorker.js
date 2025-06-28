import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis-connection.js';
import { upsertJob } from '../services/jobService.js';
import { logImportResult } from '../services/logService.js';
import crypto from 'crypto';

export const worker = new Worker('import-jobs', async (job) => {
  const { jobs, fileName } = job.data;
  let inserted = 0, updated = 0, failed = 0;
  const failedLogs = [];

  for (let jobData of jobs) {
    try {
      // Normalize job fields
      jobData = {
        jobId: jobData?.guid?._ || jobData?.guid || jobData?.link || jobData?.id || crypto.randomUUID(),
        title: jobData.title,
        company: jobData['job_listing:company'] || '',
        type: jobData['job_listing:job_type'] || '',
        location: jobData['job_listing:location'] || '',
        description: jobData.description || jobData['content:encoded'] || '',
        url: jobData.link || '',
        publishedAt: jobData.pubDate ? new Date(jobData.pubDate) : new Date()
      };

      const result = await upsertJob(jobData);
      result.isNew ? inserted++ : updated++;
    } catch (err) {
      failed++;
      failedLogs.push({ job: jobData.title || 'N/A', reason: err.message });
    }
  }

  await logImportResult({ fileName, total: jobs.length, inserted, updated, failed, failedLogs });
}, {
  connection: redisConnection,
  concurrency: parseInt(process.env.WORKER_CONCURRENCY || '5'),
});

//  Graceful Shutdown
const shutdown = async () => {
  console.log('shutting down worker.');
  await worker.close();
  await redisConnection.quit();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
