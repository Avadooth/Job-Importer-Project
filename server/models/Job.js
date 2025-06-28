// models/Job.js
import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  jobId: { type: String, required: true, unique: true }, // e.g., GUID or link
  title: String,
  company: String,
  type: String,
  location: String,
  description: String,
  url: String,
  publishedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Job', jobSchema);
