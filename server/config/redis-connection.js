// config/redis-connection.js
import dotenv from 'dotenv';
import Redis from 'ioredis';
dotenv.config();

export const redisConnection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

// Check Redis connection and fix eviction policy
redisConnection.ping()
  .then(async () => {
    console.log('✅ Redis connected successfully (via ioredis)');

  }
  ).catch((err) => {
    console.error('❌ Redis connection error:', err);
  });
