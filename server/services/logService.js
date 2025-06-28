import ImportLog from '../models/ImportLog.js';

export const logImportResult = async ({ fileName, total, inserted, updated, failed, failedLogs }) => {
  await ImportLog.create({ fileName, total, inserted, updated, failed, failedLogs });
};
