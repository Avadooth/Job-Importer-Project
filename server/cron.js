import cron from 'node-cron';
import { fetchJobsFromFeed } from './services/fetchService.js';
import { jobQueue } from './queues/jobQueue.js';
import { redisConnection } from './config/redis-connection.js'; // required for flushall

const FEEDS = process.env.JOB_FEEDS?.split(',') || [];

export const scheduleJob = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('⏰ Cron triggered');

    for (const url of FEEDS) {
      try {
        const jobs = await fetchJobsFromFeed(url.trim());

        await jobQueue.add('import', {
          jobs,
          fileName: url.trim()
        }, {
          attempts: 2,
          backoff: {
            type: 'exponential',
            delay: 3000
          }
        });
      } catch (err) {
        console.error(`❌ Error fetching jobs from: ${url.trim()}`, err.message);
      }
    }
    console.log('✅ Cron job done');
  });
};
