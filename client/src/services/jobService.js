import api from './request';

export const getImportLogs = async () => {
  const res = await api.get('/import-logs');
  return res.data;
};
