import ImportLog from '../models/ImportLog.js';

export const getImportLogs = async (req, res) => {
  try {
    const logs = await ImportLog
      .find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .lean();
    res.status(200).json(logs);
  } catch (err) {
    console.error('[❌] Error fetching logs:', err.message);
    res.status(500).json({ error: 'Failed to fetch import logs', details: err.message });
  }
};
