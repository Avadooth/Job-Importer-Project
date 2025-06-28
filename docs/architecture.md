# 🧠 Architecture – Job Importer System

## 🎯 Goal

Build a scalable, cron-based job ingestion system that fetches job data from external XML APIs, processes the data asynchronously, stores it in MongoDB, and logs import history for transparency and debugging.

---

## 🏗️ High-Level Overview

```
                        ┌────────────────────────────┐
                        │  Cron Scheduler (node-cron)│
                        └────────────┬───────────────┘
                                     │ Every hour
                                     ▼
                         ┌────────────────────────┐
                         │ Fetch XML job feeds    │
                         └────────────┬───────────┘
                                      │
                   ┌──────────────────▼──────────────────────┐
                   │ Parse XML to JSON using fast-xml-parser │
                   └──────────────────┬──────────────────────┘
                                      │
                        ┌─────────────▼──────────────┐
                        │ Push job array to Redis Q  │
                        │  (BullMQ – import-jobs)    │
                        └─────────────┬──────────────┘
                                      │
                              Worker picks up jobs
                                      ▼
                    ┌────────────────────────────────────┐
                    │ For each job:                      │
                    │  • Normalize fields                │
                    │  • Upsert into MongoDB             │
                    │  • Track success/fail counts       │
                    └────────────────────────────────────┘
                                      │
                                      ▼
                         ┌────────────────────────┐
                         │ Save import log entry  │
                         │ to `import_logs`       │
                         └────────────────────────┘
```

---

## 📦 Data Flow Summary

1. **Feeds**: Provided via `.env` as comma-separated URLs.
2. **Cron**: Triggers every hour and iterates through each feed.
3. **Fetcher**: Downloads XML, parses to JSON, and pushes jobs into the queue.
4. **Queue**: Jobs are sent to Redis using BullMQ (`import-jobs` queue).
5. **Worker**: Pulls jobs with concurrency (default: 5), normalizes fields, and performs insert/update.
6. **Logging**: A summary of each import (counts, feed URL, timestamp, failures) is stored in `import_logs`.

---

## 🧩 Key Components

### 1. **Cron Scheduler (`cron.js`)**
- Runs every hour (`0 * * * *`)
- Reads from `JOB_FEEDS` env variable
- For each feed, fetches jobs and queues them

### 2. **Fetch Service**
- Downloads XML using Axios
- Parses to JSON with `fast-xml-parser`
- Handles malformed feeds or invalid responses

### 3. **Queue Setup (BullMQ)**
- Queue: `import-jobs`
- Queue Options:
  - `removeOnComplete`: Cleans up after processing
  - `removeOnFail`: Retains failed jobs briefly
- Redis is used as the job broker

### 4. **Worker**
- Listens to `import-jobs` queue
- Processes jobs in batch
- For each job:
  - Extracts fields (title, company, link, etc.)
  - Generates `jobId` from GUID/link
  - Uses Mongoose’s `findOneAndUpdate` or custom upsert
- Tracks:
  - `new` (inserted)
  - `updated`
  - `failed` (with reasons)

### 5. **MongoDB Models**
- `Job`: Contains job listings with unique `jobId`
- `ImportLog`: Tracks each run’s summary stats

### 6. **Admin Panel (React UI)**
- Page: `/import-history`
- Fetches import logs via API
- Displays job count stats per run (timestamp, feed, new, updated, failed)

---

## 📌 Design Decisions

|          Decision           | Rationale                                                                         |
|-----------------------------|-----------------------------------------------------------------------------------|
| **BullMQ**                  | Better concurrency control, retry strategies, Redis-based background   processing |
| **MongoDB**                 | Flexible schema for job data, ideal for upserting                                 |
| **fast-xml-parser**         | Lightweight and fast parsing of XML                                               |
| **Separate Worker Process** | Enables horizontal scaling and fault tolerance                                    |
| **Logging per import**      | Makes troubleshooting easy, provides transparency                                 |
| **React Admin Panel**       | Simple way to monitor system health (via logs)                                    |
-------------------------------------------------------------------------------------------------------------------
---

## 🚨 Error Handling

| Area           |  Strategy                        |
|----------------|----------------------------------|
| Invalid XML    | Caught and logged per feed       |
| Redis OOM      | Add retry logic, tune job TTLs   |
| Mongo Fail     | Log job as failed with reason    |
| Missing Fields | Fail gracefully (log + skip)     |

---

## 💡 Scalability Considerations

- You can increase worker concurrency via `.env`
- Feeds are modular – just add more to `JOB_FEEDS`
- Workers can be run on separate nodes (microservice-friendly)
- Job processing is isolated from UI/backend
- Use `Docker` for containerized deploys (optional)

---

## 🔒 Assumptions

- Each feed has jobs with some form of unique identifier
- XML will not be deeply nested or malformed (but fallback exists)
- This is a backend tool – no public-facing features assumed
- System is time-triggered, not on-demand (though could be)

---

## 🔌 Future Improvements

- Add pagination support if feeds support it
- Job deduplication across feeds
- Add alerting (email/Slack) for failed runs
- Authentication for admin panel
- Expose logs via API for monitoring tools

---

## 📎 File Map – Responsibilities

| File                       | Role                          |
|----------------------------|-------------------------------|
| `cron.js`                  | Schedules imports every hour  |
| `fetchService.js`          | Fetches/parses XML from URLs  |
| `jobQueue.js`              | Sets up BullMQ queue          |
| `importWorker.js`          | Processes job queue entries   |
| `jobService.js`            | Upserts job into Mongo        |
| `logService.js`            | Logs import metadata          |
| `ImportHistory.jsx`        | Displays import logs (React)  |

---

## ✅ Summary

This system is modular, testable, and built with scale in mind. It decouples fetching from processing and logs everything in detail. You can add more feeds, scale workers independently, or deploy using any cloud platform with ease.

```bash
Backend = Express + BullMQ + Redis + MongoDB
Frontend = React + Axios (Admin Panel)
```

