import mongoose from 'mongoose';

const ImportLogSchema = new mongoose.Schema({
  fileName: String,
  timestamp: { type: Date, default: Date.now },
  total: Number,
  inserted: Number,
  updated: Number,
  failed: Number,
  failedLogs: [{ job: Object, reason: String }]
});

export default mongoose.model('ImportLog', ImportLogSchema);
