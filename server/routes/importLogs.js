import express from 'express';
import { getImportLogs } from '../controllers/importLogsController.js';

const router = express.Router();
router.get('/', getImportLogs);

export default router;
