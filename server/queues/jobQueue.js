// jobQueue.js
import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis-connection.js';

export const jobQueue = new Queue('import-jobs', {
  defaultJobOptions: {
    removeOnComplete: { age: 3600, count: 1000 },
    removeOnFail: { age: 7200, count: 1000 }
  },
  connection: redisConnection
});
