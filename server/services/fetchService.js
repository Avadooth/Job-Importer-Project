import axios from 'axios';
import { parseXML } from '../utils/xmlParser.js';

export const fetchJobsFromFeed = async (url) => {
  const res = await axios.get(url);
  const jobs = await parseXML(res.data);
  return jobs;
};
