import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/mongo.js';
import { scheduleJob } from './cron.js';
import importLogsRoute from './routes/importLogs.js';
import { errorHandler } from './middlewares/errorHandler.js';
import './jobs/importWorker.js';


dotenv.config();
const app = express();


// Middleware setup
app.use(cors());
app.use(express.json());
app.use('/api/import-logs', importLogsRoute);
app.use(errorHandler);

connectDB();
scheduleJob();


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
