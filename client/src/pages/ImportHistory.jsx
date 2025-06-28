import React, { useEffect, useState } from 'react';
import Table from '../components/Table';
import { getImportLogs } from '../services/jobService';

const columns = [
  { field: 'timestamp', label: 'Timestamp', render: (val) => new Date(val).toLocaleString() },
  { field: 'fileName', label: 'File Name' },
  { field: 'total', label: 'Total Jobs' },
  { field: 'inserted', label: 'New' },
  { field: 'updated', label: 'Updated' },
  { field: 'failed', label: 'Failed' },
];

const ImportHistory = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    async function fetchLogs() {
      try {
        const response = await getImportLogs();
        setLogs(response);
      } catch (err) {
        console.error('Failed to load logs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  return (
    <div className="container">
      <h2>📄 Import History</h2>
      {loading ? <p>Loading...</p> : <Table columns={columns} data={logs} />}
    </div>
  );
};

export default ImportHistory;
