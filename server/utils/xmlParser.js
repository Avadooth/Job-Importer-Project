import xml2js from 'xml2js';

export const parseXML = async (xml) => {
  const parsed = await xml2js.parseStringPromise(xml, { explicitArray: false });
  const jobs = parsed?.rss?.channel?.item;
  return Array.isArray(jobs) ? jobs : jobs ? [jobs] : [];
};
