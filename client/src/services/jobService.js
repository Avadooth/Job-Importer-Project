import api from './request';

export const getImportLogs = async () => {
  const res = await api.get('api/import-logs');
  console.log("api-------------",res)
  return res.data;
};
