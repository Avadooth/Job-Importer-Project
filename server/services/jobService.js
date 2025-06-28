import Job from '../models/Job.js'; // ✅ now the correct model

export const upsertJob = async (jobData) => {
  try {
    const existing = await Job.findOne({ jobId: jobData.jobId });

    if (existing) {
      await Job.updateOne({ jobId: jobData.jobId }, jobData, { upsert: true });
      return { isNew: false };
    } else {
      await Job.create(jobData);
      return { isNew: true };
    }
  } catch (err) {
    console.error('inserting/updating job:', {
      jobId: jobData.jobId,
      title: jobData.title,
      reason: err.message
    });
    throw err;
  }
};
